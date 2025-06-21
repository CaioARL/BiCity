import { View, TextInput, Appearance, TouchableOpacity, Text, FlatList, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Ionicons } from "@expo/vector-icons"
import { getLatLongByStreetName } from 'api/endereco'
import { ResponseSearchBarAddress } from 'types'
import { AxiosError } from 'axios'


interface SearchBarProps {
    setAddress: ({ lat, lon } : {lat: number, lon: number}) => void
}


export default function SearchBar( { setAddress }: SearchBarProps ) {
    const theme = Appearance.getColorScheme()
    const [isSeaching, setIsSearching] = useState<boolean>(false)
    const [addresses, setAddresses] = useState<ResponseSearchBarAddress[]>()
    const [searchText, setSearchText] = useState<string>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const abortControlllerRef = useRef<AbortController| null>(null)
    const debouceTimeout = useRef<NodeJS.Timeout | null>(null)
    useEffect(()=>{
        if(!searchText || searchText.length < 3) return
        if(debouceTimeout.current) clearTimeout(debouceTimeout.current)
        debouceTimeout.current = setTimeout(()=>{
            abortControlllerRef.current?.abort()
            abortControlllerRef.current = new AbortController()
            setIsLoading(true)
            getLatLongByStreetName({search: searchText}, abortControlllerRef.current)
            .then((response)=>{
                setAddresses(response)
            })
            .catch((response : AxiosError)=>{
                // console.log("ResponseERROR nominetim: " + response.name + " " + response.message )
            })
            .finally(()=>{
                setIsLoading(false)
            })
        }, 300)
    },[searchText])
    
    if(!isSeaching){
        return (
        <TouchableOpacity className={`mt-safe-offset-2 absolute top-0 right-2/4 flex-row items-center justify-center bg-primary_green h-[50px] rounded-[100px] p-2`}
            onPress={()=>setIsSearching(!isSeaching)}
        >
            <Ionicons name="search-outline" size={20} color={theme==='light'?'#555':'#555'}/>
            <Text className={`text-black`}>Buscar Local</Text>
        </TouchableOpacity> 
        )
    }else{
        return (
        <View className='absolute right-0 top-0 z-30 w-full h-full flex-col items-center justify-start'>
                <View 
                    className={`mt-safe-offset-2 flex-row items-center rounded-[100px] px-[10px] h-[50px] w-[90%] border-[1px] border-color__lightGray ${theme==='light'?'bg-white ':'bg-matte_gray'}`}
                > 
                    <TouchableOpacity className='w-[30px]'
                        onPress={()=>{setIsSearching(!isSeaching)}}
                    >
                        <Ionicons name="chevron-back" size={20} color={theme==='light'?'#555':'white'}/>
                    </TouchableOpacity>
                    <TextInput
                        className={`flex-1 text-base ${theme==='light'?'text-black':'text-white'}`}
                        placeholder={"Digite o endereco"}
                        value={searchText}
                        inputMode='search'
                        keyboardType='web-search'
                        placeholderTextColor={theme==='light'?'rgba(0,0,0,0.4)':'rgba(255,255,255,0.4)'}
                        onChangeText={setSearchText}
                        onEndEditing={() => {}}
                    />
                </View>
                {isLoading && <ActivityIndicator size='large' color='#C3FF00'/>}   
                {addresses &&
                    <FlatList
                        data={addresses}
                        keyExtractor={item=>item.place_id.toString()}
                        ListFooterComponent={
                            <View className='flex-row mt-2 items-start justify-center'>
                                <TouchableOpacity className='flex-row items-center justify-center rounded-[20px] p-2 bg-primary_green'
                                    onPress={()=>{setIsSearching(!isSeaching)}}
                                >
                                    <Ionicons name="close" size={30} color={'#555'}/>
                                    <Text className={` text-base text-black`}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        className='container'
                        renderItem={({item})=>(
                            <TouchableOpacity key={item.place_id} className={`w-full p-3 mt-1 rounded-[300px] h-[45px] ${theme==='light'?'bg-white':'bg-secondary_black '}`}
                                onPress={()=>{setAddress({lat: parseFloat(item.lat), lon: parseFloat(item.lon)})}}
                            >
                                <Text className={`text-2xl ${theme==='light'?'text-black':'text-white'}`}>{item.display_name}</Text>
                            </TouchableOpacity>
                        )}

                    />
                }
        </View>
      )
    }
}