import { View, Text, TouchableOpacity, Appearance } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

interface FormSelectFieldModalProps {
    handleChangeValue: (e : boolean) => void   
    value: boolean
    title: string
    option_1: string
    option_2: string
    customStyles?: string
    disableEdit?: boolean
}


export default function FormSelectFieldModal({ handleChangeValue, value , title, option_1 , option_2, disableEdit}: FormSelectFieldModalProps) {
    const theme = Appearance.getColorScheme()    
return (
    <View >
        <Text className={`text-[16px] text-[#555] mb-[5px] ${theme==='light'?'text-black':'text-white'}`}>{title}</Text>
            <View className='flex-row w-[100%] justify-between'>
                <TouchableOpacity
                    className={`flex-row items-center w-[50%] mb-[15px] py-[10px] ${value && ''}`}
                    onPress={() => handleChangeValue(true)}
                    disabled={disableEdit}
                >
                    <Ionicons 
                    name={value ? "checkmark-circle" : "square-outline"} 
                    size={20} 
                    color={value ? "#C3FF00" : theme==='light'?'#333':'white'} 
                    />
                    <Text className={`text-[16px] ml-[10px] ${theme==='light'?'text-black':'text-white'}`}>{option_1}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-row items-center w-[50%] mb-[15px] py-[10px] ${!value && ''}`}
                    onPress={() => handleChangeValue(false)}
                    disabled={disableEdit}
                >
                    <Ionicons 
                    name={!value ? "checkmark-circle" : "square-outline"} 
                    size={20} 
                    color={!value ? "#C3FF00" : theme==='light'?'#333':'white'} 
                    />
                    <Text className={`text-[16px] ml-[10px]  ${theme==='light'?'text-black':'text-white'}`}>{option_2}</Text>
                </TouchableOpacity>
            </View>
    </View>
  )
}