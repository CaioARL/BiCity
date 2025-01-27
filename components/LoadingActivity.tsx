import { View, Text, Modal, ActivityIndicator } from 'react-native'
import React from 'react'


interface LoadingActivityProps {
    
}


export default function LoadingActivity() {
  return (
    <Modal transparent={true} animationType='fade' statusBarTranslucent={true}>
          <View className='flex-[1px] justify-center items-center bg-[#0008]'>
              <ActivityIndicator
                size='large'
                color='#C3FF00'
              />
          </View>
    </Modal>
  )
}