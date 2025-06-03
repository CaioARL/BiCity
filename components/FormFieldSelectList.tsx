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

  const getBorderColor = () => {
    if (disableEdit) return 'border-color_lightGray';
    if (msg) return 'border-color_red_error';
    if (isValid === true) return 'border-color_green_success';
    if (isValid === false) return 'border-color_red_error';
    return 'border-[#ddd]'; 
  };

  const styles = StyleSheet.create({
    container: {
      marginVertical: 8, 
    },
    title: {
      fontSize: 16,
      color:  '#1f2937',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: (() => {
        if (disableEdit) return '#D1D5DB';
        if (msg) return  '#E81123';
        if (isValid === true) return  '#22c55e';
        if (isValid === false) return  '#E81123';
        return '#ddd';
      })(),
      borderRadius: 10,
      padding: 12,
      width: '100%',
      height: 64,
      backgroundColor: '#FFF',
    },
    inputText: {
      flex: 1,
      color:  '#555',
      fontSize: 16, // `text-base`
    },
    icon: {
      color: '#555',
    },
    errorText: {
      fontSize: 14, 
      color: '#E81123',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: '#C3FF00',
      borderRadius: 10,
      padding: 16,
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
    },
    optionItem: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor:'#E5E7EB',
      borderRadius: 8,
      marginVertical: 2,
    },
    optionText: {
      fontSize: 18,
      color:  '#333',
    },
    closeButton: {
      marginTop: 10,
      padding: 10,
      backgroundColor: '#E5E7EB',
      borderRadius: 12,
      alignItems: 'center',
    },
    closeButtonText: {
      fontSize: 18, 
      color:  '#555',
      fontWeight: '500', 
    },
    modalShadow: {
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => !disableEdit && setModalVisible(true)}
        disabled={disableEdit}
      >
        <Text style={styles.inputText}>
          {options.find(option => option.value === selectedValue)?.nome || 'Selecione uma opção'}
        </Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={'#0000ff'} />
        ) : (
          <Ionicons name="chevron-down" size={20} style={styles.icon} />
        )}
      </TouchableOpacity>
      {msg && <Text style={styles.errorText}>{msg}</Text>}
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