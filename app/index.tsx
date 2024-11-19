import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Index() {
  return (
    <SafeAreaView className='bg-blue-500'>
      <ScrollView contentContainerStyle={{ height: '100%' }} >
        <View className='flex-1 items-center justify-center bg-blue-500'>
          <Text className='text-3xl' > BICITY </Text>
          <Link href='/home' > Go to HOME</Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}