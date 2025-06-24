import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, VirtualizedList, DimensionValue, Appearance } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from "@expo/vector-icons";





interface FormFieldDropdownSelectList<T> {
    title: string
    selectedValue: T | null
    options: { nome: string, id : number, value: T }[]
    handleChange: (value: T) => void
    onFocus?: () => void
    dropDownSize?: DimensionValue
    msg?: string
    isValid?: boolean
    otherStyles?: string
    editable: boolean
    isLoading?: boolean
  }




export default function FormFieldDropdownSelectList( {title, selectedValue, options, handleChange, onFocus, msg, isValid, otherStyles, editable, isLoading, dropDownSize }: FormFieldDropdownSelectList<any> ) {

  const [eventTypeOptionsVisible, setEventTypeOptionsVisible] = useState<boolean> (false)
  const theme = Appearance.getColorScheme()

  return (
    <>
        {/* Event Type Filter */}
        <View className={`mb-[10] ${otherStyles} `}>
        <Text className={`text-[16px] ${theme==='light'?'text-matte_gray':'text-white'} mb-[5px]`}>{title}</Text>
        <TouchableOpacity 
              className={`flex-row items-center border-[1px] border-[#ddd] rounded-[8] p-[10] mb-[6px] ${editable? theme==='light'?'bg-white':'bg-secondary_black' : 'bg-color_lightGray'}`}
              onPress={() => {setEventTypeOptionsVisible(prev => !prev)}}
              onPressIn={onFocus}
              disabled={!editable}
              >
  
            <Text className={`capitalize flex-1 ${editable? theme==='light'?'text-matte_gray':'text-white':'black'} `}>
            {selectedValue?.nome ? selectedValue.nome : 'Selecione uma opção'}
            
            </Text>
            {isLoading ? (
                    <ActivityIndicator 
                      size='small'
                      color='#0000ff'
                    />
                  ): (
                    <Ionicons name={editable? "chevron-down":"ribbon-outline"} size={20} color={editable? theme==='light'?'#555':'#FFF':'black'} />
                  )}
        </TouchableOpacity>
        {msg && (<Text className='text-color_red_error'>{msg}</Text>)}
        
  
          {/* Dropdown Menu */}
          {eventTypeOptionsVisible && (
            <ScrollView
            className={`border-[1px] border-color_light_gray rounded-[8] shadow-[2px] ${theme==='light'?'bg-white':'bg-matte_gray'} `}
            style={{ maxHeight: dropDownSize || '100%' }}
          >
            {options.map((item, index) => (
              <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                      handleChange(item.value);
                      setEventTypeOptionsVisible(false);
                    }}
                    className={`py-[15px] px-[10px] rounded-[6px] mb-[4px] ${
                      index !== options.length - 1 ? 'border-b-[1px] border-color_light_gray' : ''
                    }`}
                  >
                    <Text className={`capitalize md:uppercase ${theme==='light'?'':'text-white'}`}>{item.nome}</Text>
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
