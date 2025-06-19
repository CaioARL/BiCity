import { View, Text, TouchableOpacity, Modal, FlatList, ActivityIndicator, Appearance } from 'react-native';
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
  disableEdit,
  isLoading,
}: FormFieldSelectListProps<any>) {
  const [modalVisible, setModalVisible] = useState(false)
  const theme = Appearance.getColorScheme()
  return (
    <View className={`my-[8px]`}>
      <Text className={`text-base ${theme==='light'?'text-black':'text-white'}`}>{title}</Text>
      <TouchableOpacity
        className={`flex-row items-center justify-between border-[2px] rounded-[12px] p-[16px] w-full h-[61px]  ${disableEdit ? 'bg-gray-200' : theme === 'light'? 'bg-white': 'bg-secondary_black'} border-color__lightGray`}
        onPress={() => !disableEdit && setModalVisible(true)}
        disabled={disableEdit}
      >
        <Text className={`text-base ${theme === 'light'? 'color-black': 'color-white'} flex-1`}>
          {options.find(option => option.value === selectedValue)?.nome || 'Selecione uma opção'}
        </Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={'#0000ff'} />
        ) : (
          <Ionicons name="chevron-down" size={20} color={theme === 'light'? '#555':'#FFF'} />
        )}
      </TouchableOpacity>
      {msg && <Text className={`color-color_red_error text-sm`}>{msg}</Text>}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className='flex-1 justify-center items-center bg-gray-900 bg-opacity-50 bg-[rgba(0,0,0,0.5)]'>
          <View
            className="w-[80%] bg-primary_green rounded-[10px] p-4 "
            style={{ elevation: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8, }}
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