import { View, Text, TextInput, ActivityIndicator, NativeSyntheticEvent, TextInputEndEditingEventData } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';


interface FormFieldProps {
  title: string;
  value: string;
  msg?: string;
  isValid?: boolean;
  placeholder?: string;
  handleChangeText: (e: string) => void;
  handleEndEditing?: (e: NativeSyntheticEvent<TextInputEndEditingEventData>) => void;
  otherStyles?: string;
  keyboardType?: 'email-address' | 'default' | 'numeric' | 'phone-pad' | 'number-pad' | 'decimal-pad';
  secureTextEntry?: boolean;
  disableEdit?: boolean;
  isLoading?: boolean;
  maxLength?: number;
  onFocus?: () => void
}

export default function FormField({
  title, value, placeholder, handleChangeText, otherStyles, onFocus,
  keyboardType, secureTextEntry, msg, disableEdit, isLoading, isValid, maxLength, handleEndEditing
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const getBorderColor = () => {
    if (disableEdit) return 'border-color_lightGray';
    if (msg) return 'border-color_red_error'; // Campo vazio ou inválido
    if (isValid === true) return 'border-color_green_success'; // Válido
    if (isValid === false) return 'border-color_red_error'; // Inválido
    return 'border-color__lightGray'; // Estado padrão
  };

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base color-secondary_black">{title}</Text>
      <View
        className={`border-2 ${disableEdit ? 'bg-color_lightGray' : 'bg-[rgba(255,255,255,0.9)]'} ${getBorderColor()} w-full h-16 px-4 rounded-[10px] bg-orange-5001e items-center flex-row`}
      >
        <TextInput
          className="flex-1 text-base w-full text-black"
          value={value}
          placeholder={placeholder}
          placeholderTextColor='rgba(0,0,0,0.4)'
          autoCapitalize='none'
          onChangeText={handleChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry && !showPassword}
          onEndEditing={handleEndEditing}
          editable={!disableEdit}
          maxLength={maxLength}
          onFocus={onFocus}
        />
        {secureTextEntry && (
          <TouchableOpacity
            className='flex-row items-center justify-center h-full w-[20%] '
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#D9D9D9" />
          </TouchableOpacity>
        )}
        {isLoading && (
          <ActivityIndicator size="small" color="#0000ff" />
        )}
      </View>
      {msg && <Text className="text-sm text-color_red_error">* {msg}</Text>}
    </View>
  );
}

