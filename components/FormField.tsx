import { View, Text, TextInput } from 'react-native'
import React, {useState} from 'react'

interface FormFieldProps {
    title: string
    value: string
    placeholder?: string
    handleChangeText: (e : string) => void
    otherStyles?: string
    keyboardType?: 'email-address' | 'default'
}



export default function FormField({ title, value, placeholder, handleChangeText, otherStyles, keyboardType } : FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false)


  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className='text-base'>{title}</Text>
      <View className='border-4 border-black w-full h-16 px-4 rounded-2xl bg-orange-5001e focus:border-blue-300 items-center flex-row'>
        <TextInput
          className='flex-1 text-base w-full'
          value={value}
          placeholder={placeholder}
          onChangeText={handleChangeText}
          keyboardType={keyboardType}
          secureTextEntry={title === 'Password' && !showPassword}
        />
        {title === 'Password' && (
          <Text
            onPress={() => setShowPassword(!showPassword)}
            className='text-base'
          >
            {showPassword ? 'Hide' : 'Show'}
          </Text>
        )}
        </View>
    </View>
  )
}