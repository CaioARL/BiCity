import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Calendar } from 'react-native-calendars'
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../app/context/ThemeProvider';
import tailwindConfig from '../tailwind.config';

const colors = (tailwindConfig as any)?.theme?.colors as Record<string, string>;

interface FormFieldCalendarSelectModalProps {
    value: string
    handleChangeValue: (e : string) => void
    disabled?: boolean
}



export default function FormFieldCalendarSelectModal({ value, handleChangeValue, disabled}: FormFieldCalendarSelectModalProps) {

    const [showCalendar, setShowCalendar] = useState(false)
    const { theme } = useTheme();

  return (
    <View className='mb-[20px]'>
        <TouchableOpacity  
            className='border-[1px] border-[#ddd] rounded-[8px] p-[10px] flex-row items-center justify-between' 
            disabled={disabled}
            onPress={() => setShowCalendar(!showCalendar )}
        >
            <Text className={` ml-[10px] ${theme === 'dark' ? 'color-white' : 'color-matte_gray'}`}>
            {value || 'Selecione a data do evento'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color={theme === 'dark' ? colors.white  : colors.matte_gray}  />
        </TouchableOpacity>

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