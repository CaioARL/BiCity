import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Appearance, Animated, PanResponder, Dimensions, GestureResponderEvent, PanResponderGestureState } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tailwindConfig from '../tailwind.config';
import { useTheme } from '../app/context/ThemeProvider';

const colors = (tailwindConfig as any)?.theme?.colors as Record<string, string>;
const { width, height } = Dimensions.get('window');

const DarkMode: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [position, setPosition] = useState({ x: 20, y: 50 });
  
  const pan = useRef(new Animated.ValueXY({ x: position.x, y: position.y })).current;

  const savePosition = async (x: number, y: number) => {
    try {
      await AsyncStorage.setItem('buttonPosition', JSON.stringify({ x, y }));
    } catch (error) {
      console.error('Error saving button position:', error);
    }
  };

  const loadPosition = async () => {
    try {
      const savedPosition = await AsyncStorage.getItem('buttonPosition');
      if (savedPosition) {
        const { x, y } = JSON.parse(savedPosition);
        setPosition({ x, y });
        pan.setValue({ x, y });
      }
    } catch (error) {
      console.error('Error loading button position:', error);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        const { x, y } = pan.getLayout();
        
        const currentX = (pan.x as any)._value || 0;
        const currentY = (pan.y as any)._value || 0;
        
        pan.setOffset({
          x: currentX,
          y: currentY
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gestureState: PanResponderGestureState) => {
        // When releasing the drag, save the current position
        pan.flattenOffset();
        
        // Get current position values in TypeScript-safe way
        const currentX = (pan.x as any)._value || 0;
        const currentY = (pan.y as any)._value || 0;
        
        // Constrain to screen boundaries
        const newX = Math.max(0, Math.min(currentX, width - 60));
        const newY = Math.max(0, Math.min(currentY, height - 60));
        
        pan.setValue({ x: newX, y: newY });
        setPosition({ x: newX, y: newY });
        savePosition(newX, newY);
      },
    })
  ).current;

  // Função para salvar o tema no AsyncStorage "Cache"
  const saveThemeToStorage = async (newTheme: 'light' | 'dark') => {
    try {
      await AsyncStorage.setItem('userTheme', newTheme);
    } catch (error) {
      console.error('Erro ao salvar o tema:', error);
    }
  };

  // Função para carregar o tema do AsyncStorage ou usar o tema do sistema como fallback
  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('userTheme');
      if (savedTheme) {
        setTheme(savedTheme as 'light' | 'dark');
      } else {
        const systemTheme = Appearance.getColorScheme();
        setTheme(systemTheme === 'dark' ? 'dark' : 'light');
      }
    } catch (error) {
      console.error('Erro ao carregar o tema:', error);
      const systemTheme = Appearance.getColorScheme();
      setTheme(systemTheme === 'dark' ? 'dark' : 'light');
    }
  };

  // Detecta mudanças no tema do sistema e atualiza apenas se não houver preferência salva
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      AsyncStorage.getItem('userTheme').then((savedTheme) => {
        if (!savedTheme) {
          setTheme(colorScheme === 'dark' ? 'dark' : 'light');
        }
      });
    });
    return () => subscription.remove();
  }, [setTheme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    saveThemeToStorage(newTheme);
  };

  useEffect(() => {
    loadTheme();
    loadPosition();
  }, []);

  const handleTouchablePress = (e: GestureResponderEvent) => {
    e.stopPropagation();
    toggleTheme();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }]
        }
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        onPress={handleTouchablePress}
        className={`p-2 rounded-full ${theme === 'light' ? 'bg-primary_green' : 'bg-secondary_black'}`}
        style={styles.toggleButton}
      >
        {theme === 'light' ? (
          <Sun size={24} color={colors.black || '#000'} />
        ) : (
          <Moon size={24} color={colors.white || '#FFF'} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 8888,
    left: 20,
    top: 50,
  },
  toggleButton: {
    shadowColor: colors.black || '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default DarkMode;