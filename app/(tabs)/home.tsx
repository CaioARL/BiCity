import { View, Text, SafeAreaView, StyleSheet, ScrollView, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { Circle, Marker, Overlay } from 'react-native-maps'
import * as Location from 'expo-location'
import { Evento, RequestEventoByRadius, RequestPageEvento } from '../../types'
import { getEvento, getEventoByRadius } from '../../api/evento'
import LoadingActivity from '../../components/LoadingActivity'
import { string } from 'zod'
import ButtonModal from '../../components/ButtonModal'

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

  const [currentViewLocation, setcurrentViewLocation] = useState<Region | null>(null)
  const [currentLocationError, setCurrentLocationError] = useState<LocationError | null> ()
  const [isMoved, setIsMoved] = useState<boolean|undefined>(false)

  const [requestEventos, setRequestEventos] = useState<RequestEventoByRadius>()
  const abortControllerRef = useRef<AbortController>()
  const [isRequestInProgress, setIsRequestInProgress] = useState(false)

  const [isContentLoading, setIsContentLoading] = useState<boolean>(false)

  const [eventos, setEventos] = useState<Evento[]>()


  const locationErrors = {
    PERMISSION : {key: 'PERMISSION', message: 'Permissão de localização negada, cheque as permissões do aplicativo'},
    SERVICE : {key: 'SERVICE', message: 'Serviço de localização desativado'},
    ERROR : {key: 'ERROR', message: 'Erro ao obter localização'}
  }


    
  
 



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
      alert("Error ao checar service de localização: "+ error)
    })
    
    let location = await Location.getCurrentPositionAsync({})


    setCurrentLocation(location)  
    setRequestEventos({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      raio: 7000
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


  useEffect(()=>{
    if (!requestEventos) {return}
    if(isRequestInProgress){return}
    setIsRequestInProgress(true)

    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController
    setIsContentLoading(true)
    console.log(new Date().toLocaleTimeString()+' veio do mapa: requestEventos', requestEventos)
      getEventoByRadius(requestEventos, abortControllerRef.current)
    .then((response) =>{
      setEventos(response)
    })
    .catch((response)=>{  
      alert("Error ao carregar eventos: "+ response.message)
    })
    .finally(()=>{
      setIsRequestInProgress(false)
      setIsContentLoading(false)
    })

    },[requestEventos])


    const getEventsOnViewLocation = () => {
      if(!currentViewLocation){return}
      setRequestEventos({
        latitude: currentViewLocation.latitude,
        longitude: currentViewLocation.longitude,
        raio: 7000
      })
    }






    if (isContentLoading){
      return (
        <LoadingActivity/>
      )

    }else {
      let initialLocation :Region = {latitude:-23.556312, longitude: -46.637752, latitudeDelta:0.1000, longitudeDelta:0.1000}
      if (currentViewLocation && isMoved){
        initialLocation = currentViewLocation
      }
      else if(currentLocation){
        initialLocation  = {latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude, latitudeDelta:0.1000, longitudeDelta:0.1000}
      }
      return (   
        <SafeAreaView >
        {/* <View className='h-[10%]'>
          <Text > {JSON.stringify(currentLocation)} </Text>
        </View> */}
        

        <MapView style={{width: '100%', height:'100%'}} 
            onRegionChange={setcurrentViewLocation}
            initialRegion={initialLocation}
            showsUserLocation={true} 
            onRegionChangeComplete={ (e, {isGesture}  ) => {setIsMoved(isGesture)}}
          >
            {eventos &&(

              eventos.map((evento) => {
                return (
                  <View>
                    <Circle
                      key={evento.id+10}
                      fillColor={evento.gratuito? 'rgba(195, 255, 0, 0.2)' : 'rgba(192, 170, 129, 0.2)'}
                      strokeColor={evento.gratuito? 'rgba(195, 255, 0, 0.8)' : 'rgba(192, 170, 129, 0.6)'}
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
                )
              }
            )
          )}
  
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
            (<View className='items-center justify-center h-[50%] w-[100%] bg-primary_green absolute top-[50%] rounded-[100px]' >
            <Text className='text-xl text-color_lightGray'> {currentLocationError.message}</Text>
              {currentLocationError.key === 'SERVICE' &&
              <ButtonModal
                title='Tentar Novamente'
                handlePress={getCurrentLocation}
                customColor=''
                customStyles='min-w-[200px] min-h-[50px] px-4 py-2 bg-primary_green_light'
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
      </SafeAreaView>
    )
  }
}