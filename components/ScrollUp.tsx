import React from 'react'
import { TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface ScrollUpProps {
  hide: boolean
  onClick: () => void
}

export default function ScrollUp({ hide, onClick }: ScrollUpProps) {

  return (
    <TouchableOpacity className='absolute  w-[60px] h-[60px] bg-primary_green rounded-full justify-center items-center drop-shadow-md right-[10px]'
      onPress={onClick}
      style={[
        styles.button,
        { display: hide ? 'flex' : 'none' },
      ]}
    >
      <Ionicons name="chevron-up" size={24} color="#333" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    bottom: 50,
  }
})
