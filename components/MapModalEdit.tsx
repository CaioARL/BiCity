import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import MapView, { Circle, Marker, Region } from 'react-native-maps'
import { set } from 'zod'
import ButtonModal from './ButtonModal'


interface coordinate {
    latitude: number
    longitude: number
}


interface MapModalEditProps {
    getRegion : (region : Region) => void
    initalRegion?: coordinate
}






export default function MapModalEdit({getRegion, initalRegion}: MapModalEditProps) {
    const [loading, setLoading] = useState(true)
    const [region, setRegion] = useState<Region>({ latitude: 0, longitude: 0, latitudeDelta: 0.0922, longitudeDelta: 0.0421, })
    const [isSelected, setIsSelected] = useState(false)
    
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
    <>
    <MapView
        style={{ height: 200, width: '100%', marginBottom: 20 }}
        className='h-[200px] w-full mb-[20px]'
        onRegionChange={setRegion}
        showsUserLocation={true}
        initialRegion={initalRegion ? {...initalRegion, latitudeDelta: 0.0922 , longitudeDelta:0.0421 } : {latitude: -23.55052, longitude: -46.633308, latitudeDelta: 0.05, longitudeDelta: 0.05,}}
        onTouchEnd={() => isSelected && setIsSelected(false)}
        >
        
        
        <Marker
            coordinate={region}
            image={isSelected ? require('../assets/pins/flag_location.png') : require('../assets/pins/flag_selection.png')}
            />

    </MapView>
    <ButtonModal 
        title='Selecionar localização'
        customStyles='w-full'
        customColor='bg-[#000] mt-[5px] mb-[15px]'
        handlePress={() => {
            getRegion(region)
            setIsSelected(true)
        }}   
         />
    </>
  )
}
  
