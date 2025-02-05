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
  const initialLocation = {latitude:-23.556312, longitude: -46.637752, latitudeDelta:0.1000, longitudeDelta:0.1000}
  const [currentViewLocation, setcurrentViewLocation] = useState<Region>({latitude:-23.556312, longitude: -46.637752, latitudeDelta:0.1000, longitudeDelta:0.1000})
  const [currentLocationError, setCurrentLocationError] = useState<LocationError | null> ()

  const [requestEventos, setRequestEventos] = useState<RequestEventoByRadius>()
  const abortControllerRef = useRef<AbortController>()
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
    if(!eventos){
      getCurrentLocation()
    }
    
  setInterval(
    getCurrentLocation
  , 120000)


  }, [])


  useEffect(()=>{
    if(!requestEventos){ return } 
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController
    setIsContentLoading(true)
    console.log('veio do mapa: requestEventos', requestEventos)
      getEventoByRadius(requestEventos, abortControllerRef.current)
    .then((response) =>{
      setEventos(response)
    })
    .catch((response)=>{  
      alert("Error ao carregar eventos: "+ response.message)
    })
    .finally(()=>{
      setIsContentLoading(false)
    })

    },[requestEventos])






    if (isContentLoading){
      return (
        <LoadingActivity/>
      )

    }else {

      return (   
        <SafeAreaView >
        {/* <View className='h-[10%]'>
          <Text > {JSON.stringify(currentLocation)} </Text>
        </View> */}
        

        <MapView style={{width: '100%', height:'100%'}} 
            onRegionChange={setcurrentViewLocation}
            initialRegion={currentLocation? {latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude, latitudeDelta:0.1000, longitudeDelta:0.1000} : initialLocation}
            showsUserLocation={true} 
          >
    
            {eventos?.map((evento) => {
              return (
              
                /* <Circle
                fillColor={evento.gratuito? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.2)'}
                strokeColor={evento.gratuito? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.2)'}
                center={evento.endereco}
                radius={evento.faixaKm*100}
                /> */
                <Marker key={evento.id} coordinate={evento.endereco} title={evento.nome}>
                  <Image
                    source={evento.gratuito
                      ? require('../../assets/pins/pin_free_evento.png')
                      : require('../../assets/pins/pin_paid_evento.png')}
                    style={{width: 30, height: 35}} 
                    resizeMode="contain"
                    />
                </Marker>
                
              )
            }
          )}
  
           </MapView>

            {currentLocationError &&
              (<View className='items-center justify-center h-fit w-[100%] bg-primary_green_dark absolute top-[50%] rounded-[100px]' >
              <Text className='text-xl text-color_lightGray'> {currentLocationError.message}</Text>
                {currentLocationError.key === 'SERVICE' &&
                <ButtonModal
                  title='Tentar Novamente'
                  handlePress={getCurrentLocation}
                  customColor='bg-primary_green_light'
                />}
              </View>)}
           
            </SafeAreaView>
    )
  }
}