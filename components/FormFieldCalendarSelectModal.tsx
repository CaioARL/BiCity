import { View, Text, TouchableOpacity, Appearance } from 'react-native'
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
    const today = new Date().toISOString().split('T')[0] // Get today's date in YYYY-MM-DD format
    const theme = Appearance.getColorScheme()

  return (
    <View className='mb-[20px] mt-5'>
        <TouchableOpacity  
            className={`border-[1px] border-[#ddd] rounded-[8px] p-[10px] flex-row items-center justify-between ${theme==='light'?'bg-white':'bg-secondary_black'}`} 
            disabled={disabled}
            onPress={() => setShowCalendar(!showCalendar )}
            onPressIn={onFocus}
        >
            <Text className={`${theme==='light'?'text-secondary_black':'text-white'} ml-[10px]`}>
            {value.split('-').reverse().join('/') || 'Selecione a data do evento'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color={theme==='light'?'#555':'#FFF'} />
        </TouchableOpacity>
        {msg && <Text className='text-color_red_error' >*{msg}</Text>}


        {showCalendar && (
            <View className='mt-[10px] border-[1px] border-[#ddd] rounded-[8px] overflow-hidden'>
            <Calendar
                minDate={today}
                monthFormat='MMM yyyy'
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
                    backgroundColor: theme === 'dark' ? '#555' : '#FFF',
                    calendarBackground: theme === 'dark' ? '#555' : '#FFF',
                    textSectionTitleColor: theme === 'dark' ? '#FFF' : '#000',
                    dayTextColor: theme === 'dark' ? '#FFF' : '#000',
                    todayTextColor: theme === 'dark' ? '#C3FF00' : '#C3FF00',
                    selectedDayBackgroundColor: theme === 'dark' ? '#C3FF00' : '#C3FF00',
                    selectedDayTextColor: theme === 'dark' ? '#FFF' : '#000',
                    monthTextColor: theme === 'dark' ? '#FFF' : '#000',
                    arrowColor: theme === 'dark' ? '#C3FF00' : '#C3FF00',
                    textDisabledColor: theme === 'dark' ? '#D1D5DB' : '#D1D5DB',
                }}
            />
            </View>
        )}

    </View>

  )
}