import { View, Text, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import MapView, { Circle, Marker } from 'react-native-maps'
import { set } from 'zod'


interface MapModalViewProps {
    prop: {
        longitude: number
        latitude: number
    }
    raio?: number
}






export default function MapModalView({prop, raio}: MapModalViewProps) {
    const [loading, setLoading] = useState(true)
    
    const timeout = setTimeout(() => {
     setLoading(false)
     clearTimeout(timeout);
    }, 2000);


    if (loading) {
        return (
            <View>
                <ActivityIndicator
                    size='large'
                    color='#000'
                    />
            </View>
        )
    }
    
  return  (
    <MapView
        style={{ height: 200, width: '100%', marginBottom: 20 }}
        className='h-[200px] w-full mb-[20px]'
        showsUserLocation={true}
        initialRegion={{...prop, latitudeDelta: 0.0922, longitudeDelta:0.0421} }
    >
        <Marker
            coordinate={prop}
                image={require('../assets/pins/flag_location.png')}
            />
    </MapView>
  )
}
  
