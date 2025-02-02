import { View, Text, SafeAreaView, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { Circle, Marker, Overlay } from 'react-native-maps'
import * as Location from 'expo-location'
import { Evento, RequestPageEvento } from '../../types'
import { getEvento } from '../../api/evento'
import LoadingActivity from '../../components/LoadingActivity'

interface Region {
  latitude: number
  longitude: number
  latitudeDelta: number
  longitudeDelta: number

}







export default function Home() {

  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null)
  const initialLocation = {latitude:-23.556312, longitude: -46.637752, latitudeDelta:0.1000, longitudeDelta:0.1000}
  const [currentViewLocation, setcurrentViewLocation] = useState<Region>({latitude:-23.556312, longitude: -46.637752, latitudeDelta:0.1000, longitudeDelta:0.1000})
  const [currentLocationError, setCurrentLocationError] = useState<string | null> ()
  const [requestPageEvento, setRequestPageEvento] = useState<RequestPageEvento>({ page: 1, nome: null, descricao: null, data: null, cidade: null, estado: null, faixaKm: null, tipoEvento: null, nivelHabilidade: null, gratuito: null})
  const abortControllerRef = useRef<AbortController>()
  const [isContentLoading, setIsContentLoading] = useState<boolean>(false)

  const [eventos, setEventos] = useState<Evento[]>()







  async function getCurrentLocation(): Promise<void>{
    let {status} = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted'){
      setCurrentLocationError('Permission to access location was denied')
    }
    let location = await Location.getCurrentPositionAsync({})
    setCurrentLocation(location)  
  }

   function populateEventos(){
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController
      setIsContentLoading(true)
      console.log('requestPageEvento', requestPageEvento)
      getEvento(requestPageEvento, abortControllerRef.current)
      .then((response) =>{
        setEventos(response.eventos)
      })
      .catch((response)=>{  
        alert("Error ao carregar eventos: "+ response.message)
      })
      .finally(()=>{
        setIsContentLoading(false)
      })
  }


  // setInterval( async ()=>{
  //   await getCurrentLocation()
  // },15000)

  


  useEffect(()=>{

    if(!eventos){
      populateEventos()
    }

  }, [currentLocation])



    if (isContentLoading){
      return (
        <LoadingActivity/>
      )

    }else {

      return (   
        <SafeAreaView >
        <View className='h-[10%]'>
          <Text > {JSON.stringify(currentLocation)} </Text>
        </View>
        

        <MapView style={{width: '100%', height:'90%'}} 
            onRegionChange={setcurrentViewLocation}
            initialRegion={initialLocation}
            
          >
    
            {eventos?.map((evento) => {
              return (
                <Circle
                key={evento.id}
                fillColor={evento.gratuito? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.2)'}
                strokeColor={evento.gratuito? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.2)'}
                center={evento.endereco}
                radius={evento.faixaKm*100}
                />
                // <Marker
                //   key={evento.id}
                //   pinColor={evento.gratuito? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.2)'}
                //   coordinate={evento.endereco}
                //   title={evento.nome}
                // />
              )
            }
          )}
  
            
  
              
           </MapView>

          <View
            style={{height:'5%', position:'absolute', top:50 , backgroundColor:'yellow'} }
          >
            <Text>I'm Here</Text>
          </View>

      </SafeAreaView>
    )
  }
    

}