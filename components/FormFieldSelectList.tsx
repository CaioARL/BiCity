import { View, Text, TouchableOpacity, Modal, FlatList, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'

interface FormFieldSelectListProps<T> {
  title: string
  selectedValue: T
  options: { label: string, value: T }[]
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
        className='border-2 border-color__lightGray h-[64px] px-16 border-radious-[2px] items-center flex-row'
        
      >
        <Text>{options.find(option => option.value === selectedValue)?.label || 'Select an option'}</Text>
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
        <View  className='flex-1 justify-center items-center bg-black bg-opacity-50'>
          <View className='w-[80%] bg-white border-radius-[10px] p-4'>
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    handleChange(item.value)
                    setModalVisible(false)
                  }}
                  
                  className='border-t-2 border-color__lightGray'
                >
                  <Text>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)}  className='border-t-2 border-color__lightGray'>
              <Text style={{ color: 'blue' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}