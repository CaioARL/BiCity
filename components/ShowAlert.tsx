import { View, Text, Animated, Modal, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'




interface AlertConfig {
    onClose: () => void 
    type: 'success' | 'error' | 'loading'
    message: string
    isStatic?: boolean
}

export default function ShowAlert( { type, message, onClose, isStatic }: AlertConfig ) {




const [animation] = useState(new Animated.Value(0))
useEffect(() => {
  if(isStatic) {
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
  ]).start()
    return
  }
  Animated.sequence([
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }),
    Animated.delay(3000),
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }),
  ]).start( onClose )
  }, [])




  const getAlertColor = () => {
    switch (type) {
      case 'success': return '#22c55e'
      case 'error': return '#ef4444'
      case 'loading': return '#3b82f6'
      default: return '#3b82f6'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'success': return <Ionicons name="checkmark-circle" size={24} color="white" />
      case 'error': return <Ionicons name="close-circle" size={24} color="white" />
      case 'loading': return <Ionicons name="reload" size={24} color="white" />
      default: return null
    }
  }





  return (
        <View className="absolute h-[100px] top-10 left-0 bottom-0 z-10 right-0 px-4">
          <Animated.View className='h-fit'
              style={[
              styles.alert,
              {
                  backgroundColor: getAlertColor(),
                  transform: [{
                  translateY: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-100, 0],
                  }),
                  }],
              },
              ]}
          >
              <View className="flex-row items-center flex-1">
              {getIcon()}
              <Text className="text-white ml-3 text-base flex-1">{message}</Text>
              </View>
              <TouchableOpacity onPress={ onClose } className="p-1">
              <Text className="text-white text-2xl font-bold">×</Text>
              </TouchableOpacity>
          </Animated.View>
        </View>
  )
}

const styles = StyleSheet.create({
  alert: {
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});