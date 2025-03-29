import { View, Text, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import tailwindConfig from '../tailwind.config';

const colors = (tailwindConfig as any)?.theme?.colors as Record<string, string>;

interface FormFieldProps {
  title: string;
  value: string;
  msg?: string;
  isValid?: boolean;
  placeholder?: string;
  handleChangeText: (e: string) => void;
  otherStyles?: string;
  keyboardType?: 'email-address' | 'default' | 'numeric' | 'phone-pad' | 'number-pad' | 'decimal-pad';
  secureTextEntry?: boolean;
  disableEdit?: boolean;
  isLoading?: boolean;
  maxLength?: number;
  theme?: 'light' | 'dark';
}

export default function FormField({
  title, value, placeholder, handleChangeText, otherStyles,
  keyboardType, secureTextEntry, msg, disableEdit, isLoading, isValid, maxLength, theme = 'light'
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
      <Text className={`text-base ${theme === 'dark' ? 'text-white' : 'color-secondary_black'}`}>{title}</Text>
      <View
        className={`border-2 ${disableEdit ? 'bg-color_lightGray' : ''} ${getBorderColor()} w-full h-16 px-4 rounded-[2px] bg-orange-5001e items-center flex-row`}
      >
        <TextInput
          className="flex-1 text-base w-full"
          value={value}
          placeholder={placeholder}
          onChangeText={handleChangeText}
          keyboardType={keyboardType}
          placeholderTextColor={theme === 'dark' ? colors.white : colors.color__lightGray}
          secureTextEntry={secureTextEntry && !showPassword}
          editable={!disableEdit}
          maxLength={maxLength}
        />
        {secureTextEntry && (
          <Text
            onPress={() => setShowPassword(!showPassword)}
            className="text-base"
          >
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#D9D9D9" />
          </Text>
        )}
        {isLoading && (
          <ActivityIndicator size="small" color="#0000ff" />
        )}
      </View>
      {msg && <Text className="text-sm text-color_red_error">{msg}</Text>}
    </View>
  );
}

