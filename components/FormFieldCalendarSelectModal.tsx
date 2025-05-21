import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Calendar } from 'react-native-calendars'
import { Ionicons } from '@expo/vector-icons';



interface FormFieldCalendarSelectModalProps {
    value: string
    handleChangeValue: (e : string) => void
    disabled?: boolean
    msg: string
    onFocus?: () => void
}



export default function FormFieldCalendarSelectModal({ value, handleChangeValue,onFocus, msg, disabled}: FormFieldCalendarSelectModalProps) {

    const [showCalendar, setShowCalendar] = useState(false)


  return (
    <View className='mb-[20px] mt-5'>
        <TouchableOpacity  
            className='border-[1px] border-[#ddd] rounded-[8px] p-[10px] flex-row items-center justify-between' 
            disabled={disabled}
            onPress={() => setShowCalendar(!showCalendar )}
            onPressIn={onFocus}
        >
            <Text className='text-[#555] ml-[10px]'>
            {value.split('-').reverse().join('/') || 'Selecione a data do evento'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#555" />
        </TouchableOpacity>
        {msg && <Text className='text-color_red_error' >*{msg}</Text>}


        {showCalendar && (
            <View className='mt-[10px] border-[1px] border-[#ddd] rounded-[8px] overflow-hidden'>
            <Calendar
                minDate={new Date().toISOString().split('T')[0]}
                markedDates={
                value
                    ? {
                        [value]: {
                        selected: true,
                        selectedColor: '#C3FF00',
                        selectedTextColor: '#000',
                        },
                    }: {}
                }
                onDayPress={
                    (e : any)=> {
                        handleChangeValue(e.dateString)
                        setShowCalendar(false)
                    }
                }
                theme={{
                    selectedDayBackgroundColor: '#C3FF00',
                    todayTextColor: '#C3FF00',
                    arrowColor: '#C3FF00',
                }}
            />
            </View>
        )}

    </View>

  )
}