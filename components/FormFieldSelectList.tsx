import { View, Text, TouchableOpacity, Modal, FlatList, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'

interface FormFieldSelectListProps<T> {
  title: string
  selectedValue: T
  options: { nome: string, id: number, value: T }[]
  handleChange: (value: T) => void
  msg?: string
  isValid?: boolean
  otherStyles?: string
  disableEdit?: boolean
  isLoading?: boolean
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
  isLoading
}: FormFieldSelectListProps<any>) {
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className='text-base color-secondary_black'>{title}</Text>
      <TouchableOpacity
        onPress={() => !disableEdit && setModalVisible(true)}
        className='border-2 border-color__lightGray h-[64px] px-16 rounded-[20px] items-center flex-row'
        
      >
        <Text>{options.find(option => option.value === selectedValue)?.nome || 'Select an option'}</Text>
      </TouchableOpacity>
      {isLoading && (
        <ActivityIndicator 
          size='small'
          color='#0000ff'
        />
      )}
      {msg && (<Text className='text-sm text-color_red_error'>{msg}</Text>)}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
      >
        <View  className='flex-1 justify-center items-center bg-black opacity-90'>
          <View className='w-[80%] bg-primary_green rounded-[10px] p-4'>
            <FlatList
              data={options}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    handleChange(item.value)
                    setModalVisible(false)
                  }}
                  
                  className='border-t-2 border-black'
                >
                  <Text className='text-xl'>{item.nome}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)}  className='border-t-2 border-black'>
              <Text className='text-xl'>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}