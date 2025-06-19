import { View, Text, Animated, Modal, TouchableOpacity, Image, Appearance } from 'react-native'
import React, { useEffect, useRef } from 'react'

interface OpsModalProps {
  visible?: boolean
  onClose: () => void
  problemaAvailable: boolean
  onSelectProblema: () => void
  onSelectInfraestrutura: () => void
}

export default function OpsModal({
  visible,
  onClose,
  onSelectProblema: onSelectProblema,
  onSelectInfraestrutura: onSelectInfraestrutura,
  problemaAvailable,
}: OpsModalProps) {
  const theme = Appearance.getColorScheme()
  // const fadeAnim = useRef(new Animated.Value(0)).current

  // useEffect(() => {
  //   if (visible) {
  //     Animated.timing(fadeAnim, {
  //       toValue: 1,
  //       duration: 300,
  //       useNativeDriver: true,
  //     }).start()
  //   } else {
  //     Animated.timing(fadeAnim, {
  //       toValue: 0,
  //       duration: 200,
  //       useNativeDriver: true,
  //     }).start()
  //   }
  // }, [visible, fadeAnim])


  return (
    <Modal visible={visible} transparent={true} animationType="none">
      {/* <Animated.View style={{ opacity: fadeAnim }} className="flex-1"> */}
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={onClose} 
          className="flex-1 bg-[rgba(0,0,0,0.5)] justify-center items-center"
        >
          <View 
            className={`rounded-xl p-5  w-[80%] ${theme === 'light'? 'bg-white': 'bg-secondary_black'}`}
            onStartShouldSetResponder={() => true}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <Text className={`text-center text-lg ${theme === 'light'? 'color-secondary_black': 'color-white'}`}>O que deseja fazer?</Text>
            
            <TouchableOpacity 
              onPress={onSelectInfraestrutura}
              className="pt-[30px] px-4 rounded-lg mb-3 flex-row items-center justify-center"
            >
              <Text className={`text-center font-medium ${theme === 'light'? 'color-secondary_black': 'color-white'}`}>Avaliar Ciclovia</Text>
              <Image
                source={require('../assets/img/check.png')}
                resizeMode="cover"
                className={`w-6 h-6 ml-5`}
              />
            </TouchableOpacity>

            <View className={`h-px w-full my-2 `} style={{ borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc' }} />
            
            <TouchableOpacity 
              onPress={onSelectProblema}
              disabled={!problemaAvailable}
              className={`py-3 px-4 rounded-lg flex-row items-center justify-center ${!problemaAvailable && 'opacity-50'}`}
            >
              <Text className={`text-center font-medium ${theme === 'light'? 'color-secondary_black': 'color-white'}`}>Reportar Problema</Text>
              <Image
                source={require('../assets/img/reportar.png')}
                resizeMode="cover"
                className="w-6 h-6 ml-4"
                style={{ tintColor:  theme==='light'?'black':'white'}}
              />
            </TouchableOpacity>
            
            {/* <Text className='text-xs text-gray-500 mt-3 text-center color-secondary_black`>
              Coordenadas: {coords.latitude.toFixed(6)}, {coords.longitude.toFixed(6)}
            </Text> */}
          </View>
        </TouchableOpacity>
      {/* </Animated.View> */}
    </Modal>
  )
}