import { View, Text, SafeAreaView, Modal} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { Callout, Circle, Geojson, Marker} from 'react-native-maps'
import * as Location from 'expo-location'
import { Evento, InfraestruturaGeoJson, PageAvaliacao, Problema, RequestCreateAvaliacao, RequestCreateProblema, RequestCreateProblemaImage, RequestEventoByRadius, RequestInfraestruturaByRadius, RequestPageAvaliacao, RequestPageEvento, RequestProblemaByRadius } from '../../types'
import { getEventoByRadius } from '../../api/evento'
import LoadingActivity from '../../components/LoadingActivity'
import ButtonModal from '../../components/ButtonModal'
import { getInfraestrutura } from '../../api/infraestrutura'
import { checkCreateViabilityProblema, createProblema, createProblemaImage, getProblemaByRadius } from '../../api/problema'
import ShowAlert from '../../components/ShowAlert'
import ProblemaModal from '../../components/ProblemaModal'
import PinProblemaView from '../../components/PinProblemaView'
import AvaliacaoModal from '../../components/AvaliacaoModal'
import { isPointNearLine } from '../../util/map-util'
import OpsModal from '../../components/OpsModalMap'
import { set } from 'zod'
import { createAvaliacao, getAvaliacoesByInfraestrutura } from '../../api/avaliacao'
import AvaliacaoView from '../../components/AvaliacaoView'

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
  const [problemaCoords, setProblemaCoords] = useState<{latitude: number, longitude: number} | null>(null)
  const [showProblemaModal, setShowProblemaModal] = useState<boolean>(false)
  const [problemaImage ,setProblemaImage] = useState<string | null>(null)
  const [requestProblemaImage, setRequestProblemaImage] = useState<RequestCreateProblemaImage | null>(null)

  const [pinProblemaSelector, setPinProblemaSelector] = useState<Problema | null>(null)


  const [requestCreateAvaliacao, setRequestCreateAvaliacao] = useState<RequestCreateAvaliacao | null>(null)
  const [showAvaliacaoModal, setShowAvaliacaoModal] = useState<boolean>(false)
  const [idInfraAvaliacao, setIdInfraAvaliacao] = useState<number | null>(null)
  const [requestPageAvaliacao, setRequestPageAvaliacao] = useState<RequestPageAvaliacao | null>(null)
  const [pageAvaliacoes, setPageAvaliacoes] = useState<PageAvaliacao | null>(null)
  const [isRequestingPage, setIsRequestingPage] = useState<boolean>(false)

  const [showOpsModal, setShowOpsModal] = useState<boolean>(false)


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
      if(!requestCreateAvaliacao){return}
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController
      setIsContentLoading(true)
      createAvaliacao(requestCreateAvaliacao, abortControllerRef.current)
      .then(() => {
        setSuccessMessage("Avaliação criada com sucesso")
      })
      .catch((response) => {
        setErrorMessage("Error ao criar avaliação: " + response.message)
      }).finally(() => {
        setIsContentLoading(false)
        setRequestCreateAvaliacao(null)
        setIdInfraAvaliacao(null)
      })

    },[requestCreateAvaliacao])



    

    useEffect(()=>{
      if(!requestCreateProblema){return}
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController
      setIsContentLoading(true)
      createProblema(requestCreateProblema, abortControllerRef.current)
      .then((response) => {
        setSuccessMessage("Problema criado com sucesso")
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
      .catch((response) => {
        setErrorMessage("Error ao criar problema: " + response.message)
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
        setSuccessMessage("Imagem enviada com sucesso" + response)
      })
      .catch((response) => {
        setErrorMessage("Error ao enviar imagem: " + response.message)
      }).finally(() => {
        setIsContentLoading(false)
        setRequestProblemaImage(null)
      })
    }, [requestProblemaImage])


    useEffect(()=>{
      if(!requestPageAvaliacao) return
      setIsRequestingPage(true)
      getAvaliacoesByInfraestrutura(requestPageAvaliacao, null)
      .then((response)=>{        
          setPageAvaliacoes(response)
      })
      .catch((reponse)=>{
        setErrorMessage("Erro buscando avaliações: " + reponse.message)
      })
      .finally(()=>{
        setIsRequestingPage(false)
      })
    },[requestPageAvaliacao])


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
          setErrorMessage("Não é possível criar um problema nesse local")
          setShowOpsModal(true)
          return
        }
        setProblemaCoords({latitude, longitude})
        setShowOpsModal(true)
      })
      .catch((response)=>{
        setErrorMessage("Não é possível criar um problema nesse local: "+ response.message)
      })
      .finally(()=>{
        setIsContentLoading(false)
      })

    }




    
    if(initalLoading)
      return (
        <LoadingActivity/>
      )


    else
      return (   
        <SafeAreaView >
        {/* <View className='h-[10%]'>
          <Text > {JSON.stringify(currentLocation)} </Text>
        </View> */}
        

        <MapView style={{width: '100%', height:'100%'}} 
            onRegionChange={setCurrentViewLocation}
            mapPadding={{top: 0, right: 0, bottom: 100, left: 0}}
            initialRegion={initialRegion}
            showsUserLocation={true} 
            zoomEnabled={true}


            onPress={e=> clicado(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)}
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
                      onPress={()=>setPinProblemaSelector(problema)}
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
            (<View className='items-center justify-center h-fit w-[90%] left-[5%] bg-primary_green absolute top-[50%] rounded-[10px]' >
            <Text className='text-xl text-color_lightGray'> {currentLocationError.message}</Text>
              {currentLocationError.key === 'SERVICE' &&
              <ButtonModal
                title='Tentar Novamente'
                handlePress={getCurrentLocation}
                customColor=''
                customStyles='w-[200px] h-[50px] px-4 py-2 bg-primary_green_light'
              />}
            </View>)}

          {pinProblemaSelector &&
            <PinProblemaView
              problema={pinProblemaSelector}
              onClose={() => setPinProblemaSelector(null)}
            />}
                
              {isMoved && 
            (<View className='items-center justify-center h-fit w-full absolute top-[3%]'>
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

            {pageAvaliacoes && requestPageAvaliacao && 
              <AvaliacaoView
                pageAvaliacao={pageAvaliacoes}
                requestPage={requestPageAvaliacao}
                setRequestPage={setRequestPageAvaliacao}
                isContentLoading={isRequestingPage}
                onClose={()=>{
                  setPageAvaliacoes(null)
                  setRequestPageAvaliacao(null)
                }}
              />
            }

      </SafeAreaView>
    )
  }

  