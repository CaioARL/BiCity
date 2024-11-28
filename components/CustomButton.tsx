import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'


interface CustomButtonProps {
  title: string
  handlePress: () => void
  containerStyles?: string
  textStyles?: string
  isLoading?: boolean
}


export default function CustomButton({title, handlePress, containerStyles, textStyles, isLoading} : CustomButtonProps ){
  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-yellow-500 rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
      disabled={isLoading}
      >
      
      <Text className={`text-lg ${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  )
}