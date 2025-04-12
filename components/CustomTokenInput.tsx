import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useTheme } from '../app/context/ThemeProvider';
import tailwindConfig from '../tailwind.config';

const colors = (tailwindConfig as any)?.theme?.colors as Record<string, string>;

interface TokenInputProps {
  title: string;
  value: string;
  handleChangeText: (text: string) => void;
  msg: string;
  isValid: boolean | undefined;
  maxLength: number;
  theme?: 'light' | 'dark';
}

const TokenInput: React.FC<TokenInputProps> = ({
  title,
  value,
  handleChangeText,
  msg,
  isValid,
  maxLength,
}) => {
  const [token, setToken] = useState<string[]>(['', '', '', '']);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    if (value) {
      const newToken = value.split('').slice(0, 4);
      setToken([...newToken, ...Array(4 - newToken.length).fill('')]);
    }
  }, [value]);

  const handleInputChange = (text: string, index: number) => {
    const newToken = [...token];

    if (text.length > 1) {
      const pastedCode = text.slice(0, 4).split('');
      const updatedToken = [...pastedCode, ...Array(4 - pastedCode.length).fill('')];
      setToken(updatedToken);
      handleChangeText(updatedToken.join(''));
      inputRefs.current[3]?.focus();
      return;
    }

    newToken[index] = text;
    setToken(newToken);
    handleChangeText(newToken.join(''));

    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    } else if (!text && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const getBorderColor = (index: number): string => {
    if (msg) return 'border-red-500';
    if (isValid === false) return 'border-red-500';
    if (isValid === true && token[index]) return 'border-green-500';
    return theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
  };

  return (
    <View className={`my-2`}>
      <Text
        className={`text-base mb-5 text-center ${
          theme === 'dark' ? 'color-white' : 'color-gray-800'
        }`}
      >
        {title}
      </Text>
      <View className="flex-row justify-between w-4/5 self-center">
        {token.map((digit: string, index: number) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            className={`w-12 h-12 border rounded-lg text-lg text-center ${
              theme === 'dark'
                ? 'bg-gray-800 border-white color-white '
                : 'bg-white'
            } ${getBorderColor(index)}`}
            value={digit}
            onChangeText={(text) => handleInputChange(text, index)}
            maxLength={1}
            placeholder="-"
            placeholderTextColor={theme === 'dark' ? '#A1A1AA' : '#8E8E93'}
            keyboardType="numeric"
          />
        ))}
      </View>
      {msg && (
        <Text
          className={`text-red-500 text-xs mt-1 text-center ${
            theme === 'dark' ? 'color-red-400' : 'color-red-500'
          }`}
        >
          {msg}
        </Text>
      )}
    </View>
  );
};

export default TokenInput;