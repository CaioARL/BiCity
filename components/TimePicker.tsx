import React, { useState } from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'


interface TimePickerProps {
  onClose: (time: string) => void
}

export default function TimePicker ({ onClose } : TimePickerProps) {
  const [hour, setHour] = useState(23)
  const [minute, setMinute] = useState<number>(0)
  
  const hours : number[] = [23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0]
  const minutes : number[] = [0,10,20,30,40,50]

  const handleScroll = (
    index: number,
    type: 'hour' | 'minute' | 'second'
  ) => {
    if (type === 'hour') setHour(hours[index])
    if (type === 'minute') setMinute(minutes[index])

  }

  const renderItem = (item: number | string, index: number, selected: number, type: string) => (
    <Text style={[styles.item, 
        type === 'hour' ? hours[index] === selected && styles.selectedItem
        :
        type === 'minute' ? minutes[index] === selected && styles.selectedItem
        : null
        ]
    }>
      {item.toString().padStart(2, '0')}
    </Text>
  )

  return (
    <>
      <View className='w-full flex-row justify-around'>
          <Text>hora</Text>
          <Text>minuto</Text>
      </View>
      <View className='w-full flex-row items-center justify-center h-[50px]'>
      
        <FlatList
          className='w-[50%]'
          data={hours}
          keyExtractor={(item) => item.toString()}
          horizontal={false}
          showsVerticalScrollIndicator={false}
          snapToInterval={50}
          snapToAlignment='center'
          decelerationRate="fast"
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.y / 50)
            handleScroll(index, 'hour')
          }}
          renderItem={({ item, index }) => renderItem(item, index, hour, 'hour')}
        />
        <Text className='text-5xl'>:</Text>

        <FlatList
          className='w-[50%]'  
          data={minutes}
          keyExtractor={(item) => item.toString()}
          horizontal={false}
          showsVerticalScrollIndicator={false}
          snapToInterval={50}
          snapToAlignment='center'
          decelerationRate="fast"
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.y / 50)
            handleScroll(index, 'minute')
          }}
          renderItem={({ item, index }) => renderItem(item, index, minute, 'minute')}
        />

      </View>
      <TouchableOpacity
          onPress={()=> onClose(`${hour}:${minute.toString().padStart(2, '0')}:00`) }
          className='bg-[#C3FF00] p-[10px] rounded-[8px] mt-[20px]'
      >
          <Text className='text-[#000] text-center font-bold'>Selecionar</Text>
      </TouchableOpacity>
      
    </>

  )
}

const styles = StyleSheet.create({
  item: {
    fontSize: 20,
    color: '#888',
    textAlign: 'center',
    height: 50,
    lineHeight: 50,
  },
  selectedItem: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
})