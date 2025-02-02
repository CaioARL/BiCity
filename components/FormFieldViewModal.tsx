import { View, Text } from 'react-native'
import React from 'react'

interface FormFieldViewModalProps {
    title: string
    value: string | number | boolean
}

export default function FormFieldViewModal({ title, value }: FormFieldViewModalProps) {
  return (
    <View className='mb-[10px]'>
        <Text className='text-[16px] text-[#555] mb-[1px]'>{title}</Text>
        <View className='flex-row items-center border-[1px] border-[#ddd] rounded-[8px] p-[1px] bg-color_lightGray'>
            {
                typeof value === 'boolean' ? (
                    <Text>{value ? 'Yes' : 'No'}</Text>
                ) : (
                    <Text>{value}</Text>
                )
            }
            
        </View>
    </View>
  )
}