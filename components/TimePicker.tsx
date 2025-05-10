import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, NativeSyntheticEvent, NativeScrollEvent, StyleSheet, Modal } from 'react-native';
import ButtonModal from './ButtonModal'

interface TimePickerProps {
  onClose: (time: string) => void;
}

const TimePicker = ({ onClose } : TimePickerProps) => {
  const [selectedHour, setSelectedHour] = useState('12');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const hoursScrollViewRef = useRef<ScrollView>(null);
  const minutesScrollViewRef = useRef<ScrollView>(null);

  const ITEM_HEIGHT = 50;

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const infiniteHours = [...hours, ...hours, ...hours];
  const infiniteMinutes = [...minutes, ...minutes, ...minutes];

  useEffect(() => {
    if (hoursScrollViewRef.current) {
      const indexHour = hours.indexOf(selectedHour);
      const initialHourPosition = (hours.length + indexHour) * ITEM_HEIGHT;
      hoursScrollViewRef.current.scrollTo({ y: initialHourPosition, animated: false });
    }

    if (minutesScrollViewRef.current) {
      const indexMinute = minutes.indexOf(selectedMinute);
      const initialMinutePosition = (minutes.length + indexMinute) * ITEM_HEIGHT;
      minutesScrollViewRef.current.scrollTo({ y: initialMinutePosition, animated: false });
    }
  }, []);

  const handleScrollEndHour = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const totalHeight = hours.length * ITEM_HEIGHT;

    if (offsetY < totalHeight) {
      if (hoursScrollViewRef.current) {
        hoursScrollViewRef.current.scrollTo({ y: offsetY + totalHeight, animated: false });
      }
    } else if (offsetY >= totalHeight * 2) {
      if (hoursScrollViewRef.current) {
        hoursScrollViewRef.current.scrollTo({ y: offsetY - totalHeight, animated: false });
      }
    }

    const normalizedOffset = offsetY % totalHeight;
    const index = Math.round(normalizedOffset / ITEM_HEIGHT);
    setSelectedHour(hours[index]);
  };

  const handleScrollEndMinute = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const totalHeight = minutes.length * ITEM_HEIGHT;

    if (offsetY < totalHeight) {
      if (minutesScrollViewRef.current) {
        minutesScrollViewRef.current.scrollTo({ y: offsetY + totalHeight, animated: false });
      }
    } else if (offsetY >= totalHeight * 2) {
      if (minutesScrollViewRef.current) {
        minutesScrollViewRef.current.scrollTo({ y: offsetY - totalHeight, animated: false });
      }
    }

    const normalizedOffset = offsetY % totalHeight;
    const index = Math.round(normalizedOffset / ITEM_HEIGHT);
    setSelectedMinute(minutes[index]);
  };

  return (
    
    <View className="flex-1 h-full w-full absolute justify-center items-center bg-[rgba(0,0,0,0.5)]">
      <View className="bg-white rounded-lg w-[90%] p-5">
        {/* Botão de Fechar */}
        <TouchableOpacity
          className="right-2 z-10 w-8 h-8 items-center justify-center position absolute top-2"
          onPress={() => onClose('')}
        >
          <Text className="text-gray-500 font-[12] text-xl">✕</Text>
        </TouchableOpacity>
  
        <Text className="text-lg font-medium text-center mb-5 mt-1">Selecione o horário</Text>
  
        {/* Conteúdo do seletor de horas e minutos */}
        <View className="flex-row items-center justify-center mb-[16px]">
          <View className="h-[120px] w-[60px] overflow-hidden relative">
            <View className="absolute top-1/2 -translate-y-5 bg-[#C3FF00] rounded-full w-10 h-10 self-center z-[-1]"/>
            <ScrollView
              ref={hoursScrollViewRef}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              onMomentumScrollEnd={handleScrollEndHour}
              className="py-[50px]"
            >
              {infiniteHours.map((hour, index) => (
                <View
                  key={`hour-${index}`}
                  style={[
                    {
                      height: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                    hour === selectedHour && {
                      width: 40,
                      height: 40,
                      alignSelf: 'center',
                    },
                  ]}
                >
                  <Text
                    style={[
                      {
                        fontSize: 18,
                        textAlign: 'center',
                        color: hour === selectedHour ? 'white' : '#A9A9A9',
                        fontWeight: hour === selectedHour ? 'bold' : 'normal',
                      },
                    ]}
                  >
                    {hour}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          <Text className="text-[18px]">:</Text>

          <View className="h-[120px] w-[60px] overflow-hidden relative">
            <View className="absolute top-1/2 -translate-y-5 bg-[#C3FF00] rounded-full w-10 h-10 self-center z-[-1]"/>
            <ScrollView
              ref={minutesScrollViewRef}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              onMomentumScrollEnd={handleScrollEndMinute}
              className="py-[50px]"
            >
              {infiniteMinutes.map((minute, index) => (
                <View
                  key={`minute-${index}`}
                  style={[
                    {
                      height: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                    minute === selectedMinute && {
                      width: 40,
                      height: 40,
                      alignSelf: 'center',
                    },
                  ]}
                >
                  <Text
                    style={[
                      {
                        fontSize: 18,
                        textAlign: 'center',
                        color: minute === selectedMinute ? 'white' : '#A9A9A9',
                        fontWeight: minute === selectedMinute ? 'bold' : 'normal',
                      },
                    ]}
                  >
                    {minute}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
  
        <ButtonModal
          title="Selecionar horário"
          handlePress={() => onClose(`${selectedHour}:${selectedMinute}:00`)}
          customStyles="bg-[#ffcc00] w-full"
          textStyles="text-black "
        />
    </View>
    </View>
  );
};


export default TimePicker;