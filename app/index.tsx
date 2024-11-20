import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Index() {
  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ height: '100%' }} >
        <View className='flex-1 items-center justify-center bg-white'>
          <Text className='text-5xl' > BICITY </Text>
          <Link href='/sign-in' className='text-3xl text-blue-600'> Go to Sign in</Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}