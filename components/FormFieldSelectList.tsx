import { View, Text, TouchableOpacity, Modal, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';

interface FormFieldSelectListProps<T> {
  title: string;
  selectedValue: T;
  options: { nome: string; id: number; value: T }[];
  handleChange: (value: T) => void;
  msg?: string;
  isValid?: boolean;
  otherStyles?: string;
  disableEdit?: boolean;
  isLoading?: boolean;
}

export default function FormFieldSelectList({
  title,
  selectedValue,
  options,
  handleChange,
  msg,
  isValid,
  otherStyles,
  disableEdit,
  isLoading,
}: FormFieldSelectListProps<any>) {
  const [modalVisible, setModalVisible] = useState(false);

  // Lógica de getBorderColor igual ao FormField
  const getBorderColor = () => {
    if (disableEdit) return 'border-color_lightGray';
    if (msg) return 'border-color_red_error'; // Campo vazio ou inválido
    if (isValid === true) return 'border-color_green_success'; // Válido
    if (isValid === false) return 'border-color_red_error'; // Inválido
    return 'border-[#ddd]'; // Estado padrão ajustado para corresponder ao exemplo
  };

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base color-secondary_black">{title}</Text>
      <TouchableOpacity
        className={`flex-row items-center border-[2px] border-color__lightGray h-[64px] ${getBorderColor()} rounded-[4] p-[12px] bg-white`}
      
        onPress={() => !disableEdit && setModalVisible(true)}
        disabled={disableEdit}
      >
        <Text className="color-[#555] flex-1 text-base">
          {options.find(option => option.value === selectedValue)?.nome || 'Selecione uma opção'}
        </Text>
        {isLoading ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          <Ionicons name="chevron-down" size={20} color="#555" />
        )}
      </TouchableOpacity>
      {msg && <Text className="text-sm text-color_red_error">{msg}</Text>}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className='flex-1 justify-center items-center bg-gray-900 bg-opacity-50 bg-[rgba(0,0,0,0.5)]'>
          <View
            className="w-[80%] bg-primary_green rounded-[10px] p-4 "
            style={styles.modalShadow}
          >
            <FlatList
              data={options}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    handleChange(item.value);
                    setModalVisible(false);
                  }}
                  className="p-[12px] border-b-[1px] border-gray-200 hover:bg-gray-100 bg rounded-[8px] my-[2px] border-color__lightGray"
                >
                  <Text className="text-lg color-[#333]">{item.nome}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false} // Remove a barra de rolagem para um visual mais limpo
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="mt-[10px] p-[10px] bg-gray-200 rounded-[12px] items-center"
            >
              <Text className="text-lg color-[#555] font-medium">Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({

  modalShadow: {
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
});