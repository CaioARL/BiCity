import { View, Text, TouchableOpacity, ScrollView, Appearance, Alert, Linking } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useAuthProvider } from '../context/AuthProvider'

export default function Settings() {
    const { onLogout, authState } = useAuthProvider()

    const theme = Appearance.getColorScheme()
    const handleLogout = () => {
        if (onLogout) {
          onLogout()
            .then((response) => {
              // setSuccessMessage(response)
              router.replace('sign-in')
            })
            .catch((error) => {
            //   setErrorMessage(error)
            })
        }
    }
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

        <Text className={`text-3xl text-center my-safe-offset-5 ${theme==='light'?'text-black':'text-white'}`}>Configurações</Text>
        
        <ScrollView className='container h-full w-full flex-col'>
            <TouchableOpacity className='flex-row justify-start items-center border-b-[1px] mb-2 border-color__lightGray h-[45px]'
                onPress={()=>router.push('appearance')}
            >
                <Ionicons size={24} name='color-fill' color={theme==='light'?'#555':'white'}/>
                <Text className={`text-lg text-bold ml-[10px] ${theme==='light'?'text-black':'text-white'} `}>Aparência</Text>
            </TouchableOpacity>
            <TouchableOpacity className='flex-row justify-start items-center border-b-[1px] mb-2 border-color__lightGray h-[45px]'
                onPress={()=>router.push('account')}
            >
                <Ionicons size={24} name='person' color={theme==='light'?'#555':'white'}/>
                <Text className={`text-lg text-bold ml-[10px] ${theme==='light'?'text-black':'text-white'} `}>Conta</Text>
            </TouchableOpacity>
            <TouchableOpacity className='flex-row justify-start items-center border-b-[1px] mb-2 border-color__lightGray h-[45px]'
                onPress={()=>Linking.openURL('https://docs.google.com/document/d/e/2PACX-1vQWTC7d5oj9jrOKxehgLNilsAryq0VBlcnnI7UGWHmQYa9_JvvOqc_ASVb_2W6r2cug4UK1c7S9ETMw/pub')}
            >
                <Ionicons size={24} name='receipt' color={theme==='light'?'#555':'white'}/>
                <Text className={`text-lg text-bold ml-[10px] ${theme==='light'?'text-black':'text-white'} `}>Política de Privacidade</Text>
            </TouchableOpacity>
            <TouchableOpacity className='flex-row justify-start items-center border-b-[1px] mb-2 border-color__lightGray h-[45px]'
                onPress={()=>{
                    Alert.alert("Sair", `Tem certeza de que quer sair da conta: ${authState?.user?.nome} `,
                        [
                        {
                            text: "Sair",
                            onPress: () => handleLogout(),
                            style: "default"
                        },
                        {
                            text: "Cancelar",
                            style: "cancel",
                        },
                        ])
                    }
                }
            >
                <Ionicons size={24} name='exit' color={theme==='light'?'#555':'white'}/>
                <Text className={`text-lg text-bold ml-[10px] ${theme==='light'?'text-black':'text-white'} `}>Sair</Text>
            </TouchableOpacity>

        </ScrollView>
    </SafeAreaView>
  )
}