import { View, Text, ScrollView, ImageBackground, Image  } from 'react-native';
import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function Index() {
  const backgroundImage = require('../assets/img/logind-backgound.jpg'); 
  const backgroundImageLogo = require('../assets/img/logo.png'); 
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/sign-in');
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, []);

  return (

      <SafeAreaView className="h-full bg-primary_green_milico">
        <ScrollView contentContainerStyle={{ height: '100%' }}>
          <View className="flex-1 items-center justify-center">
            <Text className="text-[32px] text-white font-robotobold mb-[67px]"> BICITY </Text>
            <Image 
              source={backgroundImageLogo} 
              resizeMode="contain" 
              style={{ width: 172, height: 135 }}
            ></Image>
          </View>
        </ScrollView>

        <StatusBar backgroundColor='#161622' style='light' />
      </SafeAreaView>

  );
}