import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Profile() {
  return (
    <SafeAreaView className='h-full'>
      <FlatList 
        data={[{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5},]}
        keyExtractor={item => item.id.toString()} 
        renderItem={({item}) => (
          <View className='items-center justify-center'>
            <Text className='text-xl color-rose-600'>{item.id}</Text>
            </View>
            )}

        ListHeaderComponent={() => (
          <View className='items-center justify-center'>
            <Text className='text-xl color-rose-600'>Profile</Text>
            </View>
            )}
      >
      </FlatList>
    </SafeAreaView>

  )
}