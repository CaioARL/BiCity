import { View, Text, Animated, Modal, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ButtonModal from './ButtonModal'
import FormFieldModal from './FormFieldModal'
import * as ImagePicker from 'expo-image-picker'
import { ListTipoProblema, RequestCreateProblema } from '../types'
import FormFieldDropdownSelectList from './FormFieldDropdownSelectList'
import { getTipoProblema } from '../api/tipo-problema'
import ImageSelectionPopup from '../components/ImageSelectionPopupProblema'

interface ModalProps {
  visible: boolean
  closeModal: (problema: RequestCreateProblema | null, image: string | null) => void
  coords: { latitude: number; longitude: number }
}

export default function ProblemaModal({ visible, closeModal, coords }: ModalProps) {
  const [listTipoProblema, setListTipoProblema] = useState<ListTipoProblema[]>([])
  const [descricao, setDecricao] = useState<string>('')
  const [image, setImage] = useState<string | null>(null)
  const fadeAnim = useRef(new Animated.Value(0)).current
  const [showImagePopup, setShowImagePopup] = useState(false)
  const [problema, setProblema] = useState<RequestCreateProblema>({
    descricao: '',
    ativo: true,
    latitude: coords.latitude,
    longitude: coords.longitude,
    idTipoProblema: 1,
  })

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }, [visible, fadeAnim])

  const pickImageFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        alert('Desculpe, precisamos de permissão para acessar a galeria!')
        return
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      })

      if (!result.canceled && result?.assets?.[0]?.uri) {
        setImage(result.assets[0].uri)
      }
      setShowImagePopup(false)
    } catch (error) {
      console.error('Error picking image:', error)
      setShowImagePopup(false)
    }
  }

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync()
      if (status !== 'granted') {
        alert('Desculpe, precisamos de permissão para acessar a câmera!')
        return
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      })

      if (!result.canceled && result?.assets?.[0]?.uri) {
        setImage(result.assets[0].uri)
      }
      setShowImagePopup(false)
    } catch (error) {
      console.error('Error taking photo:', error)
      setShowImagePopup(false)
    }
  }

  const handleCloseImagePopup = () => {
    setShowImagePopup(false)
  }

  const showImageOptions = () => {
    setShowImagePopup(true)
  }

  useEffect(() => {
    getTipoProblema()
      .then((response) => {
        setListTipoProblema([])
        response.forEach((tipoProblema) => {
          setListTipoProblema((prevState) => [
            ...prevState,
            {
              nome: tipoProblema.descricao,
              id: tipoProblema.id,
              value: tipoProblema,
            },
          ])
        })
      })
      .catch((error) => {
        console.log('Error fetching tipo problema:', error)
      })
  }, [])

  const updateCampoProblema = (campo: string, value: string) => {
    setProblema((prevState) => ({
      ...prevState,
      [campo]: value,
    }))
  }

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent={true}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <View className="flex-row bg-[rgba(0,0,0,0.5)] justify-center h-[100%] w-[100%] items-center">
            <ScrollView className={'rounded-[10px] p-[20px] m-[20px] bg-white w-[90%] h-auto'}>
              <FormFieldModal
                title="Descrição do problema"
                placeholder="Descreva o problema"
                multiline={true}
                maxLength={100}
                handleChangeText={setDecricao}
                value={descricao}
                validantionCheck={(e) => {
                  updateCampoProblema('descricao', e.nativeEvent.text)
                }}
              />
              <FormFieldDropdownSelectList
                title="Tipo de Problema"
                selectedValue={listTipoProblema.find((item) => item.id === problema.idTipoProblema)}
                options={listTipoProblema}
                handleChange={(e) => {
                  updateCampoProblema('idTipoProblema', String(e.id))
                }}
                isLoading={false}
                dropDownSize={'100%'}
              />

              <TouchableOpacity onPress={showImageOptions} activeOpacity={0.7}>
                {image ? (
                  <View>
                    <Image
                      className="h-[120px] w-[100%] rounded-[10px] mb-4 border-[1px] border-color__lightGray"
                      source={{ uri: image }}
                    />
                    <Text className="text-center text-xs text-gray-500 mb-4">
                      Toque para alterar a imagem
                    </Text>
                  </View>
                ) : (
                  <View className="h-[120px] w-[100%] mb-4 bg-[#f0f0f0] rounded-[10px] items-center justify-center">
                    <Text className="text-gray-500 mb-2">Toque para adicionar uma imagem</Text>
                    <Text className="text-xs text-gray-400">Você pode tirar uma foto ou escolher da galeria</Text>
                  </View>
                )}
              </TouchableOpacity>
              <View className="flex-row justify-between">
                {problema && (
                  <ButtonModal
                    title="Cancelar"
                    handlePress={() => closeModal(null, null)}
                    customStyles=""
                    textStyles="text-black"
                  />
                )}
                <ButtonModal
                  title="Reportar !"
                  handlePress={() => closeModal(problema, image)}
                  customStyles="bg-[#ffcc00]"
                  textStyles="text-black"
                />
              </View>
            </ScrollView>
          </View>
        </Animated.View>
      </Modal>

      <ImageSelectionPopup
        visible={showImagePopup}
        onClose={handleCloseImagePopup}
        onTakePhoto={takePhoto}
        onPickFromGallery={pickImageFromGallery}
      />
    </>
  )
}