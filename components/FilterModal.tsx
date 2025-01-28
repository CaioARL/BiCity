import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import FormFieldDropdownSelectList from './FormFieldDropdownSelectList';
import { ListTipoEvento, TipoEvento } from '../types';
import { getTipoEvento } from '../api/tipo-evento';
import { set } from 'zod';



interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  showEventTypeOptions: boolean;
  setShowEventTypeOptions: (show: boolean) => void;
}

interface MarkedDates {
  [date: string]: {
    selected?: boolean;
    marked?: boolean;
    starting?: boolean;
    ending?: boolean;
    color?: string;
  };
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  showEventTypeOptions,
  setShowEventTypeOptions,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Valor inicial da animação
  const [filterDistance, setFilterDistance] = useState(10)
  const [filterDateStart, setFilterDateStart] = useState('')
  const [filterDateEnd, setFilterDateEnd] = useState('')
  const [filterEventType, setFilterEventType] = useState('all')
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedStartDate, setSelectedStartDate] = useState('')
  const [selectedEndDate, setSelectedEndDate] = useState('')
  const [markedDates, setMarkedDates] = useState<MarkedDates>({})

  const [listTipoEvento, setListTipoEvento] = useState<ListTipoEvento[]>([])
  const [filterTipoEvento, setFilterTipoEvento] = useState<TipoEvento>()
  const [isLoadingTipoEvento, setIsLoadingTipoEvento] = useState(false)


  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500, // Duração da animação
        useNativeDriver: true,
      }).start();
    } else {
      // Iniciar a animação de fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);


   
  
  
  useEffect(() => {
    setIsLoadingTipoEvento(true)
      getTipoEvento()
      .then((response) => {
        setListTipoEvento([])
        response.map((tipoEvento)=>{
          setListTipoEvento((prevList) => {
            return [
              ...prevList,
              {
                nome: tipoEvento.nome,
                id: tipoEvento.id,
                value: tipoEvento
              }
            ]
          })
        })
      })
      .catch((response)=>{
        alert('Error ao carregar Tipos de Eventos, verifique sua conexão. \nCode error:' + response.message)
      }).finally(()=>{
        setIsLoadingTipoEvento(false)
      })
    },[])
  
  
  
  
  
  
  
  
  
  
  
  
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
    
    
    <Modal visible={visible}animationType="slide"transparent={true} onRequestClose={onClose}>
    

      <Animated.View style={{ height: '100%', opacity: fadeAnim, }}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, minHeight: '50%' }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 20
              }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Filtros</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color="#555" />
                </TouchableOpacity>
              </View>

              {/* Event Type Filter */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, marginBottom: 10 }}>Tipo de Evento</Text>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    padding: 10,
                  }}
                  onPress={() => setShowEventTypeOptions(!showEventTypeOptions)}
                >
                  <Text style={{ color: '#555', flex: 1 }}>
                    {filterEventType === 'all' ? 'Todos' : filterEventType === 'paid' ? 'Pago' : 'Gratuito'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#555" />
                </TouchableOpacity>

                {/* Dropdown Menu */}
                {showEventTypeOptions && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 70,
                      left: 0,
                      right: 0,
                      borderWidth: 1,
                      borderColor: '#ddd',
                      borderRadius: 8,
                      marginTop: 10,
                      padding: 10,
                      backgroundColor: 'white',
                      zIndex: 10,
                    }}
                  >
                    {['all', 'paid', 'free'].map((type) => (
                      <TouchableOpacity key={type}
                        onPress={() => {
                          setFilterEventType(type);
                          setShowEventTypeOptions(false);
                        }}
                        style={{ padding: 10 }}
                      >
                        <Text style={{ color: '#555', textTransform: 'capitalize' }}>
                          {type === 'all' ? 'Todos' : type === 'paid' ? 'Pago' : 'Gratuito'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

                  <FormFieldDropdownSelectList
                    options={listTipoEvento}
                    handleChange={setFilterTipoEvento}
                    title='Tipo de Evento'
                    selectedValue={filterTipoEvento}
                    isLoading={isLoadingTipoEvento}
                  />


              {/* Date Range Filter */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, marginBottom: 10 }}>Período</Text>
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

              {/* Distance Slider */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, marginBottom: 10 }}>
                  Distância: {filterDistance}km
                </Text>
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={1}
                  maximumValue={100}
                  value={filterDistance}
                  onValueChange={setFilterDistance}
                  minimumTrackTintColor="#C3FF00"
                  maximumTrackTintColor="#ddd"
                  thumbTintColor="#C3FF00"
                />
              </View>

              {/* Apply Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: '#C3FF00',
                  padding: 15,
                  borderRadius: 8,
                  alignItems: 'center'
                }}
                onPress={onClose}
              >
                <Text style={{ fontWeight: 'bold' }}>Aplicar Filtros</Text>
              </TouchableOpacity>
              
          </View>
        </View>
        </Animated.View>
     

    </Modal>
  );
};

export default FilterModal;