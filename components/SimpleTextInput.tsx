import { Text, TextInput, useColorScheme } from 'react-native'
import React from 'react'

interface SimpleTextInputProps {
    value: string
    handleChange: (value : string) => void
    errorMessage?: string
    editable?: boolean
    onFocus?: () => void
    type?: 'number-pad' | 'decimal-pad' | 'email-address' | 'url' | 'default'
    max?: number
}

export default function SimpleTextInput( {value, errorMessage: errorMessage, handleChange, onFocus, type, max, editable } : SimpleTextInputProps ) {
  const theme = useColorScheme()
  return (
    <>
        <TextInput
            className={`h-[40px] border-[#ccc] border-[1px] rounded-[5px] mb-[10px$ px-[10px]
              ${theme === 'light'? 'bg-color_lightGray text-black': 'bg-secondary_black text-white'}  
            `}
            value={value}
            onChangeText={handleChange}
            keyboardType={type}
            editable={editable}
            onFocus={onFocus}
            maxLength={max}
            />
        {errorMessage && <Text className="text-sm text-color_red_error">* {errorMessage}</Text>}
    </>
  )
}