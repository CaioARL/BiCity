import { View, TextInput, Appearance, TouchableOpacity, Text } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from "@expo/vector-icons"

export default function SearchBar() {
    const theme = Appearance.getColorScheme()
    const [isSeaching, setIsSearching] = useState<boolean>(false)
    const [searchText, setSearchText] = useState<string>()
    
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
                        placeholder={"Digite o nome do evento"}
                        value={searchText}
                        inputMode='search'
                        keyboardType='web-search'
                        placeholderTextColor={theme==='light'?'rgba(0,0,0,0.4)':'rgba(255,255,255,0.4)'}
                        onChangeText={setSearchText}
                        onEndEditing={() => {}}
                    />
                    {/* <TouchableOpacity onPress={() => {}}>
                        <Ionicons name="locate" size={20} color={theme==='light'?'#555':'white'} />
                    </TouchableOpacity> */}
                </View>   
            <TouchableOpacity className='w-full h-full' onPress={()=>{setIsSearching(!isSeaching)}}/>
        </View>
      )
    }
}