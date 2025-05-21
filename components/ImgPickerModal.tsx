import React from 'react'
import { View, Text, Modal, TouchableOpacity, Image } from 'react-native'

interface ImageSelectionPopupProps {
  visible: boolean
  onClose: () => void
  onTakePhoto: () => void
  onPickFromGallery: () => void
}

export default function ImageSelectionPopup({
  visible,
  onClose,
  onTakePhoto,
  onPickFromGallery,
}: ImageSelectionPopupProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-[rgba(0,0,0,0.5)]">
        <View className="bg-white rounded-lg w-[80%] p-5 relative">
          {/* X Close Button */}
          <TouchableOpacity
            className="absolute top-4 right-2 z-10 w-8 h-8 items-center justify-center"
            onPress={onClose}
          >
            <Text className="text-gray-500 font-[12] text-xl">✕</Text>
          </TouchableOpacity>

          <Text className="text-lg font-medium text-center mb-5 mt-1">
            Selecionar imagem
          </Text>

          <TouchableOpacity
            className="flex-row items-center py-4 border-b border-color_light_gray"
            onPress={onTakePhoto}
          >
            <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center mr-4">
              <Image
                source={require('../assets/img/camera.png')}
                resizeMode="cover"
                className="w-6 h-6 ml-4"
                style={{ tintColor: 'black' }}
              />
            </View>
            <Text className="text-base">Tirar foto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center py-4"
            onPress={onPickFromGallery}
          >
            <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center mr-4">
              <Image
                source={require('../assets/img/galeria.png')}
                resizeMode="cover"
                className="w-6 h-6 ml-4"
                style={{ tintColor: 'black' }}
              />
            </View>
            <Text className="text-base">Escolher da galeria</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}