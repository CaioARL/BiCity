import { View, Text, Animated, Modal, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useRef } from 'react'

interface SelectionModalProps {
  visible: boolean
  onClose: () => void
  onSelectProblem: () => void
  onSelectCycleway: () => void
  coords: { latitude: number, longitude: number }
}

export default function SelectionModal({
  visible,
  onClose,
  onSelectProblem,
  onSelectCycleway,
  coords
}: SelectionModalProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start()
    }
  }, [visible, fadeAnim])

  return (
    <Modal visible={visible} transparent={true} animationType="none">
      <Animated.View style={{ opacity: fadeAnim }} className="flex-1">
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={onClose} 
          className="flex-1 bg-[rgba(0,0,0,0.5)] justify-center items-center"
        >
          <View 
            className="bg-white rounded-xl p-5 w-[80%]"
            onStartShouldSetResponder={() => true}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <Text className="text-center text-lg font-bold mb-4">O que deseja fazer?</Text>
            
            <TouchableOpacity 
              onPress={onSelectCycleway}
              className="bg-[#4CAF50] py-3 px-4 rounded-lg mb-3 flex-row items-center justify-center"
            >
              <Text className="text-black text-center font-medium">Avaliar Ciclovia</Text>
              <Image
                source={require('../assets/img/check.png')}
                resizeMode="cover"
                className={`w-6 h-6 ml-5`}
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={onSelectProblem}
              className="bg-[#ffcc00]  py-3 px-4 rounded-lg flex-row items-center justify-center"
            >
              <Text className="text-white text-center font-medium">Reportar Problema</Text>
              <Image
                source={require('../assets/img/reportar.png')}
                resizeMode="cover"
                className={`w-6 h-6 ml-4`}
              />
            </TouchableOpacity>
            
            <Text className="text-xs text-gray-500 mt-3 text-center">
              Coordenadas: {coords.latitude.toFixed(6)}, {coords.longitude.toFixed(6)}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  )
}