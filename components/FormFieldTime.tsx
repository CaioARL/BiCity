import RNDateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import React from 'react'
import { TouchableOpacity, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';




interface FormFieldDateTimePickerProps {
    value: string
    handleChangeValue: (e : string) => void
    disabled?: boolean
}



export default function FormFieldTime(  { value, handleChangeValue, disabled}: FormFieldDateTimePickerProps) {

    const [showDateTimePicker, setShowDateTimePicker] = React.useState(false)

    const formatTime = (date: Date) => {
        return moment(date).format('THH:mm:ss.SS')
      }
      
  return (
    <>
    <View className='mb-[20px]'>
    <TouchableOpacity  
        className='border-[1px] border-[#ddd] rounded-[8px] p-[10px] flex-row items-center justify-between' 
        disabled={disabled}
        onPress={() => setShowDateTimePicker(!showDateTimePicker )}
        >
        <Text className='text-[#555] ml-[10px]'>
        {value || 'Selecione a data do evento'}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#555" />
    </TouchableOpacity>

    {showDateTimePicker && (
        <RNDateTimePicker
        testID="dateTimePicker"
        value={new Date()}
        mode="time"
        display="default"
        onChange={(event, selectedDate) => {
            const currentDate = selectedDate || new Date()
            handleChangeValue(formatTime(currentDate))
            setShowDateTimePicker(false)
            
        }}
        >
  
      </RNDateTimePicker>
    )}

    </View>
</>





)



}
