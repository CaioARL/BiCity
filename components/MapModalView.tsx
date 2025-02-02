import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
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
    const [loading, setLoading] = React.useState(true)
    
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
        initialRegion={{...prop, latitudeDelta: 2, longitudeDelta:2} }
    >
        <Circle
            center={prop}
            radius={raio? raio : 200}
            strokeColor="#C3FF00"
            fillColor="rgba(195, 255, 0, 0.3)"
            />
    </MapView>
  )
}
  
