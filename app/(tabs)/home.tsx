import { View, Text, TouchableOpacity, Image, BackHandler} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { Circle, Geojson, MapMarker, Marker} from 'react-native-maps'
import * as Location from 'expo-location'
import { DefaultErrorResponse, Evento, InfraestruturaGeoJson, InfraestruturaGeoJsonFeature, Problema, RequestCreateAvaliacao, RequestCreateProblema, RequestCreateProblemaImage, RequestEventoByRadius, RequestInfraestruturaByRadius, RequestPageAvaliacao, RequestProblemaByRadius } from '../../types'
import { getEventoById, getEventoByRadius } from '../../api/evento'
import LoadingActivity from '../../components/LoadingActivity'
import ButtonModal from '../../components/ButtonModal'
import { getInfraestrutura, getInfraestruturaById } from '../../api/infraestrutura'
import { checkCreateViabilityProblema, createProblema, createProblemaImage, getProblemaByRadius } from '../../api/problema'
import ShowAlert from '../../components/ShowAlert'
import ProblemaModal from '../../components/ProblemaModal'
import ProblemaView from '../../components/ProblemaView'
import AvaliacaoModal from '../../components/AvaliacaoModal'
import { isPointNearLine , isRegionWithinBounds, animateToUserLocation, mapInfraestruturaGeoJsonResponseToInfraestruturaGeoJson, isSameDate, calculateBearing, isPointNearPoint} from '../../util'
import OpsModal from '../../components/OpsModalMap'
import { createAvaliacao } from '../../api/avaliacao'
import AvaliacaoView from '../../components/AvaliacaoView'
import { router, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import EventCardCarousel from 'components/EventCardCarousel'
import icons from 'constants/icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AudioSpeaker } from 'util/audioSpeaker'
import { AudioPlayer, useAudioPlayer } from 'expo-audio'
import { sounds, prompts } from '../../constants'
import { AxiosError } from 'axios'
import ProblemaModalNavigation from 'components/ProblemaModalNavigation'

interface Region {
  latitude: number
  longitude: number
  latitudeDelta: number
  longitudeDelta: number

}

interface LocationError {
  key: string
  message: string
}

export default function Home() {
  const dateRef = useRef(new Date())
  const [menuVisible, setMenuVisible] = useState<boolean>(false)
  
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null)

  const [initialRegion, setInitialRegion] = useState<Region>({latitude:-23.556312, longitude: -46.637752, latitudeDelta:0.0043, longitudeDelta:0.0034})
  const [currentViewLocation, setCurrentViewLocation] = useState<Region | null>(null)
  const mapRef = useRef<MapView>(null)

  const [isMoved, setIsMoved] = useState<boolean|undefined>(false)
  const isGestureRef = useRef<boolean>(false) 

  const [requestInfraestrutura, setRequestInfraestrutura] = useState<RequestInfraestruturaByRadius>()
  const [infraestrutura, setInfraestrutura] = useState<InfraestruturaGeoJson>()


  const [requestCreateProblema, setRequestCreateProblema] = useState<RequestCreateProblema | null>()
  const [requestProblemas, setRequestProblemas] = useState<RequestProblemaByRadius>()
  const [problemas, setProblemas] = useState<Problema[]>([])
  const [problemaCoords, setProblemaCoords] = useState<{latitude: number, longitude: number} | null>(null)
  const [showProblemaModal, setShowProblemaModal] = useState<boolean>(false)
  const [problemaImage ,setProblemaImage] = useState<string | null>(null)
  const [requestProblemaImage, setRequestProblemaImage] = useState<RequestCreateProblemaImage | null>(null)

  const [pinProblemaSelector, setPinProblemaSelector] = useState<Problema | null>(null)


  const [requestCreateAvaliacao, setRequestCreateAvaliacao] = useState<RequestCreateAvaliacao | null>(null)
  const [showAvaliacaoModal, setShowAvaliacaoModal] = useState<boolean>(false)
  const [idInfraAvaliacao, setIdInfraAvaliacao] = useState<number | null>(null)
  const [requestPageAvaliacao, setRequestPageAvaliacao] = useState<RequestPageAvaliacao | null>(null)

  const [showOpsModal, setShowOpsModal] = useState<boolean>(false)

  const [hilightedEvento, setHilightedEvento] = useState<{evento :Evento, interno: boolean} | null>(null)

  const abortControllerRef = useRef<AbortController>(null)
  const [initalLoading, setInitalLoading] = useState<boolean>(true)
  
  // const [isRequestInProgress, setIsRequestInProgress] = useState(false)
  
  const [isContentLoading, setIsContentLoading] = useState<boolean>(false)
  
  const [requestEventos, setRequestEventos] = useState<RequestEventoByRadius>()
  const [eventos, setEventos] = useState<Evento[]>([])

  const [userAlert, setUserAlert] = useState<{type: 'error'|'loading'|'success', message: string} | null>(null)

  const { eventoId } = useLocalSearchParams<{eventoId: string}>()

  const [navigation, setNavigation] = useState<boolean>(false)
  
  const [currentLocationError, setCurrentLocationError] = useState<LocationError | null> ()
  const locationErrors = {
    PERMISSION : {key: 'PERMISSION', message: 'Permissão de localização negada, cheque as permissões do aplicativo'},
    SERVICE : {key: 'SERVICE', message: 'Serviço de localização desativado'},
    ERROR : {key: 'ERROR', message: 'Erro ao obter localização'}
  }

  const emptyGeoJson: InfraestruturaGeoJson = {
    type: "FeatureCollection",
    features: [],
  }

  

    const getCurrentLocation = async (): Promise<void>  => {
      setInitalLoading(true)
      await Location.hasServicesEnabledAsync()
      .then((response) => {
        if (!response){
          setCurrentLocationError(locationErrors.SERVICE)
          setInitalLoading(false)
        }else {
          setCurrentLocationError(null)
        }
      })
      .catch((error)=> {
        setUserAlert({ type: 'error', message: "Error ao checar serviço de localização: "+ error})
      })

      let {status} = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted'){
        setCurrentLocationError(locationErrors.PERMISSION)
        setInitalLoading(false)
        return
    }
    
    await Location.getCurrentPositionAsync({})
    .then((response) => {
      setCurrentLocation(response)
      setRequestInfraestrutura({
        latitude: response.coords.latitude,
        longitude: response.coords.longitude,
        raio: 750
      })
      setRequestProblemas({
        latitude: response.coords.latitude,
        longitude: response.coords.longitude,
        raio: 750
      })   
      setRequestEventos({
        latitude: response.coords.latitude,
        longitude: response.coords.longitude,
        raio: 7000
      })
      setInitialRegion({latitude: response.coords.latitude, longitude: response.coords.longitude, latitudeDelta:0.0043, longitudeDelta:0.0034})
    })
    .catch((error) => {
      setCurrentLocationError(locationErrors.ERROR)
      setUserAlert({ type: 'error', message: "Error ao obter localização: "+ error})
    }).finally(() => {
      setInitalLoading(false)
    })
  }

  useEffect(()=>{
    if(!currentLocation){
      getCurrentLocation()
    }
  // setInterval(
  //   getCurrentLocation
  // , 120000)

  }, [])

  useEffect(() => {
    menuVisible ? 
      router.setParams({tabBarVisible: 'yes'})
    :
      router.setParams({tabBarVisible: 'no'})
  }, [menuVisible])

  //  useEffect(() => {
  //     const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
  //       if (navigation) {
  //         setNavigation(false)
  //         return true // Prevent default back action
  //       }
  //       if (menuVisible) {
  //         setMenuVisible(false)
  //         return true // Prevent default back action
  //       }
  //       return false // Allow default back action
  //     })
  //       return () => backHandler.remove()
  //   }, [])

  // --------------------------------------- get infraestrutura, problemas and eventos ---------------------------------------

  useEffect( () => {
    if (!requestEventos) {return}

      getEventoByRadius(requestEventos, null)
    .then((response) =>{
      setEventos(response)
    })
    .catch((error: AxiosError<DefaultErrorResponse>)=>{  
      setUserAlert({type:'error', message: "Error ao carregar eventos: " + error.response?.data.message || error.message})
    })
    .finally(()=>{
      console.log("Teriminou a requisição de eventos")
      isContentLoading && setIsContentLoading(false)
    })

    },[requestEventos])


    useEffect(() => {
      if (!requestProblemas) {return}
      getProblemaByRadius(requestProblemas, null)
      .then((response) => {
        setProblemas(response)
      })
      .catch((error: AxiosError<DefaultErrorResponse>)=>{
        setUserAlert({ type: 'error', message: "Error ao carregar problemas: " + error.response?.data.message || error.message})
      })
      .finally(()=>{
        console.log("Teriminou a requisição de problemas")
        isContentLoading && setIsContentLoading(false)
      })
    }
    , [requestProblemas])

    useEffect(() => {
      if (!requestInfraestrutura) {return}
      getInfraestrutura(requestInfraestrutura, null)
      .then((response) => {
        setInfraestrutura(mapInfraestruturaGeoJsonResponseToInfraestruturaGeoJson(response))
      })
      .catch((error : AxiosError<DefaultErrorResponse>)=>{
        setUserAlert({type:'error', message: "Error ao carregar infraestrutura: " + error.response?.data.message || error.message})
      })
      .finally(()=>{
        console.log("Teriminou a requisição de infraestrutura")
        isContentLoading && setIsContentLoading(false)
      })
    }, [requestInfraestrutura])

  // --------------------------------------- get evento by id ---------------------------------------
  // Caso o usuário tenha clicado em um evento, vai buscar o evento pelo id e centralizar o mapa nele

    useEffect(()=>{
      if(!eventoId) return
      if(navigation) return setUserAlert({ type: 'error', message: "Não é possível buscar evento quando está em modo de navegação"})
      var attempts = 0
      setIsContentLoading(true)
      const interval = setInterval(async () => {
        if (mapRef.current?.state.isReady) {
          getEventoById(eventoId, null)
            .then((response)=>{
              isGestureRef.current = true
              mapRef.current?.animateToRegion({
                latitude: response.endereco.latitude,
                longitude: response.endereco.longitude,
                latitudeDelta:0.0043, longitudeDelta:0.0034})
              getEventsOnViewLocation(response.endereco)
            })
            .catch((error : AxiosError<DefaultErrorResponse>)=>{
              setUserAlert({ type: 'error', message: "Erro ao carregar Evento" + error.response?.data.message || error.message})
            })
            .finally(()=>{
              setIsContentLoading(false)
            })
            clearInterval(interval)
          } else if (attempts >= 15){
            setIsContentLoading(false)
            setUserAlert({ type: 'error', message: "Falha ao encontrar evento, verifique sua localização"})
            clearInterval(interval)
          }
          attempts++
        }, 3000)
    },[eventoId])

    // --------------------------------------- get things around the map ---------------------------------------

    const getEventsOnViewLocation = ({latitude, longitude}: {longitude: number, latitude:number}) => {
      abortControllerRef.current?.abort()
      setRequestInfraestrutura({
          latitude: latitude,
          longitude: longitude,
          raio: 750
        })
      setRequestProblemas({
        latitude: latitude,
        longitude: longitude,
        raio: 750
      })
      setRequestEventos({
        latitude: latitude,
        longitude: longitude,
        raio: 7000
      })
    }

    const searchOnViewLocation = () => {
      abortControllerRef.current?.abort()
      if(!currentViewLocation){return}
      setIsContentLoading(true)
      setRequestInfraestrutura({
        latitude: currentViewLocation.latitude,
        longitude: currentViewLocation.longitude,
        raio: 750
      })
      setRequestProblemas({
        latitude: currentViewLocation.latitude,
        longitude: currentViewLocation.longitude,
        raio: 750
      })
      setRequestEventos({
        latitude: currentViewLocation.latitude,
        longitude: currentViewLocation.longitude,
        raio: 7000
      })
    }

    // --------------------------------------- create avaliacao  ---------------------------------------

    useEffect(()=>{
      if(!requestCreateAvaliacao){return}
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController
      setIsContentLoading(true)
      createAvaliacao(requestCreateAvaliacao, abortControllerRef.current)
      .then(() => {
        setUserAlert({type:'success', message: "Avaliação criada com sucesso"})
        getInfraestruturaById(idInfraAvaliacao!, null)
        .then((response) => {
            setInfraestrutura(prev => {
              if (!prev) return mapInfraestruturaGeoJsonResponseToInfraestruturaGeoJson(response)
              return {
                ...prev,
                features: [
                ...prev.features,
                ...mapInfraestruturaGeoJsonResponseToInfraestruturaGeoJson(response).features
                ]
              }
            })
        })
        .catch((error: AxiosError<DefaultErrorResponse>)=>{
          setUserAlert({ type: 'error', message: "Error ao carregar infraestrutura: "+ error.response?.data || error.message})
        })
    

      })
      .catch((error: AxiosError<DefaultErrorResponse>) => {
        setUserAlert({ type: 'error', message: "Error ao criar avaliação: " + error.response?.data.message || error.message})
      }).finally(() => {
        setIsContentLoading(false)
        setRequestCreateAvaliacao(null)
        setIdInfraAvaliacao(null)
      })

    },[requestCreateAvaliacao])

    // --------------------------------------- create problema ---------------------------------------

    useEffect(()=>{
      if(!requestCreateProblema){return}
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController
      setIsContentLoading(true)
      createProblema(requestCreateProblema, abortControllerRef.current)
      .then((response) => {
        setProblemas((prev) => [...prev, response])
        setUserAlert({type:'success', message: "Problema criado com sucesso"})
        if(problemaImage){
          const formData = new FormData()
          formData.append('file', {
            uri: problemaImage,
            name: 'problema.jpeg',
            type: 'image/jpeg',
          } as any)
          setRequestProblemaImage({
            id: response.id,
            image: formData
          })
        }
      })
      .catch((error: AxiosError<DefaultErrorResponse>) => {
        setUserAlert({ type: 'error', message: "Error ao criar problema: " + error.response?.data.message || error.message})
      }).finally(() => {
        setIsContentLoading(false)
        setRequestCreateProblema(null)
        setProblemaCoords(null)
      }) 
    
    },[requestCreateProblema])

    useEffect(()=>{
      if(!requestProblemaImage){return}
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController
      setIsContentLoading(true)
      createProblemaImage(requestProblemaImage, abortControllerRef.current)
      .then((response) => {
        setUserAlert({type:'success', message: "Imagem enviada com sucesso" + response})
      })
      .catch((error: AxiosError<DefaultErrorResponse>) => {
        setUserAlert({ type: 'error', message: "Error ao enviar imagem: " + error.response?.data.message || error.message})
      }).finally(() => {
        setIsContentLoading(false)
        setRequestProblemaImage(null)
      })
    }, [requestProblemaImage])

    // --------------------------------------- map interactions ---------------------------------------

    const handleMyLocationPress = () => {
      if(navigation) return
      if(!mapRef.current) return
      if(!currentLocation) return
      mapRef.current.animateToRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta:0.0043, longitudeDelta:0.0034
      })
    }

    useEffect(() => {
      if(navigation) return
      if(!hilightedEvento) return
      if(hilightedEvento.interno) return
      if(!hilightedEvento.evento.endereco) return
      const region : Region = { ...hilightedEvento.evento.endereco ,latitudeDelta:0.0043, longitudeDelta:0.0034 } 
      mapRef.current?.animateToRegion(region)
    }, [hilightedEvento])

    /*
    * Função chamada quando o usuário clicar o mapa
    * Se o usuário clicar em cima de uma linha da infraestrutura,vai mostrar modal com avaliações da infraestrutura
    */
    const clicado = (latitude: number, longitude: number) => {
      const matchedFeature = infraestrutura?.features.find((feature) => {
        const geometry = feature.geometry
        if (geometry.type === 'LineString') {
          return isPointNearLine({latitude, longitude}, geometry.coordinates as [number, number][])  
        }
        return false
      })
      if (!matchedFeature) return

      setRequestPageAvaliacao({idInfraestruturaCicloviaria: parseInt(matchedFeature.properties.id), nota:null, pagina:null})

     
    }


    /*
    * Função chamada quando o usuário pressiona o mapa
    * Se o usuário pressionar em cima de uma linha da infraestrutura,vai mostrar modal com opções de criar problema ou avaliar a infraestrutura
    */
    const pressionado = (latitude: number, longitude: number) => {
      console.log('Long Press', latitude, longitude)
      setIdInfraAvaliacao(null)
      setProblemaCoords(null)
      const matchedFeature = infraestrutura?.features.find((feature) => {
        const geometry = feature.geometry
        if (geometry.type === 'LineString') {
          return isPointNearLine({latitude, longitude}, geometry.coordinates as [number, number][])  
        }
        return false
      })
      if (!matchedFeature) return
      
      setIdInfraAvaliacao(parseInt(matchedFeature.properties.id))
      
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController
      setIsContentLoading(true)
      checkCreateViabilityProblema(latitude, longitude, abortControllerRef.current)
      .then((reponse) => {
        if(!reponse){
          console.log('REPONSE DO CHECK: ', reponse) 
          setUserAlert({ type: 'error', message: "Não é possível criar um problema nesse local"})
          setShowOpsModal(true)
          return
        }
        setProblemaCoords({latitude, longitude})
        setShowOpsModal(true)
      })
      .catch((error: AxiosError<DefaultErrorResponse>)=>{
        setUserAlert({ type: 'error', message: "Não é possível criar um problema nesse local: " + error.response?.data.message || error.message})
      })
      .finally(()=>{
        setIsContentLoading(false)
      })

    }

    // --------------------------------------- map city navigation ---------------------------------------
    
      const headingRef = useRef<number | null>(null)
      const [nearProblems, setNearProblems] = useState<Problema[]>([])
      const [infraProblems, setInfraProblems] = useState<Problema[]>([])
      const notifiedProblemsId = useRef<number[]>([])
      const lastRequestLocation = useRef<{ latitude: number, longitude: number } | null>(null)
      const lastUserLocation = useRef<{ latitude: number, longitude: number } | null>(null)
      const lastInfra = useRef<InfraestruturaGeoJsonFeature | null>(null)
      const headingExtremesRef = useRef<[number, number]>([0, 0])
      const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number, heading: number }>({ latitude: 0, longitude: 0, heading: 0 })
      const [problemaModalNavigationCoords, setProblemaModalNavigationCoords] = useState<{latitude: number, longitude: number} | null>(null)
        
      const speechRef = useRef(new AudioSpeaker())  

      const beepPlayer = useAudioPlayer(require('../../assets/sounds/beep.wav'))
      const problemPlayer = useAudioPlayer(require('../../assets/sounds/problem_notify.wav'))
      const playSound = async (player : AudioPlayer, duration: number ) => {
          await new Promise<void>((resolve) => {
              player.play()
              setTimeout(() => {
                  player.seekTo(0)
                  resolve()
              }, duration * 1000)
          })
      }

      const checkNavigationViabilityProblema = async (latitude: number, longitude: number) => {
        abortControllerRef.current?.abort()
        abortControllerRef.current = new AbortController
        checkCreateViabilityProblema(userLocation.latitude, userLocation.longitude, null)
        .then((reponse) => {
            if(!reponse){
              setUserAlert({ type: 'error', message: "Não é possível criar um problema nesse local. Procure uma ciclovia próxima"})
              return
            }
            setProblemaModalNavigationCoords({latitude, longitude})
          })
          .catch((error: AxiosError<DefaultErrorResponse>)=>{
            setUserAlert({ type: 'error', message: "Não é possível criar um problema nesse local: " + error.response?.data.message || error.message})
          })
      } 

      useEffect(() => {
        if (!navigation) return
        if (!userLocation) return
        // Check if the user has moved significantly
        if (lastRequestLocation.current) {
          // Skip request if moved less than 750 meters
          if (isPointNearPoint(userLocation, lastRequestLocation.current, 750)) return
        }
    
        // Update last request location
        lastRequestLocation.current = userLocation

        // Fetch streets around the new location
        setRequestInfraestrutura({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          raio: 750,
        })
        setRequestProblemas({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          raio: 750,
        })
      },[userLocation])

      useEffect(() => {
        if (!navigation) return
        if (!infraestrutura) return
        if (!userLocation) return
        const currentLocation = { latitude: userLocation.latitude, longitude: userLocation.longitude }
        // Check if the user has moved significantly
        if (lastUserLocation.current) {
          // Skip if moved less than 10 meters
          if (isPointNearPoint(currentLocation, lastUserLocation.current, 10)) return
        }
        
        lastUserLocation.current = currentLocation
        
        const matchedFeature = infraestrutura.features.find((feature) => {
          const geometry = feature.geometry
          if (geometry.type === 'LineString') {
            return isPointNearLine(currentLocation, geometry.coordinates as [number, number][])  
          }
          return false
        })
    
        // Avoid redundant updates
        if (matchedFeature && matchedFeature !== lastInfra.current) {
          console.log('User is now on street:', matchedFeature.properties.name)
          lastInfra.current = matchedFeature
          getHeading(matchedFeature)
          const geometry = matchedFeature.geometry
          if (geometry.type === 'LineString') {
            setInfraProblems(
              problemas.filter((problema) => {
                return isPointNearLine(problema, geometry.coordinates as [number, number][])
              })
            )
          }
        }
        if(!matchedFeature) {
          headingRef.current = null
          return
        }
        
        setNearProblems(
          problemas.filter((problema) => {
            if(matchedFeature)
            return isPointNearPoint(currentLocation, problema, 20)
          })
        )
      },[userLocation] )

      const extremesOfOneDirection = (direction: number): [number, number] => {
        let left = direction - 90
        let right = direction + 90
        if (left < 0) left = 360 + left
        if (right > 360) right = right - 360
        return [left, right]
      }
      
      const getHeading = (feature: InfraestruturaGeoJsonFeature) => {
        if (!feature) return
        const geometry = feature.geometry
        let coords: number[][] = []
    
        if (geometry.type === 'LineString') {
          coords = geometry.coordinates as number[][]
        } else if (geometry.type === 'MultiLineString') {
          coords = (geometry.coordinates as number[][][])[0] || []
        } else {
          // GeometryCollection or other types are not handled
          return
        }
    
        if (coords.length > 1) {
          const [start, next] = coords
          const bearing = calculateBearing(
            start[1],
            start[0],
            next[1],
            next[0],
          )
          headingRef.current = bearing
        }
      }

       useEffect(() => {
        // console.log("User location changed:", userLocation)
        if (!navigation) return
        if (!userLocation) return
        let h
        if (!headingRef.current) {
          h = userLocation.heading
        } else {
          const [left, right] = headingExtremesRef.current
          h = (userLocation.heading >= left && userLocation.heading <= right) ? headingRef.current : headingRef.current - 180 >= 0 ? headingRef.current - 180 : headingRef.current + 180
        }
        if (!mapRef.current) return
        mapRef.current.animateCamera({
          center: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          },
          pitch: 50, // Lays the map down
          heading: h,
          zoom: 18,
        })
      },[userLocation])

      useEffect(() => {
        if (!headingRef.current) return
        headingExtremesRef.current = extremesOfOneDirection(headingRef.current)
      }, [headingRef.current])
    
      useEffect(() => {
        if (nearProblems.length <= 0) return
        nearProblems.forEach((problema) => {
          if (notifiedProblemsId.current.includes(problema.id)) return
          notifiedProblemsId.current.push(problema.id)
          playSound(problemPlayer,2.5)//2.5
        })
      }, [nearProblems])
    
      useEffect(() => {
        if (!infraProblems || infraProblems.length <= 0) return
        console.log("Problemas de infraestrutura detectados:")
          infraProblems.forEach((problema) => {
              playSound(beepPlayer, 1.5).then(()=>{ //1.5
                speechRef.current.speak(prompts.problema.find(p => (problema.tipoProblema.id === p.id))?.prompt || `Problema detectado próximo a você.`)
              })
              console.log(`Problema de tipo ${problema.tipoProblema.descricao} detectado na infraestrutura próxima a você.`)
          })
      }, [infraProblems])

    // --------------------------------------- component ---------------------------------------

    if(initalLoading)
      return (
        <LoadingActivity/>
      )
    else if (!currentLocation)
      return (
        <SafeAreaView>
          <View className='flex-col h-full w-full justify-center items-center'>
 
              <Image
                source={require('../../assets/notificacoesErro/localização.webp')}
                style={{ width: 150, height: 170 }}
                resizeMode="cover"
              />

              <Text className='text-[14px] text-secondary_black_sub_title mb-[5px]'>
                {currentLocationError && currentLocationError.message}
              </Text>
              <TouchableOpacity 
              className='bg-primary_green mt-4 p-[10px] rounded-[5px] w-[45%] flex-row items-center justify-center'
              onPress={()=>getCurrentLocation()}
              >
                <Text className='text-[14px] text-black mb-[5px]'>
                  Tentar Novamente
                </Text>
              </TouchableOpacity>
          </View>
        </SafeAreaView>
      )
    else
      return (   
        <SafeAreaView>
          <MapView style={{width: '100%', height:'100%'}} 
              ref={mapRef}
              onRegionChange={setCurrentViewLocation}
              mapPadding={{top: 60, right: 0, bottom: 0, left: 0}}
              initialRegion={initialRegion}
              showsMyLocationButton={false} 
              showsUserLocation={true}
              onUserLocationChange={(e) => {
                if (navigation && e.nativeEvent.coordinate) {
                  const { latitude, longitude , heading} = e.nativeEvent.coordinate
                  if (latitude && longitude) {
                    setUserLocation( { latitude, longitude, heading: heading || 0 })
                  }
                }
              }}
              zoomEnabled={!navigation}
              scrollEnabled={!navigation}
              rotateEnabled={true}
              pitchEnabled={false}
              googleMapId={process.env.EXPO_PUBLIC_MAP_STYLE_ID}
              onPress={e=> !navigation && clicado(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)}
              onLongPress={e=> { !navigation && pressionado(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude) }}
              onRegionChangeComplete={(region) => {
                  if(navigation) return
                  menuVisible && setMenuVisible(false)
                  setIsMoved(isGestureRef.current)
                  isGestureRef.current = false
                  if (!isRegionWithinBounds(region)) {
                    animateToUserLocation(mapRef.current , currentLocation)
                    setUserAlert({ type: 'error', message: 'Você saiu da área de São Paulo. Retornando à sua localização.'})
                  }
                }
              }
              onTouchEnd={()=>{
                isGestureRef.current = true
                setHilightedEvento(null) 
              }}
            >
              

                {eventos.map((evento) => (
                  isSameDate(evento.data.split(' ')[0], dateRef.current) ? (
                    <View key={evento.id}>
                      <Circle
                        fillColor={evento.gratuito? 'rgba(195, 255, 0, 0.2)' : 'rgba(255, 193, 7, 0.2)'}
                        strokeColor={evento.gratuito? 'rgba(195, 255, 0, 0.5)' : 'rgba(255, 193, 7, 0.5)'}
                        center={evento.endereco}
                        radius={evento.faixaKm*100}
                        strokeWidth={2}
                      />  
          
                    <Marker 
                        tracksViewChanges={false}
                        key={evento.id} 
                        coordinate={evento.endereco} 
                        image={evento.gratuito
                          ? icons.mapa_pino_evento_gratuito
                          : icons.mapa_pino_evento_pago
                        }
                        onPress={()=> {
                          setHilightedEvento({evento: evento, interno :true})}}
                      />
                    </View>
                  ) : (
                    <Marker 
                        tracksViewChanges={false}
                        key={evento.id} 
                        coordinate={evento.endereco} 
                        image={evento.gratuito
                          ? icons.mapa_pino_evento_gratuito
                          : icons.mapa_pino_evento_pago
                        }
                        onPress={()=> {
                          setHilightedEvento({evento: evento, interno :true})}}
                      />
                  )
                  ))}

                  {problemas.map((problema) => (        
                    <Marker 
                        key={problema.id} 
                        tracksViewChanges={false}
                        coordinate={problema} 
                        titleVisibility='hidden'
                        image={
                          problema.tipoProblema.id === 1?( icons.mapa_pino_problema_tipo_1_round ) 
                          :
                          problema.tipoProblema.id === 2?( icons.mapa_pino_problema_tipo_2_round )
                          : 
                          problema.tipoProblema.id === 3?( icons.mapa_pino_problema_tipo_3_round )
                          :
                          problema.tipoProblema.id === 4?( icons.mapa_pino_problema_tipo_4_round ) 
                          :
                          problema.tipoProblema.id === 5?( icons.mapa_pino_problema_tipo_5_round )   
                          :
                          problema.tipoProblema.id === 6?( icons.mapa_pino_problema_tipo_6_round )   
                          :
                          problema.tipoProblema.id === 7?( icons.mapa_pino_problema_tipo_7_round )   
                          :  
                          problema.tipoProblema.id === 8?( icons.mapa_pino_problema_tipo_8_round )   
                          :  
                            icons.mapa_pino_problema_tipo_1_round
                            
                        }
                        onPress={()=>setPinProblemaSelector(problema)}
                      >
                      </Marker>
                  ))}

            
                
          

              <Geojson
                geojson={infraestrutura || emptyGeoJson}
                strokeWidth={10}
              />
              
              {navigation && 
                <Marker
                  // icon={icons.mapa_bike_pino}
                  tracksViewChanges={false}
                  coordinate={userLocation}
                  focusable={false}
                  titleVisibility='hidden'
                  image={icons.mapa_bike_pino}
                />
              }
    
            </MapView>

            {!navigation && 
              <>
              {eventos && (
                <EventCardCarousel
                  data={eventos}
                  hilightedEvento={hilightedEvento? hilightedEvento.evento : null}
                  handleChangeEvento={setHilightedEvento}
                />
              )}
              {isContentLoading && <LoadingActivity/>}

              {showProblemaModal && problemaCoords &&
              <ProblemaModal
                coords={problemaCoords}
                visible={showProblemaModal}
                closeModal={(createProblema, image) => {
                  if(createProblema){setShowOpsModal(false)}
                  setRequestCreateProblema(createProblema)
                  setProblemaImage(image)
                  setShowProblemaModal(false)
                }}
                />
              }

              {showAvaliacaoModal && idInfraAvaliacao &&
                <AvaliacaoModal
                  idInfraestruturaCicloviaria={idInfraAvaliacao}
                  closeModal={(createAvaliacao)=>{
                    if(createAvaliacao){setShowOpsModal(false)}
                    setRequestCreateAvaliacao(createAvaliacao)
                    setShowAvaliacaoModal(false)
                  }}
                  />
              }

              {showOpsModal && !showAvaliacaoModal && !showProblemaModal &&
                <OpsModal
                    onSelectInfraestrutura={()=>setShowAvaliacaoModal(true)}
                    visible={showOpsModal}
                    onSelectProblema={()=>setShowProblemaModal(true)}
                    problemaAvailable={ problemaCoords !== null }
                    onClose={()=>setShowOpsModal(false)}
                />
              }

              {requestPageAvaliacao && 
                <AvaliacaoView
                  requestPage={requestPageAvaliacao}
                  onClose={()=>{
                    setRequestPageAvaliacao(null)
                  }}
                />
              }

                <TouchableOpacity
                  className={`absolute z-0 bottom-[40px] left-[0px] h-[68px] bg-[rgba(195,255,0,0.15)] max-w-fit rounded-r-[30px] items-start justify-center ${menuVisible? 'hidden': ''}`}
                  onPress={()=>setMenuVisible(!menuVisible)}
                >
                  <Ionicons name="caret-forward" size={39} color="#C3FF00"/>
                </TouchableOpacity>

              
              </>
            }


              {pinProblemaSelector &&
                <ProblemaView
                  problema={pinProblemaSelector}
                  onClose={() => setPinProblemaSelector(null)}
                />}

                  
              <View className='absolute top-[40px] px-[5%] flex-row gap-[10%] items-center justify-center h-fit w-full'>
                  <TouchableOpacity
                    className='bg-primary_green p-[10px] rounded-[30px] justify-center items-center'
                    onPress={()=>{
                      !navigation && setMenuVisible(false) 
                      setNavigation(!navigation)
                    }}
                  >
                    <Ionicons name={`${navigation ? 'arrow-back' : 'navigate' }`} size={24} color="black" />
                  </TouchableOpacity>
                {isMoved && !navigation ? 
                <ButtonModal
                  title='Buscar nesta localização'
                  handlePress={searchOnViewLocation}
                  textStyles='text-[#000] text-center'
                  customStyles='min-w-[200px] min-h-[50px] px-4 py-2'
                />
                :
                <View className='w-[200px] min-h-[50px]'/>  
                }

                {!navigation ?
                  <TouchableOpacity
                    className='bg-primary_green p-[10px] rounded-[30px] justify-center items-center'
                    onPress={handleMyLocationPress}
                    >
                    <Ionicons name="locate" size={24} color="black" />
                  </TouchableOpacity>
                  :
                  <View className='w-[34px] h-[34px]'/> 
                }
              </View>
              
              {userAlert && 
              <ShowAlert
                message={userAlert.message}
                type={userAlert.type}
                onClose={()=>setUserAlert(null)}
              />}

              {problemaModalNavigationCoords &&
              <ProblemaModalNavigation
                onClose={(createProblema) => {
                  setProblemaModalNavigationCoords(null)
                  setRequestCreateProblema(createProblema)
                }}
                coords={problemaModalNavigationCoords}
              />}

              {navigation &&
                <TouchableOpacity
                    className='absolute bottom-[10%] right-[3%] flex-row bg-primary_green p-[10px] rounded-[37px] justify-center items-center'
                    onPress={() => checkNavigationViabilityProblema(userLocation.latitude, userLocation.longitude)}
                    >
                    <Ionicons name="warning-outline" size={37} color="black" />
                    <Text className='font-roboto font-bold'>Reportar</Text>
                </TouchableOpacity>
              }

              <TouchableOpacity
                className={`absolute z-0 bottom-[0px] right-[0px] transparent max-h-fit max-w-fit  items-center justify-center`}
                onPress={()=>{router.push('/help-modal')}}
              >
                <Ionicons name="help-circle-sharp" size={40} color="rgba(195,255,0,0.5)"/>
              </TouchableOpacity>
              

      </SafeAreaView>
    )
  }

 