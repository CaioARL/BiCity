import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Animated, ScrollView, Button } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import FormFieldDropdownSelectList from './FormFieldDropdownSelectList';
import { ListTipoEvento, RequestPageEvento, TipoEvento } from '../types';
import { getTipoEvento } from '../api/tipo-evento';
import FormFieldCalendarSelectModal from './FormFieldCalendarSelectModal';
import ButtonModal from './ButtonModal';



interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  setFilterEntity: (filterTipoEvento: TipoEvento, filterDistance: number | null, data: string | null ) => void;
}



const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  setFilterEntity,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Valor inicial da animação
  const [filterDistance, setFilterDistance] = useState(0)

  

  const [listTipoEvento, setListTipoEvento] = useState<ListTipoEvento[]>([])
  const [filterTipoEvento, setFilterTipoEvento] = useState<TipoEvento>({id: 0, nome: '', nivelHabilidade: {id: 0, nome: '', descricao: ''}})
  const [isLoadingTipoEvento, setIsLoadingTipoEvento] = useState(false)
  
  const [filterData, setFilterData]= useState<string>('')
 

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
  
  
  
    const cleanFilters = () => {
      setFilterDistance(0)
      setFilterTipoEvento({id: 0, nome: '', nivelHabilidade: {id: 0, nome: '', descricao: ''}})
      setFilterData('')
    }
  
  
  
  
  
    const handleApplyFilters = () => {
      setFilterEntity(
        filterTipoEvento,
        filterDistance !== 0 ? filterDistance : null, 
        filterData !== '' ? filterData : null
      )
      onClose()
    }
  
  
 
  
  

  
  
  
  






  return (
    
    
    <Modal visible={visible}animationType="slide"transparent={true} onRequestClose={onClose}>
    

      <Animated.View style={{ height: '100%', opacity: fadeAnim, }}>

        <View className='flex-[1] justify-end bg-[rgba(0,0,0,0.5)] '>
            <View className='bg-white rounded-t-3xl min-h-[50%] p-[20px] '>
              <View className='flex-row justify-between mb-[20px]'>
                <Text className='text-[18px] font-bold' >Filtros</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color="#555" />
                </TouchableOpacity>
              </View>

              
              <FormFieldDropdownSelectList
                options={listTipoEvento}
                handleChange={setFilterTipoEvento}
                title='Tipo de Evento'
                selectedValue={filterTipoEvento}
                isLoading={isLoadingTipoEvento}
                dropDownSize={200}
              />



              {/* Distance Slider */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, marginBottom: 10 }}>
                  Distância: {filterDistance}km
                </Text>
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={0}
                  step={1}
                  maximumValue={200}
                  onValueChange={setFilterDistance}
                  minimumTrackTintColor="#C3FF00"
                  maximumTrackTintColor="#ddd"
                  thumbTintColor="#C3FF00"
                />
              </View>


              <FormFieldCalendarSelectModal
                handleChangeValue={setFilterData}
                value={filterData}
              />



              <ButtonModal
                handlePress={handleApplyFilters}
                title='Aplicar Filtros'
                customStyles='w-full items-center'
                textStyles='font-bold'
              />

              <ButtonModal
                handlePress={cleanFilters}
                title='Limpar Filtros'
                textStyles='font-bold text-center'
                customStyles='w-full mt-[20px]'
                customColor='#fff'
              />

              
          </View>
        </View>
        </Animated.View>
     

    </Modal>
  );
};

export default FilterModal;