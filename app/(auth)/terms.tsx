import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Linking, ScrollView, Appearance } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import ButtonModal from '../../components/ButtonModal';


type TermsProps = {
  visible: boolean;
  onClose: () => void;
};

export default function Terms({ visible, onClose }: TermsProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const theme = Appearance.getColorScheme()

  React.useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

  const handleOpenDocument = () => {
    const pdfPath = 'https://drive.google.com/file/d/1rfst-lPvq6RCBmVTPb_-E8X3000Pf87k/view?usp=sharing';
    Linking.openURL(pdfPath);
  };

  if (!visible) return null;

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim, justifyContent: 'flex-end' }}>
    <View className='flex-[1] justify-end bg-[rgba(0,0,0,0.5)]'>
      <View className={`rounded-t-3xl h-[300] p-[20px] ${theme==='light'?'bg-white':'bg-secondary_black'}`}>
        <View className='flex-row justify-between mb-[20px]'>
          <Text className={`text-[18px] font-bold ${theme==='light'?'text-black':'text-white'}`}>Política de Privacidade</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#555" />
          </TouchableOpacity>
        </View>

          <ScrollView>
            <Text className={`mb-[20px] ${theme==='light'?'text-black':'text-white'}`}>
              Prezado Usuário,{"\n\n"}
              Antes de prosseguir com o uso do aplicativo BiCity:{"\n"}
              Ao clicar em "Aceitar", você concorda com o armazenamento de cookies do seu dispositivo para melhorar a navegação no aplicativo e experiência.{"\n\n"}
              Acesse o link para saber mais: <Text onPress={handleOpenDocument} style={{ color: '#CCC' }}>Documento</Text>
            </Text>
          </ScrollView>

          <View className="flex-row justify-between">
            <ButtonModal
              title="Aceitar todos"
              handlePress={() => router.replace('sign-up')}
              textStyles="font-bold text-center"
              customStyles="flex-row-reverse"
              iconSource={require('../../assets/terms/icon.png')}
            />
            <ButtonModal
              title="Recusar todos"
              handlePress={onClose}
              textStyles="font-bold text-center"
              customColor="bg-[#CCC]"
            />
          </View>
        </View>
      </View>
    </Animated.View>
  );
}