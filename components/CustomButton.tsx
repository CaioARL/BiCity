import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
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
      className={`bg-primary_green rounded-[10px] w-[100%] min-h-[62px] justify-center items-center mt-[40px] ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
      disabled={isLoading}
      >
      
      {isLoading?(
        <View>
          <Text>
            <ActivityIndicator
              size='small'
              color='#0000ff'
            />
          </Text>
        </View>
        ) : (
          <Text className={`text-lg ${textStyles} font-robotobold text-secondary_black`}>{title}</Text>
        )}
        
    </TouchableOpacity>
  )
}