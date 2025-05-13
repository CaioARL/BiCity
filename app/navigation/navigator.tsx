import React, { useRef, useEffect } from 'react'
import { SafeAreaView, TouchableOpacity } from 'react-native'
import MapView from 'react-native-maps'
import { Ionicons } from '@expo/vector-icons'
import { Magnetometer } from 'expo-sensors'

export default function Navigator() {
  const mapRef = useRef<MapView>(null)
  const headingRef = useRef<number>(0)

  // change the map view vertically - lay down the map 
  const changeMapView = (lat: number, long: number) => {
    if (mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: lat,
          longitude: long,
        },
        pitch: 90, // Lays the map down
        heading: headingRef.current, // Set the heading to the current magnetometer value
        zoom: 18,
      }, { duration: 1000 })
    }
  }

  // Function to convert magnetometer data to heading in degrees
  const calculateHeading = (data: { x: number; y: number; z: number }) => {
    let { x, y } = data
    let angle = Math.atan2(y, x) * (180 / Math.PI)
    return (angle >= 0 ? angle : angle + 360) // Normalize to 0-360 degrees
  }

  // const smoothHeading = (newHeading: number, alpha: number = 0.1) => {
  //   smoothedHeadingRef.current =
  //     alpha * newHeading + (1 - alpha) * smoothedHeadingRef.current
  //   return smoothedHeadingRef.current
  // }

  useEffect(() => {
    const subscription = Magnetometer.addListener((data) => {
      const heading = calculateHeading(data)
      headingRef.current = heading
    })
    // Set the update interval for the magnetometer
    Magnetometer.setUpdateInterval(100)
    return () => {
      subscription.remove() // Clean up the listener on unmount
    }
  }, [])

  return (
    <SafeAreaView>
      <MapView style={{ width: '100%', height: '100%' }}
        ref={mapRef}
        googleMapId={process.env.EXPO_PUBLIC_MAP_STYLE_ID}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onUserLocationChange={(e) => { e.nativeEvent.coordinate && changeMapView(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude) }}  
      >

      </MapView>
      <TouchableOpacity
                className='absolute z-0 top-[20px] left-[20px] bg-primary_green p-[10px] rounded-[30px] justify-center items-center'
                onPress={(() => {console.log('pressed')})}
              >
        <Ionicons name="locate" size={24} color="black" />
      </TouchableOpacity>

    </SafeAreaView>
  )
}
