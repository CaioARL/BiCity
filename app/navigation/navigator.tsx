import React, { useRef, useEffect, useState } from 'react'
import { SafeAreaView, TouchableOpacity } from 'react-native'
import MapView, { Geojson } from 'react-native-maps'
import { Ionicons } from '@expo/vector-icons'


import { InfraestruturaGeoJson, RequestInfraestruturaByRadius } from 'types'
import * as Location from 'expo-location'
import { getInfraestrutura } from 'api/infraestrutura'
import { mapInfraestruturaGeoJsonResponseToInfraestruturaGeoJson } from 'util/mapInfraestrutura'


export default function Navigator() {
  const [requestInfraestrutura, setRequestInfraestrutura] = useState<RequestInfraestruturaByRadius>()
  const [infraestrutura, setInfraestrutura] = useState<InfraestruturaGeoJson>()
  const emptyGeoJson: InfraestruturaGeoJson = {
    type: "FeatureCollection",
    features: [],
  }
  const mapRef = useRef<MapView>(null)
  const headingRef = useRef<number>(0)

  const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRadians = (deg : any) => (deg * Math.PI) / 180
    const toDegrees = (rad : any) => (rad * 180) / Math.PI

    const dLon = toRadians(lon2 - lon1)

    const y = Math.sin(dLon) * Math.cos(toRadians(lat2))
    const x =
      Math.cos(toRadians(lat1)) * Math.sin(toRadians(lat2)) -
      Math.sin(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.cos(dLon)

    let bearing = toDegrees(Math.atan2(y, x))
    bearing = (bearing + 360) % 360 // Normalize to 0-360
    return bearing
  }

  const [currentPath] =  useState([
          [
            -46.6073804,
            -23.5144303
          ],
          [
            -46.6073127,
            -23.5144599
          ],
        ])


      const getCurrentLocation = async (): Promise<void>  => {
        console.log("HEADING", headingRef.current)
        getHeading()
        if(requestInfraestrutura) return

        // setInitalLoading(true)
        await Location.hasServicesEnabledAsync()
        .then((response) => {
          if (!response){
            // setCurrentLocationError(locationErrors.SERVICE)
            // setInitalLoading(false)
          }else {
            // setCurrentLocationError(null)
          }
        })
        .catch((error)=> {
          // setErrorMessage("Error ao checar serviço de localização: "+ error)
        })
  
        let {status} = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted'){
          // setCurrentLocationError(locationErrors.PERMISSION)
          // setInitalLoading(false)
          return
      }
      
      await Location.getCurrentPositionAsync({})
      .then((response) => {
        // setCurrentLocation(response)
        setRequestInfraestrutura({
          latitude: response.coords.latitude,
          longitude: response.coords.longitude,
          raio: 750
        })
        
      })
      .catch((error) => {
        // setCurrentLocationError(locationErrors.ERROR)
        // setErrorMessage("Error ao obter localização: "+ error)
      }).finally(() => {
        // setInitalLoading(false)
      })
  
    }
    

    const extremesOfOneDirection = (direction: number) : [number, number] => {
      let left = direction - 90
      let right = direction + 90
      if (left < 0) left = 360 + left
      if (right > 360) right = right - 360
      return [left, right]
    }



  const changeMapView = (lat: number, long: number, heading: number) => {
    const [left, right] = extremesOfOneDirection(heading)
    const h = (headingRef.current >= left && headingRef.current <= right) ?  headingRef.current : headingRef.current - 180 >= 0 ?  headingRef.current - 180 : headingRef.current + 180 
    if (mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: lat,
          longitude: long,
        },
        pitch: 90, // Lays the map down
        heading: h,
        zoom: 18,
      }, { duration: 1000 })
    }
  }

    const getHeading = () => {
        if (currentPath.length > 1) {
          const [start, next] = currentPath
          const bearing = calculateBearing(
            start[1],
            start[0],
            next[1],
            next[0],
          );
    
          headingRef.current = bearing
      }
    }


  useEffect(() => {
    if (!requestInfraestrutura) {return}
    getInfraestrutura(requestInfraestrutura, null)
    .then((response) => {
      setInfraestrutura(mapInfraestruturaGeoJsonResponseToInfraestruturaGeoJson(response))
    })
    .catch((response)=>{
      // setErrorMessage("Error ao carregar infraestrutura: " + response.message)
    })
    .finally(()=>{
      console.log("Teriminou a requisição de infraestrutura")
      // isContentLoading && setIsContentLoading(false)
    })
  }, [requestInfraestrutura])

  return (
    <SafeAreaView>
      <MapView style={{ width: '100%', height: '100%' }}
        ref={mapRef}
        googleMapId={process.env.EXPO_PUBLIC_MAP_STYLE_ID}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onUserLocationChange={(e) => { e.nativeEvent.coordinate && changeMapView(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude, e.nativeEvent.coordinate.heading) }}  
      >

      <Geojson
            geojson={infraestrutura || emptyGeoJson}
            strokeWidth={10}
          />

      </MapView>
      <TouchableOpacity
                className='absolute z-0 top-[20px] left-[20px] bg-primary_green p-[10px] rounded-[30px] justify-center items-center'
                onPress={(() => {getCurrentLocation()})}
              >
        <Ionicons name="locate" size={24} color="black" />
      </TouchableOpacity>

    </SafeAreaView>
  )
}
