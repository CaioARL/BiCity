import { Text, TextInput } from 'react-native'
import React from 'react'

interface SimpleTextInputProps {
    value: string
    handleChange: (value : string) => void
    errorMessage?: string
    editable?: boolean
}

export default function SimpleTextInput( {value, errorMessage: errorMessage, handleChange, editable } : SimpleTextInputProps ) {
  return (
    <>
        <TextInput
            className={`h-[40px] border-[#ccc] border-[1px] rounded-[5px] mb-[10px] px-[10px]`}
            value={value}
            onChangeText={handleChange}
            editable={editable}
            />
        {errorMessage && <Text className="text-sm text-color_red_error">* {errorMessage}</Text>}
    </>
  )
}