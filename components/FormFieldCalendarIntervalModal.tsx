import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';


interface MarkedDates {
  [date: string]: {
    selected?: boolean;
    marked?: boolean;
    starting?: boolean;
    ending?: boolean;
    color?: string;
  };
}



export default function FormFieldCalendarIntervalModal() {

    const [filterDateStart, setFilterDateStart] = useState('')
    const [filterDateEnd, setFilterDateEnd] = useState('')
    const [showCalendar, setShowCalendar] = useState(false)
    const [selectedStartDate, setSelectedStartDate] = useState('')
    const [selectedEndDate, setSelectedEndDate] = useState('')
    const [markedDates, setMarkedDates] = useState<MarkedDates>({})  


    const formatDisplayDate = (dateString: string) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
      };
    

        
    const handleDayPress = (day: any) => {
        if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
          // Iniciando nova seleção
          setSelectedStartDate(day.dateString);
          setSelectedEndDate('');
          setFilterDateStart(formatDisplayDate(day.dateString));
          setFilterDateEnd('');
            
          setMarkedDates({
            [day.dateString]: {
              selected: true,
              color: '#C3FF00'
            }
          });
        } else {
          // Selecionando data final
          if (day.dateString < selectedStartDate) {
            // Se a data final for menor que a inicial, inverte
            setSelectedEndDate(selectedStartDate);
            setSelectedStartDate(day.dateString);
            setFilterDateEnd(formatDisplayDate(selectedStartDate));
            setFilterDateStart(formatDisplayDate(day.dateString));
          } else {
            setSelectedEndDate(day.dateString);
            setFilterDateEnd(formatDisplayDate(day.dateString));
          }
    
          // Marcar o período inteiro
          const markedDatesObj: MarkedDates = {};
          let currentDate = new Date(Math.min(new Date(selectedStartDate).getTime(), new Date(day.dateString).getTime()));
          const endDate = new Date(Math.max(new Date(selectedStartDate).getTime(), new Date(day.dateString).getTime()));
    
          while (currentDate <= endDate) {
            const dateString = currentDate.toISOString().split('T')[0];
            if (dateString === selectedStartDate) {
              markedDatesObj[dateString] = {
                selected: true,
                color: '#C3FF00',
                starting: true
              };
            } else if (dateString === day.dateString) {
              markedDatesObj[dateString] = {
                selected: true,
                color: '#C3FF00',
                ending: true
              };
            } else {
              markedDatesObj[dateString] = {
                selected: true,
                color: '#E8FFB7'
              };
            }
            currentDate.setDate(currentDate.getDate() + 1);
          }
          setMarkedDates(markedDatesObj);
          
          // Fechar o calendário após selecionar o período completo
          setTimeout(() => setShowCalendar(false), 500);
        }
      };





  return (
    
              <View className='mb-[20px]'>
                <Text className='text-[16px] mb-[10px] '>Período</Text>
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    padding: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onPress={() => setShowCalendar(!showCalendar)}
                >
                  <Text style={{ color: '#555' }}>
                    {filterDateStart && filterDateEnd
                      ? `${filterDateStart} - ${filterDateEnd}`
                      : filterDateStart
                      ? `${filterDateStart} - Selecione a data final`
                      : 'Selecione o período'}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#555" />
                </TouchableOpacity>

                {showCalendar && (
                  <View style={{
                    marginTop: 10,
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    overflow: 'hidden'
                  }}>
                    <Calendar
                      minDate={new Date().toISOString().split('T')[0]}
                      markedDates={markedDates}
                      onDayPress={handleDayPress}
                      markingType="period"
                      theme={{
                        selectedDayBackgroundColor: '#C3FF00',
                        selectedDayTextColor: '#000000',
                        todayTextColor: '#C3FF00',
                        textDisabledColor: '#d9e1e8',
                        arrowColor: '#C3FF00',
                      }}
                    />
                  </View>
                )}
              </View>
    
  )
}