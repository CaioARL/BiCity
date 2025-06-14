import { View, Text, TextInput, ActivityIndicator, NativeSyntheticEvent, TextInputEndEditingEventData } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import React, {useState} from 'react';


interface FormFieldProps <T>{
    title?: string
    value: string
    msg?: string
    isValid?: boolean
    placeholder?: string
    handleChangeText: (e : string) => void
    endEditing?: ( evento : NativeSyntheticEvent<TextInputEndEditingEventData> ) => void
    onFocus?: () => void
    otherStyles?: string
    keyboardType?: 'email-address' | 'default' | 'numeric' | 'number-pad' | 'url' | 'ascii-capable'
    secureTextEntry?: boolean;
    disableEdit?: boolean;
    isLoading?: boolean;
    maxLength?: number;
    multiline?: boolean;
    mode? :  | 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
  }



export default function FormFieldModal({ title, value, placeholder, handleChangeText, endEditing, onFocus , otherStyles, keyboardType, secureTextEntry, msg, disableEdit, isLoading , isValid, maxLength, multiline, mode } : FormFieldProps<any>) {
  const [showPassword, setShowPassword] = useState(false)


  return (
    <View className={`mb-[10px] ${otherStyles}`}>
      {title && <Text className='text-[16px] text-matte_gray mb-[5px]'>{title}</Text>}
      <View className={`flex-row items-center border-[1px] border-[#ddd] rounded-[8px] ${disableEdit==true &&  'bg-color_lightGray' } ${msg? 'border-color_red_error': isValid && 'border-color_green_success'} `}>
        <TextInput
          className={`flex-1 w-full ${multiline && 'h-[120px] align-top'}`}
          value={value}
          autoCapitalize='none'
          onFocus={onFocus}
          inputMode={mode}
          placeholder={placeholder}
          onChangeText={handleChangeText}
          placeholderTextColor='rgba(0,0,0,0.4)'
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry && !showPassword}
          editable={!disableEdit}
          onEndEditing={endEditing}
          maxLength={maxLength}
          multiline={multiline}
        />
        {secureTextEntry && (
          <Text
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#D9D9D9" />
          </Text>
        )}
      </View>
        {isLoading && (
          <ActivityIndicator
            size='small'
            color='#0000ff'
          />    
        )}

   
        {msg && (<Text className='text-color_red_error'>*{msg}</Text>)}
        
    </View>
  )
}