import React, { useRef, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import NumberSelection from './NumberSelection'


interface TimePickerProps {
  onClose: (time: string) => void
}

export default function TimePicker ({ onClose } : TimePickerProps) {
  const [hour, setHour] = useState<string>('00')
  const [minute, setMinute] = useState<string>('00')
  const [listSelector, setListSelector] = useState<string[] | null>(null)
  const triggerRef = useRef<'minute' | 'hour' | ''>('')

  return (
    <>
    <View  className='absolute flex-row items-center h-full w-full bg-[rgba(0,0,0,0.5)]'>
      <View className='bg-white left-[5%] h-fit w-[90%] rounded-lg p-5'>

        <View className='flex-row items-center justify-end'>
          <TouchableOpacity
              className="w-8 h-8 items-center justify-center"
              onPress={() => onClose('')}
            >
              <Text className="text-gray-500 font-[12] text-xl">✕</Text>
          </TouchableOpacity>
        </View>

        <View className='w-full flex-row justify-center'>
            <Text className='w-[48%] text-center'>hora</Text>
            <Text className='w-[48%] text-center'>minuto</Text>
        </View>

        <View className='flex-row items-end h-[70px]'> 
          <View className='rounded-full bg-primary_green '>
            <View className='flex-row w-full items-center justify-center h-[50px]'>
              <TouchableOpacity className='w-[48%] h-full items-center justify-center border-r-[1px] ' onPress={() => {
                setListSelector(Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')))
                triggerRef.current = 'hour'
              }}>
                <Text className=' color-[#000] font-bold text-[24px] ' >{hour}</Text>
              </TouchableOpacity>
              <TouchableOpacity className='w-[48%] h-full items-center justify-center' onPress={() => {
                setListSelector(Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0')))
                triggerRef.current = 'minute'
              }}>
                <Text className='color-[#000] font-bold text-[24px]'>{minute}</Text>
              </TouchableOpacity>
            </View>
           
          </View>

          
        </View>
        <Text className='text-base text-center'>Clique para selecionar</Text>

          <TouchableOpacity
              onPress={()=> onClose(`${hour}:${minute}:00`) }
              className='bg-[#C3FF00] p-[10px] rounded-[8px] mt-5'
          >
              <Text className='text-[#000] text-center font-bold'>Selecionar Horário</Text>
          </TouchableOpacity>

      </View>
    </View>
    {listSelector && (
      <NumberSelection
        onClose={(selected)=>{
          if (triggerRef.current === 'hour') {
            setHour(selected)
          } else if (triggerRef.current === 'minute') {
            setMinute(selected)
          }
          setListSelector(null)
        }}
        numbers={listSelector}
      />
    )}
    </>
  )
}