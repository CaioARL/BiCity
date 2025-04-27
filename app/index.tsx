import { View, Text, ScrollView, ImageBackground, Image, ActivityIndicator  } from 'react-native';
import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuthProvider } from './context/AuthProvider';

export default function Index() {
  const {authState, isLoading} = useAuthProvider()
  const backgroundImageLogo = require('../assets/img/logo.png'); 

  useEffect(() => {
    const loading = async () => {
      if (authState?.authenticated) {
        authState?.user?.role === 'PF' ?
        router.replace('/home')
        :
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
                  source={backgroundImageLogo} 
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