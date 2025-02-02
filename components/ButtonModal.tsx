import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

interface ButtonModalProps {
    handlePress: () => void
    title: string
    customStyles?: string
    textStyles?: string
    isLoading?: boolean
    disabled?: boolean
    customColor?: string
}


export default function ButtonModal( { handlePress, title, customStyles, textStyles, isLoading, disabled, customColor }: ButtonModalProps ) {
  return (
    <TouchableOpacity 
        onPress={handlePress}  
        className={
            `p-[10px] rounded-[5px] w-[45%] ${customStyles} ${isLoading ? 'opacity-50' : ''} ${disabled ? 'bg-[#CCC]' : customColor? customColor : 'bg-primary_green'}`
        } 
        disabled={disabled}
    >
        <Text className={textStyles? textStyles :'text-[#FFF] font-bold text-center'} >{title}</Text>
    </TouchableOpacity>
  )
}