import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Appearance } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa o AsyncStorage
import tailwindConfig from '../tailwind.config';
import { useTheme } from '../app/context/ThemeProvider';

const colors = (tailwindConfig as any)?.theme?.colors as Record<string, string>;

const DarkMode: React.FC = () => {
  const { theme, setTheme } = useTheme();

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
  // Se não houver tema salvo, segue o tema do App
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
  }, []);
  
  return (
    <View
    style={{ position: 'absolute', zIndex: 8888, top: 50, left: 5 }}
    className="flex-row items-center justify-center"
  >
    <TouchableOpacity
      onPress={toggleTheme}
      className={`p-2 rounded-full ${theme === 'light' ? 'bg-primary_green' : 'bg-secondary_black'}`}
      style={styles.toggleButton}
    >
      {theme === 'light' ? (
        <Sun size={24} color={colors.black || '#000'} />
      ) : (
        <Moon size={24} color={colors.white || '#FFF'} />
      )}
    </TouchableOpacity>
  </View>
  );
};

const styles = StyleSheet.create({
  toggleButton: {
    shadowColor: colors.black || '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default DarkMode;