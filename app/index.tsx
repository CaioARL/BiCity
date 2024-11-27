import { View, Text, ScrollView } from 'react-native'
import React, { useEffect } from 'react';
import { Link, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
//import CustomButton from '../components/CustomButton'
import { StatusBar } from 'expo-status-bar'

export default function Index() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/sign-in');
    }, 3000);


    return () => clearTimeout(timeout);
  }, []);

    return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-5xl text-primary_green font-robotobold"> BICITY </Text>
          {/* <Link href='/sign-in' className='text-3xl text-blue-600'> Go to Sign in</Link> */}
          
          
          {/*<CustomButton
            title="Go to sign in"
            handlePress={() => router.push('/sign-in')}
            containerStyles="mt-7 w-full"
          />*/}
        </View>
      </ScrollView>

      <StatusBar backgroundColor='#161622' style='light' />

    </SafeAreaView>
  )
}