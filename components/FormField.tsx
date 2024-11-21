import { View, Text, TextInput } from 'react-native'
import React from 'react'

interface FormFieldProps {
    title: string
    value: string
    placeholder: string
    handleChangeText: (e : string) => void
    otherStyles?: string
    keyboardType?: 'email-address' | 'default'
}



export default function FormField({ title, value, placeholder, handleChangeText, otherStyles, keyboardType } : FormFieldProps) {
  const [showPassword, setShowPassword] = React.useState(false)


  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className='text-base'>{title}</Text>
      <View className='border-4 border-black w-full h-16 px-4 rounded-2xl bg-slate-950 focus:border-blue-300 items-center'>
        <TextInput
          className='flex-1 text-base'
          value={value}
          placeholder={placeholder}
          onChangeText={handleChangeText}
          keyboardType={keyboardType}
          secureTextEntry={title === 'Password' && !showPassword}
        />
        </View>
    </View>
  )
}