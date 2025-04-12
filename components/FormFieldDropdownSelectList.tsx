import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, ScrollView, VirtualizedList, DimensionValue } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from '../app/context/ThemeProvider';
import tailwindConfig from '../tailwind.config';

const colors = (tailwindConfig as any)?.theme?.colors as Record<string, string>;

interface FormFieldDropdownSelectList<T> {
    title: string
    selectedValue: T | null
    options: { nome: string, id : number, value: T }[]
    handleChange: (value: T) => void
    dropDownSize?: DimensionValue
    msg?: string
    isValid?: boolean
    otherStyles?: string
    disableEdit?: boolean
    isLoading?: boolean
  }




export default function FormFieldDropdownSelectList( {title, selectedValue, options, handleChange, msg, isValid, otherStyles, disableEdit, isLoading, dropDownSize }: FormFieldDropdownSelectList<any> ) {


  const [eventTypeOptionsVisible, setEventTypeOptionsVisible] = useState<boolean> (false)
  const { theme } = useTheme();


  return (
  <>
      {/* Event Type Filter */}
      <View className={`mb-[10] ${otherStyles} `}>
      <Text className={`text-[16px] mb-[2px] ${theme === 'dark' ? 'color-white' : ''}` }>{title}</Text>
      <TouchableOpacity 
            className='flex-row items-center border-[1px] border-[#ddd] rounded-[8] p-[10] mb-[6px]'
            
            onPress={() => setEventTypeOptionsVisible(prev => !prev)}
            disabled={disableEdit}
            >

          <Text className={`capitalize flex-1 ${theme === 'dark' ? 'color-white' : 'color-matte_gray'}`}>
          {selectedValue?.nome ? selectedValue.nome : 'Selecione uma opção'}
          
          </Text>
          {isLoading ? (
                  <ActivityIndicator 
                    size='small'
                    color='#0000ff'
                  />
                ): (
                  <Ionicons name="chevron-down" size={20} color={theme === 'dark' ? colors.white  : colors.matte_gray}/>
                )}
      </TouchableOpacity>
      {msg && (<Text className='text-sm text-color_red_error'>{msg}</Text>)}
      

        {/* Dropdown Menu */}
        {eventTypeOptionsVisible && (
          <ScrollView  className={`border-[1px] border-[#ddd] rounded-[8] shadow-[2px] ${theme === 'dark' ? 'bg-matte_gray' : 'bg-white '}`} style={{maxHeight: dropDownSize || '100%'}}>
                {options.map((item)=>(
                  <TouchableOpacity key={item.id}
                  onPress={() => {
                    handleChange(item.value)
                    setEventTypeOptionsVisible(false)
                  }}
                  className={`py-[10px] px-[8px] rounded-[6px] border-b-[1px] ${
                    theme === 'dark' ? 'border-gray-600 ' : 'border-gray-300'
                  } mb-[4px]`}
                  style={{ borderBottomColor: theme === 'dark' ? 'rgba(209, 213, 219, 0.1)' : 'rgba(209, 213, 219, 0.4)' }}>
                          <Text className={`capitalize md:uppercase ${theme === 'dark' ? 'color-white' : ''}`}>{item.nome}</Text>
                      </TouchableOpacity>
                    
                  ))}
          </ScrollView>
          )}
      </View>
    </>
  )
}



// {options.map((item)=>(
//   <TouchableOpacity 
//     onPress={() => {
//         handleChange(item.value)
//         setEventTypeOptionsVisible(false)
//       }}
//     className='p-10'
//     >
//       <Text>{item.nome}</Text>
//   </TouchableOpacity>

// ))}
