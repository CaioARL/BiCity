import { View, Text, ScrollView, Image, ActivityIndicator, Alert  } from 'react-native'
import React, { useEffect } from 'react'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthProvider } from './context/AuthProvider'

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
      </SafeAreaView>
  )
}