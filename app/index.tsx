import { View, Text, ScrollView, Image, ActivityIndicator, Alert  } from 'react-native';
import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuthProvider } from './context/AuthProvider';
import { checkStoredVersion } from 'util/versioning';
import { getNivelHabilidade } from 'api/nivel-habilidade';
import { storeHabilidades } from 'storage/nivel-habilidade';
import { AxiosError } from 'axios';
import { DefaultErrorResponse } from 'types';
import { getTipoEvento } from 'api/tipo-evento';
import { storeTiposEvento } from 'storage/tipo-evento';

export default function Index() {
  const {authState, isLoading} = useAuthProvider() 

  useEffect(() => {
    const loading = async () => {
      if (authState?.authenticated) {
        router.replace('/events')
      } else {
        router.replace('/sign-in')
      }
    }
    loading()
  }, [isLoading])

  useEffect(()=>{
    const initialize = async () => {
      const isUpdated = await checkStoredVersion()
      if(isUpdated){
        await getNivelHabilidade()
        .then((response)=>{
          storeHabilidades(response)
        })
        .catch((error : AxiosError<DefaultErrorResponse>)=>{
          Alert.alert("Erro ao iniciar", error?.response?.data?.message || error.message)
        })
        await getTipoEvento()
        .then((response)=>{
          storeTiposEvento(response)
        })
        .catch((error : AxiosError<DefaultErrorResponse>)=>{
          Alert.alert("Erro ao iniciar", error?.response?.data?.message || error.message)
        })
      }
    }
    initialize()
  },[])

  return (
      <SafeAreaView className="h-full bg-primary_green">
           <View style={{flex: 1, justifyContent: 'flex-end',backgroundColor: 'rgba(0,0,0,0.2)'}}>
            <ScrollView contentContainerStyle={{ height: '100%' }}>
              <View className="flex-1 items-center justify-center">
                <Text className="text-[32px] text-white font-robotobold mb-[54px]"> BICITY </Text>
                <Image 
                  source={require('../assets/img/logo.png')} 
                  resizeMode="contain" 
                  className='h-[172px] w-[135px]'
                  
                ></Image>

                  {isLoading && (
                    <View>
                      <Text>
                        <ActivityIndicator
                          size='large'
                          color='#fff'
                        />
                      </Text>
                    </View>
                  )}
                  
                

              </View>
            </ScrollView>
          </View>
        <StatusBar backgroundColor='#161622' style='light' />
      </SafeAreaView>
  );
}