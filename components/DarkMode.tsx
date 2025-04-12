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
  const [isDragging, setIsDragging] = useState(false);
  
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
      onMoveShouldSetPanResponder: (_, gestureState) => {
    
        const { dx, dy } = gestureState;
        return Math.abs(dx) > 2 || Math.abs(dy) > 2;
      },
      onPanResponderGrant: () => {
        setIsDragging(true);
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
        pan.flattenOffset();
        
        const currentX = (pan.x as any)._value || 0;
        const currentY = (pan.y as any)._value || 0;
        
        const newX = Math.max(0, Math.min(currentX, width - 60));
        const newY = Math.max(0, Math.min(currentY, height - 60));
        
        pan.setValue({ x: newX, y: newY });
        setPosition({ x: newX, y: newY });
        savePosition(newX, newY);
        
        setTimeout(() => setIsDragging(false), 100);
      },
    })
  ).current;

  // Função para salvar o tema no AsyncStorage "Cache"
  const saveThemeToStorage = async (newTheme: 'light' | 'dark') => {
    try {
      await AsyncStorage.setItem('userTheme', newTheme);
      console.log('Tema salvo:', newTheme); // Debug
    } catch (error) {
      console.error('Erro ao salvar o tema:', error);
    }
  };

  // Função para carregar o tema do AsyncStorage ou usar o tema do sistema como fallback
  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('userTheme');
      if (savedTheme) {
        console.log('Tema carregado do storage:', savedTheme); 
        setTheme(savedTheme as 'light' | 'dark');
      } else {
        const systemTheme = Appearance.getColorScheme();
        console.log('Usando tema do sistema:', systemTheme); 
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
          console.log('Alterando para tema do sistema:', colorScheme); // Debug
          setTheme(colorScheme === 'dark' ? 'dark' : 'light');
        }
      });
    });
    return () => subscription.remove();
  }, [setTheme]);

  const toggleTheme = () => {
    if (isDragging) return; // Não alternar o tema se estiver arrastando
    
    const newTheme = theme === 'light' ? 'dark' : 'light';
    console.log('Alternando tema para:', newTheme); // Debug
    setTheme(newTheme);
    saveThemeToStorage(newTheme);
  };

  useEffect(() => {
    loadTheme();
    loadPosition();
  }, []);

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
        onPress={toggleTheme}
        className={`p-2 rounded-full ${theme === 'light' ? 'bg-primary_green' : 'bg-secondary_black'}`}
        style={styles.toggleButton}
        activeOpacity={0.7}
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