import { View, Text, Animated, Modal, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import ButtonModal from './ButtonModal';
import FormFieldModal from './FormFieldModal';
import { useTheme } from '../app/context/ThemeProvider';

interface CyclewayRatingModalProps {
  visible: boolean;
  closeModal: (rating: CyclewayRating | null) => void;
  coords: { latitude: number; longitude: number };
}

interface CyclewayRating {
  comentario: string;
  nota: number;
  latitude: number;
  longitude: number;
}

export default function CyclewayRatingModal({ visible, closeModal, coords }: CyclewayRatingModalProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [comentario, setComentario] = useState<string>('');
  const [rating, setRating] = useState<number>(3);

  const [cyclewayRating, setCyclewayRating] = useState<CyclewayRating>({
    comentario: '',
    nota: 3,
    latitude: coords.latitude,
    longitude: coords.longitude,
  });

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
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

  useEffect(() => {
    setCyclewayRating((prev) => ({
      ...prev,
      comentario,
      nota: rating,
      latitude: coords.latitude,
      longitude: coords.longitude,
    }));
  }, [comentario, rating, coords]);

  const renderStars = () => {
    const stars = [1, 2, 3, 4, 5];
    return (
      <View className="flex-row justify-center mb-4">
        {stars.map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            className="mx-1"
          >
            <Text
              className={`text-3xl ${isDarkMode ? 'color-white' : 'color-black'}`}
              style={{ color: star <= rating ? '#FFD700' : isDarkMode ? '#555' : '#CCC' }}
            >
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <View className="flex-row bg-[rgba(0,0,0,0.5)] justify-center h-[100%] w-[100%] items-center">
          <ScrollView
            className={`rounded-[10px] p-[20px] m-[20px] w-[90%] h-auto ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <Text
              className={`text-xl font-bold text-center mb-4 ${
                isDarkMode ? 'color-white' : 'color-black'
              }`}
            >
              Avaliar Ciclovia
            </Text>

            <View className="mb-4">
              <Text
                className={`text-base mb-2 ${isDarkMode ? 'color-gray-300' : 'color-gray-600'}`}
              >
                Qualidade da ciclovia:
              </Text>
              {renderStars()}
            </View>

            <FormFieldModal
              title="Comentário (opcional)"
              placeholder="Deixe seu comentário sobre a ciclovia"
              multiline={true}
              maxLength={200}
              handleChangeText={setComentario}
              value={comentario}
              validantionCheck={() => {}}
            />

            <View className="flex-row justify-between mt-4">
              <ButtonModal
                title="Cancelar"
                handlePress={() => closeModal(null)}
                customStyles={`py-[10px] rounded-[8px] ${
                  isDarkMode ? 'bg-gray-600 border-[1px] border-gray-400' : 'bg-gray-300 border-[1px] border-gray-200'
                }`}
                textStyles={`text-center ${isDarkMode ? 'color-white' : 'color-black'}`}
              />
              <ButtonModal
                title="Enviar Avaliação"
                handlePress={() => closeModal(cyclewayRating)}
                customStyles={`py-[10px] rounded-[8px] ${
                  isDarkMode ? 'bg-green-700 border-[1px] border-green-500' : 'bg-green-500 border-[1px] border-green-300'
                }`}
                textStyles={`text-center ${isDarkMode ? 'color-white' : 'color-black'}`}
              />
            </View>
          </ScrollView>
        </View>
      </Animated.View>
    </Modal>
  );
}