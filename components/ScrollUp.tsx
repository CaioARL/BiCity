import React from 'react';
import { TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ScrollUpProps {
  scrollY: number;
  flatListRef: React.RefObject<FlatList>;
  threshold?: number; 
}

export default function ScrollUp({ scrollY, flatListRef, threshold = 100 }: ScrollUpProps) {
  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  return (
    <TouchableOpacity className='absolute  w-[60px] h-[60px] bg-primary_green rounded-full justify-center items-center drop-shadow-md right-[10px]'
      onPress={scrollToTop}
      style={[
        styles.button,
        { display: scrollY > threshold ? 'flex' : 'none' },
      ]}
    >
      <Ionicons name="chevron-up" size={24} color="#333" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    bottom: 50,
  }
});
