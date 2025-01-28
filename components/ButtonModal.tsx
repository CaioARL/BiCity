import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

interface ButtonModalProps {
    handlePress: () => void
    title: string
    customStyles?: string
    textStyles?: string
    isLoading?: boolean
    disabled?: boolean
}


export default function ButtonModal( { handlePress, title, customStyles, textStyles, isLoading, disabled }: ButtonModalProps ) {
  return (
    <TouchableOpacity 
        onPress={handlePress}  
        className={
            `p-[10px] rounded-[5px] w-[45%] ${customStyles} ${isLoading ? 'opacity-50' : ''} ${disabled ? 'bg-[#CCC]' : 'bg-primary_green'} ${textStyles}`
        } 
        disabled={disabled}
    >
        <Text className='text-[#FFF] font-bold text-center' >{title}</Text>
    </TouchableOpacity>
  )
}