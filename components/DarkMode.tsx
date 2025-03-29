import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import tailwindConfig from '../tailwind.config';
import { useTheme } from '../app/context/ThemeProvider';

const colors = (tailwindConfig as any)?.theme?.colors as Record<string, string>;

const DarkMode: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <View style={{ position: 'absolute', zIndex: 8888, top: 50, left: 5 }}  className="flex-row items-center justify-center">
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