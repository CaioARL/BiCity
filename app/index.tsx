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
        router.replace('/mapView') // Redirect to the main app if user is logged in
      } else {
        router.replace('/sign-in') // Redirect to the sign-in page
      } 
    }
    loading()
    // const timeout = setTimeout(() => {
    //   if (authState?.authenticated) {
    //     router.replace('/mapView'); // Redirect to the main app if user is logged in
    //   } else {
    //     router.replace('/sign-in'); // Redirect to the sign-in page
    //   }
    // }, 3000);

    // return () => clearTimeout(timeout);
  }, [isLoading])





  return (
    
      <SafeAreaView className="h-full bg-primary_green_milico">
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
        <StatusBar backgroundColor='#161622' style='light' />
      </SafeAreaView>

  );
}