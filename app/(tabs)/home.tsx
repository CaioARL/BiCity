import { View, Text, SafeAreaView} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { Callout, Circle, Geojson, Marker, PROVIDER_GOOGLE} from 'react-native-maps'
import * as Location from 'expo-location'
import { Evento, InfraestruturaGeoJson, Problema, RequestCreateProblema, RequestEventoByRadius, RequestInfraestruturaByRadius, RequestPageEvento, RequestProblemaByRadius } from '../../types'
import { getEventoByRadius } from '../../api/evento'
import LoadingActivity from '../../components/LoadingActivity'
import { set, string } from 'zod'
import ButtonModal from '../../components/ButtonModal'
import { getInfraestrutura } from '../../api/infraestrutura'
import { createProblema, getProblemaByRadius } from '../../api/problema'
import ShowAlert from '../../components/ShowAlert'
import ProblemaModal from '../../components/ProblemaModal'
import { useTheme } from '../context/ThemeProvider'
import tailwindConfig from '../../tailwind.config'
import { mapStylesLight, mapStylesDark } from '../../components/mapStyles';

const colors = (tailwindConfig as any)?.theme?.colors as Record<string, string>

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
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null)
  const [initialRegion, setInitialRegion] = useState<Region>({latitude:-23.556312, longitude: -46.637752, latitudeDelta:0.0043, longitudeDelta:0.0034})
  const [currentViewLocation, setCurrentViewLocation] = useState<Region | null>(null)
  const [currentLocationError, setCurrentLocationError] = useState<LocationError | null> ()
  const [isMoved, setIsMoved] = useState<boolean|undefined>(false)

  const [requestInfraestrutura, setRequestInfraestrutura] = useState<RequestInfraestruturaByRadius>()
  const [infraestrutura, setInfraestrutura] = useState<InfraestruturaGeoJson>()


  const [requestCreateProblema, setRequestCreateProblema] = useState<RequestCreateProblema | null>()
  const [requestProblemas, setRequestProblemas] = useState<RequestProblemaByRadius>()
  const [problemas, setProblemas] = useState<Problema[]>([])
  const [problemaCoords, setProblemaCoords] = useState<{latitude: number, longitude: number}>({latitude: 0, longitude: 0})
  const [showProblemaModal, setShowProblemaModal] = useState<boolean>(false)



  const abortControllerRef = useRef<AbortController>()
  const [initalLoading, setInitalLoading] = useState<boolean>(true)
  
  // const [isRequestInProgress, setIsRequestInProgress] = useState(false)
  
  const [isContentLoading, setIsContentLoading] = useState<boolean>(false)
  
  const [requestEventos, setRequestEventos] = useState<RequestEventoByRadius>()
  const [eventos, setEventos] = useState<Evento[]>([])

  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const locationErrors = {
    PERMISSION : {key: 'PERMISSION', message: 'Permissão de localização negada, cheque as permissões do aplicativo'},
    SERVICE : {key: 'SERVICE', message: 'Serviço de localização desativado'},
    ERROR : {key: 'ERROR', message: 'Erro ao obter localização'}
  }

  const emptyGeoJson: InfraestruturaGeoJson = {
    type: "FeatureCollection",
    features: [],
  };
  

   const getCurrentLocation = async (): Promise<void>  => {
     let {status} = await Location.requestForegroundPermissionsAsync()
     
     if (status !== 'granted'){
       setCurrentLocationError(locationErrors.PERMISSION)
       return
      }
    await Location.hasServicesEnabledAsync()
    .then((response) => {
      if (!response){
        setCurrentLocationError(locationErrors.SERVICE)
      }else {
        setCurrentLocationError(null)
      }
    })
    .catch((error)=> {
      setErrorMessage("Error ao checar serviço de localização: "+ error)
    })
    
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
        raio: 7000
      })   
      setRequestEventos({
        latitude: response.coords.latitude,
        longitude: response.coords.longitude,
        raio: 7000
      })
      setInitialRegion({latitude: response.coords.latitude, longitude: response.coords.longitude, latitudeDelta:0.0043, longitudeDelta:0.0034})
      initalLoading && setInitalLoading(false)
    })
    .catch((error) => {
      setCurrentLocationError(locationErrors.ERROR)
      setErrorMessage("Error ao obter localização: "+ error)
    }).finally(() => {
    })



  }



  


  useEffect(()=>{
    if(!currentLocation){
      getCurrentLocation()
    }
  setInterval(
    getCurrentLocation
  , 120000)

  }, [])


  useEffect( () => {
    if (!requestEventos) {return}

      getEventoByRadius(requestEventos, null)
    .then((response) =>{
      setEventos(response)
    })
    .catch((response)=>{  
      setErrorMessage("Error ao carregar eventos: "+ response.message)
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
      .catch((response)=>{
        setErrorMessage("Error ao carregar problemas: " + response.message)
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
        setInfraestrutura(response)
      })
      .catch((response)=>{
        setErrorMessage("Error ao carregar infraestrutura: " + response.message)
      })
      .finally(()=>{
        console.log("Teriminou a requisição de infraestrutura")
        isContentLoading && setIsContentLoading(false)
      })
    }, [requestInfraestrutura])


    const getEventsOnViewLocation = () => {
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
          raio: 7000
        })
        setRequestEventos({
          latitude: currentViewLocation.latitude,
          longitude: currentViewLocation.longitude,
          raio: 7000
        })
    }



    

    useEffect(()=>{
      if(!requestCreateProblema){return}
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController
      setIsContentLoading(true)
      createProblema(requestCreateProblema, abortControllerRef.current)
      .then((response) => {
        setSuccessMessage("Problema criado com sucesso")
      })
      .catch((response) => {
        setErrorMessage("Error ao criar problema: " + response.message)
      }).finally(() => {
        setIsContentLoading(false)
        setRequestCreateProblema(null)
      }) 
    
    },[requestCreateProblema])


    const detalheDaVia = () => {
      
    }

    const pressionado = (latitude: number, longitude: number) => {
      setProblemaCoords({latitude, longitude})
      setShowProblemaModal(true)
    }


    
    if(initalLoading)
      return (
        <LoadingActivity/>
      )


    else
      return (   
        <SafeAreaView style={{ backgroundColor: isDarkMode ? '#121212' : '#FFFFFF' }}>
        {/* <View className='h-[10%]'>
          <Text > {JSON.stringify(currentLocation)} </Text>
        </View> */}
        

        <MapView style={{width: '100%', height:'100%'}} 
            onRegionChange={setCurrentViewLocation}
            mapPadding={{top: 0, right: 0, bottom: 100, left: 0}}
            initialRegion={initialRegion}
            showsUserLocation={true} 
            provider={PROVIDER_GOOGLE}
            customMapStyle={isDarkMode ? mapStylesDark : mapStylesLight}
            onPress={e=> {
              console.log("Press ", e.nativeEvent.coordinate)
            }}
            onLongPress={e=> {
              console.log('Long Press', e.nativeEvent.coordinate)
              pressionado(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)
            }}
            onRegionChangeComplete={ (e, {isGesture}  ) => {setIsMoved(isGesture)}}
          >
            

              {eventos.map((evento) => (

                  <View key={evento.id}>
                    <Circle
                      fillColor={evento.gratuito? 'rgba(195, 255, 0, 0.2)' : 'rgba(192, 170, 129, 0.2)'}
                      strokeColor={evento.gratuito? 'rgba(195, 255, 0, 0.5)' : 'rgba(192, 170, 129, 0.5)'}
                      center={evento.endereco}
                      radius={evento.faixaKm*100}
                      strokeWidth={2}
                    />  
        
                   <Marker 
                      key={evento.id} 
                      coordinate={evento.endereco} 
                      title={evento.nome}
                      image={evento.gratuito
                        ? require('../../assets/pins/pin_free_evento.png')
                        : require('../../assets/pins/pin_paid_evento.png')
                      }

                    />
                  </View>
                ))}

                {problemas.map((problema) => (        
                   <Marker 
                      key={problema.id} 
                      coordinate={problema} 
                      title={problema.descricao}
                      image={
                        problema.tipoProblema.id === 1?( require('../../assets/pins/pin_problema_tipo_1.png')) 
                        :
                        problema.tipoProblema.id === 2?( require('../../assets/pins/pin_problema_tipo_2.png') )
                        : 
                        problema.tipoProblema.id === 3?( require('../../assets/pins/pin_problema_tipo_3.png') )
                        :
                        problema.tipoProblema.id === 4?( require('../../assets/pins/pin_problema_tipo_4.png') ) 
                        :
                        problema.tipoProblema.id === 5?( require('../../assets/pins/pin_problema_tipo_5.png') )   
                        :
                        problema.tipoProblema.id === 6?( require('../../assets/pins/pin_problema_tipo_6.png') )   
                        :
                        problema.tipoProblema.id === 7?( require('../../assets/pins/pin_problema_tipo_7.png') )   
                        :  
                        problema.tipoProblema.id === 8?( require('../../assets/pins/pin_problema_tipo_8.png') )   
                        :  
                          require('../../assets/pins/pin_problema_tipo_1.png')
                          
                      }
                    >
                    </Marker>
                ))}

          
            
        

          <Geojson
            geojson={infraestrutura || emptyGeoJson}
            strokeColor='rgba(255, 0, 0, 0.35)'
            strokeWidth={10}
          />
            

  
           </MapView>
           {/**<Marker key={evento.id} coordinate={evento.endereco} title={evento.nome}>
            //   <Image
            //     source={evento.gratuito
            //       ? require('../../assets/pins/pin_free_evento.png')
            //       : require('../../assets/pins/pin_paid_evento.png')}
            //       style={{width: 30, height: 35}} 
            //       resizeMode="contain"
            //       />
            // </Marker>*/} 

          {currentLocationError &&
            (<View className='items-center justify-center h-[200px] w-[100%] bg-primary_green absolute top-[50%] rounded-[100px]' >
            <Text className='text-xl text-color_lightGray'> {currentLocationError.message}</Text>
              {currentLocationError.key === 'SERVICE' &&
              <ButtonModal
                title='Tentar Novamente'
                handlePress={getCurrentLocation}
                customColor=''
                customStyles='w-[200px] h-[50px] px-4 py-2 bg-primary_green_light'
              />}
            </View>)}
              {isMoved && 
            (<View className='items-center justify-center h-[50%] w-[100%] absolute top-[-20%]'>
              <ButtonModal
                title='Achar Eventos Próximos'
                handlePress={getEventsOnViewLocation}
                textStyles='text-[#000] text-center'
                customStyles='min-w-[200px] min-h-[50px] px-4 py-2'
              />
            </View>)}
            {isContentLoading && <LoadingActivity/>}
            {successMessage && 
            <ShowAlert
              message={successMessage}
              type='success'
              onClose={()=>setSuccessMessage(null)}
            />}
            {errorMessage && 
            <ShowAlert
              message={errorMessage}
              type='error'
              onClose={()=>setErrorMessage(null)}
            />}
            {showProblemaModal &&
            <ProblemaModal
              coords={problemaCoords}
              visible={showProblemaModal}
              closeModal={e => {
                setRequestCreateProblema(e)
                setShowProblemaModal(false)
              }}
              />
            }

      </SafeAreaView>
    )
  }