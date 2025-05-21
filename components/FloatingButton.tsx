import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Easing, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FloatingButton({ }) {
  const [isOpen, setIsOpen] = useState(false);
  const mainButtonRotation = React.useRef(new Animated.Value(0)).current;
  const firstButtonAnim = React.useRef(new Animated.Value(0)).current;
  const secondButtonAnim = React.useRef(new Animated.Value(0)).current;
  const tertiaryButtonAnim = React.useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    Animated.parallel([
      Animated.timing(mainButtonRotation, {
        toValue,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(firstButtonAnim, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(secondButtonAnim, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
        Animated.timing(tertiaryButtonAnim, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    setIsOpen(!isOpen);
  };

  const rotateMainButton = mainButtonRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const translateYFirstButton = firstButtonAnim.interpolate({
    inputRange: [0, 1],
        outputRange: [0, -190],
  });

  const translateYSecondButton = secondButtonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -130],
  });

   const translateYTertiaryButton = tertiaryButtonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -70],
  });


  const opacityAnim = firstButtonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <>
      <Animated.View style={[ styles.button, { transform: [{ translateY: translateYFirstButton }], opacity: opacityAnim, }, ]}>
        <TouchableOpacity className='d-flex flex-row items-center justify-center w-full h-16 rounded-[12px] bg-primary_green shadow-secondary_black_sub_title showOpacity elevation-5'
        >
          <View className="bg-white rounded-full  p-1 mr-2">
            <Ionicons name="pause-outline" size={24} color="rgba(30, 247, 10, 1)" />
          </View>
          <Text>Via Bom</Text>
        
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[ styles.button, { transform: [{ translateY: translateYSecondButton }], opacity: opacityAnim, }, ]}>
          <TouchableOpacity className='d-flex flex-row items-center justify-center w-full h-16 rounded-[12px] bg-primary_green shadow-secondary_black_sub_title showOpacity  elevation-5'
           >
            <View className="bg-white rounded-full p-1 mr-2">
              <Ionicons name="pause-outline" size={24} color="rgba(240, 236, 34, 1)" />
             </View>
            <Text>Via Reg.</Text>
          </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[ styles.button, { transform: [{ translateY: translateYTertiaryButton }], opacity: opacityAnim, }, ]}>
          <TouchableOpacity className='d-flex flex-row items-center justify-center w-full h-16 border-[30] bg-primary_green shadow-secondary_black_sub_title showOpacity rounded-3xl elevation-5'
          >
            <View className="bg-white rounded-full  p-1 mr-2">  
              <Ionicons name="pause-outline" size={24} color="rgba(255, 64, 0, 1)" />
            </View>
            <Text>Via Ruim</Text>
          
          </TouchableOpacity>
      </Animated.View>
    
      <Animated.View style={[ styles.button, { transform: [{ rotate: rotateMainButton }], }, ]}>
        <TouchableOpacity style={styles.innerButton} onPress={toggleMenu}>
          <Ionicons name="add" size={24} color="#333" />
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: '18%',
    right: 10,
    width: 110,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  innerButton: {
    display: 'flex',
    flexDirection: 'row',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#C3FF00',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});