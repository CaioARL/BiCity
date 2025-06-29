import { View, Text, TouchableOpacity, ScrollView, useColorScheme, ActivityIndicator, Appearance } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { clearTheme, getTheme, storeTheme } from 'storage/theme'

export default function AppearanceSetttings() {
  const theme = useColorScheme()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [currentTheme, setCurrentTheme] = useState<'light'|'dark'|''|string|null>()
  useEffect(()=>{
    getTheme()
    .then((response)=>{
      setCurrentTheme(response)
    })
    .catch()
    .finally(()=>{setIsLoading(false)})
  },[])

  if(isLoading)
    return(<ActivityIndicator/>)
  else
  return (
     <SafeAreaView className={` ${theme==='light'?'bg-white':'bg-secondary_black'} `}>
        <TouchableOpacity
                style={{ position: 'absolute', top: 45, right: 20, borderRadius: '50%',  paddingHorizontal: 15,
                  paddingVertical: 15, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, zIndex: 10,}} 
                  className={`${theme==='light'?'bg-primary_green':'bg-secondary_black'}`}
                  onPress={() => router.back()}
                >
                <Ionicons name='arrow-back' size={24} color={theme==='light'?'#555':'white'}/>
        </TouchableOpacity>

        <Text className={`text-3xl text-center my-safe-offset-5 ${theme==='light'?'text-black':'text-white'}`}>Aparência</Text>
        
        <ScrollView className='container h-full w-full flex-col'>
            <Text className={`text-2xl text-bold ${theme==='light'?'text-black':'text-white'} `}>Modo </Text>
            <TouchableOpacity className='flex-row justify-start items-center border-b-[1px] mb-2 border-color__lightGray h-[45px]'
              onPress={()=>{
                Appearance.setColorScheme('light')
                storeTheme('light')
                setCurrentTheme('light')
              }}
            >
                <Ionicons size={24} name={currentTheme==='light' ? 'checkbox' : 'square-outline'} color={theme==='light'?'#555':'white'}/>
                <Text className={`text-lg text-bold ml-[10px] ${theme==='light'?'text-black':'text-white'} `}>Light</Text>
            </TouchableOpacity>
            <TouchableOpacity className='flex-row justify-start items-center border-b-[1px] mb-2 border-color__lightGray h-[45px]'
            onPress={()=>{
              Appearance.setColorScheme('dark')
              storeTheme('dark')
              setCurrentTheme('dark')
            }}
            >
                <Ionicons size={24} name={currentTheme==='dark' ? 'checkbox' : 'square-outline'} color={theme==='light'?'#555':'white'}/>
                <Text className={`text-lg text-bold ml-[10px] ${theme==='light'?'text-black':'text-white'} `}>Dark</Text>
            </TouchableOpacity>
            <TouchableOpacity className='flex-row justify-start items-center border-b-[1px] mb-2 border-color__lightGray h-[45px]'
            onPress={()=>{
              Appearance.setColorScheme(null)
              clearTheme()
              setCurrentTheme(null)
            }}
            >
                <Ionicons size={24} name={currentTheme===null ? 'checkbox' : 'square-outline'} color={theme==='light'?'#555':'white'}/>
                <Text className={`text-lg text-bold ml-[10px] ${theme==='light'?'text-black':'text-white'} `}>Sistema</Text>
            </TouchableOpacity>

        </ScrollView>
    </SafeAreaView>
  )
}