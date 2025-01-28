import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, ScrollView, VirtualizedList } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';





interface FormFieldDropdownSelectList<T> {
    title: string
    selectedValue: T
    options: { nome: string, id : number, value: T }[]
    handleChange: (value: T) => void
    dropDownSize?: number
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
      <Text  className='text-[16px] mb-[2px] color-[#555]' >{title}</Text>
      <TouchableOpacity 
            className='flex-row items-center border-[1px] border-[#ddd] rounded-[8] p-[10] mb-[6px]'
            onPress={() => !disableEdit && setEventTypeOptionsVisible(true)}
            >

          <Text className='color-[#555] flex-1'>
          {options.find(option => option.value === selectedValue)?.nome || 'Select an option'}
          
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
          <ScrollView className={`h-[${dropDownSize? dropDownSize : '50%'}]`}>
                {options.map((item)=>(
                  <TouchableOpacity key={item.id}
                  onPress={() => {
                    handleChange(item.value)
                    setEventTypeOptionsVisible(false)
                  }}
                  className='py-[10px] px-[3px] border-[1px] border-[#525252] mb-[4px] rounded-[8px]'
                  >
                          <Text>{item.nome}</Text>
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
