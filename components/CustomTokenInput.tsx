import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';

interface TokenInputProps {
  title: string;
  value: string;
  handleChangeText: (text: string) => void;
  msg: string;
  isValid: boolean | undefined;
  maxLength: number;
  onFocus?: () => void;
}

const TokenInput: React.FC<TokenInputProps> = ({ title, value, handleChangeText, msg, isValid, maxLength, onFocus }) => {
  const [token, setToken] = useState<string[]>(['', '', '', '']);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (value) {
      const newToken = value.split('').slice(0, 4);
      setToken([...newToken, ...Array(4 - newToken.length).fill('')]);
    }
  }, [value]);

  const handleInputChange = (text: string, index: number) => {
    const newToken = [...token];

    if (text.length > 1) { // Caso de colagem
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
    if (msg) return 'border-red-500'; // Vermelho se houver mensagem de erro (ex.: "Campo obrigatório")
    if (isValid === false) return 'border-red-500'; // Vermelho se a validação falhar explicitamente
    if (isValid === true && token[index]) return 'border-green-500'; // Verde se válido e campo preenchido
    return 'border-gray-300'; // Cinza por padrão
  };

  

  return (
    <View className="my-2">
      <Text className="text-base color-secondary_black mb-5 text-center">{title}</Text>
      <View className="flex-row justify-between w-4/5 self-center">
        {token.map((digit: string, index: number) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            className={`w-12 h-12 border rounded-lg text-lg text-center ${getBorderColor(index)}`}
            value={digit}
            onChangeText={(text) => handleInputChange(text, index)}
            maxLength={1}
            onFocus={onFocus}
          />
        ))}
      </View>
      {msg && <Text className="text-red-500 text-xs mt-1 text-center">{msg}</Text>}
    </View>
  );
};

export default TokenInput;