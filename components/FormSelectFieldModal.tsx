import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

interface FormSelectFieldModalProps {
    handleChangeValue: (e : boolean) => void   
    value: boolean
    title: string
    option_1: string
    option_2: string
    customStyles?: string

}


export default function FormSelectFieldModal({ handleChangeValue, value , title, option_1 , option_2}: FormSelectFieldModalProps) {
  return (
    <View >
        <Text className='text-[16px] text-[#555] mb-[5px]'>{title}</Text>
            <View className='flex-row w-[100%] justify-between'>
                <TouchableOpacity
                    className={`flex-row items-center w-[50%] mb-[15px] py-[10px] ${value && ''}`}
                    onPress={() => handleChangeValue(true)}
                >
                    <Ionicons 
                    name={value ? "checkmark-circle" : "square-outline"} 
                    size={20} 
                    color={value ? "#C3FF00" : "#333"} 
                    />
                    <Text className='text-[16px] ml-[10px] '>{option_1}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-row items-center w-[50%] mb-[15px] py-[10px] ${!value && ''}`}
                    onPress={() => handleChangeValue(false)}
                >
                    <Ionicons 
                    name={!value ? "checkmark-circle" : "square-outline"} 
                    size={20} 
                    color={!value ? "#C3FF00" : "#333"} 
                    />
                    <Text className='text-[16px] ml-[10px]' >{option_2}</Text>
                </TouchableOpacity>
            </View>
    </View>
  )
}