import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, ScrollView, VirtualizedList, DimensionValue } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from "@expo/vector-icons";





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


  return (
    <>
        {/* Event Type Filter */}
        <View className={`mb-[10] ${otherStyles} `}>
        <Text className={`className='text-[16px] text-matte_gray mb-[5px]` }>{title}</Text>
        <TouchableOpacity 
              className='flex-row items-center border-[1px] border-[#ddd] rounded-[8] p-[10] mb-[6px]'
              
              onPress={() => setEventTypeOptionsVisible(prev => !prev)}
              disabled={disableEdit}
              >
  
            <Text className={`capitalize flex-1 `}>
            {selectedValue?.nome ? selectedValue.nome : 'Selecione uma opção'}
            
            </Text>
            {isLoading ? (
                    <ActivityIndicator 
                      size='small'
                      color='#0000ff'
                    />
                  ): (
                    <Ionicons name="chevron-down" size={20} color="#555" />
                  )}
        </TouchableOpacity>
        {msg && (<Text className='text-sm text-color_red_error'>{msg}</Text>)}
        
  
          {/* Dropdown Menu */}
          {eventTypeOptionsVisible && (
            <ScrollView  className={`border-[1px] border-color_light_gray rounded-[8] shadow-[2px]`} style={{maxHeight: dropDownSize || '100%'}}>
                  {options.map((item)=>(
                    <TouchableOpacity key={item.id}
                    onPress={() => {
                      handleChange(item.value)
                      setEventTypeOptionsVisible(false)
                    }}
                    className={`py-[15px] px-[10px] border-color_light_gray rounded-[6px] border-b-[1px] mb-[4px]`}
                    >
                            <Text className={`capitalize md:uppercase `}>{item.nome}</Text>
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
