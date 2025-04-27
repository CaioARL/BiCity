import React from 'react'
import { Problema } from '../types'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import CustomButton from './CustomButton'
import ButtonModal from './ButtonModal'
import { Ionicons } from "@expo/vector-icons";
import { useState } from 'react'

interface PinProblemaViewProps {
    problema: Problema
    onClose: () => void
}




export default function PinProblemaView( { problema , onClose} : PinProblemaViewProps) {
  return (
     <View className="p-[30px] obsolute bg-white rounded-lg shadow-md h-[80%] w-[94%] top-[3%] left-[3%] absolute justify-start">

        <Text className='flex-col text-lg font-bold text-center mb-10'>Problema da Ciclovia</Text>
       
        <View key={problema.id} className="flex-row">
            <View className="flex-col flex-grow-[1px] justify-center items-center my-4 pr-[10px]">
                <Image
                    source={{ uri: problema.s3Url }}
                    className="w-20 h-20 rounded-full border-color_light_gray"
                    style={{ width: 65, height: 65, borderRadius: 50, borderWidth: 1,  marginRight: 10 }}
                />
                <Text className='text-[12px] text-matte_gray '>{problema.nome}</Text>
              
            </View>

            <View className='flex-col flex-grow-[2px] w-[60%] p-[10px] justify-between text-left my-4 border-color_light_gray rounded-[10px]' style={{ borderWidth: 1, borderRadius: 10 }}>
            <Text className="text-[12px] text-matte_gray mb-[5px] font-semibold capitalize">{problema.tipoProblema.descricao}</Text>
            <Text className='text-[12px] text-matte_gray mb-[5px]'>{problema.descricao}</Text>
            
                <View className="w-full flex-row justify-end">
                    <Text className='text-[12px] text-matte_gray'>
                    {problema.dtCriacao}
                    </Text>
                </View>
            </View>
        </View>

        <View className='flex-col flex-grow-[2px] w-full p-[10px] justify-between text-left my-4 border-color_light_gray rounded-[10px]' style={{ borderWidth: 1, borderRadius: 10 }}>
            {problema.s3Url && <Image className="w-full h-[125px] rounded-[10px]" src={problema.s3Url}/>}
           
        </View> 

        <View className="mt-4 mb-2 flex-row justify-between items-center">
            <TouchableOpacity className='flex-row items-center'>
                <Image style={{ width: 30, height: 30, objectFit: 'cover' }} source={require('../assets/img/ativo.png')} />
            
                <Text className='ml-2 text-[12px] text-matte_gray font-semibold'>Sim, ainda ativo</Text>
            </TouchableOpacity>

            <TouchableOpacity className='flex-row items-center'>
                <Image style={{ width: 30, height: 30, objectFit: 'cover' }} source={require('../assets/img/desativo.png')} />
            
                <Text className='ml-2 text-[12px] text-matte_gray font-semibold'>Sim, ainda ativo</Text>
            </TouchableOpacity>
        </View>


        <View className="mt-4 mb-2 flex-row justify-between">
            <ButtonModal
                title="Fechar"
                handlePress={onClose}
                textStyles="text-color-err"
            />
            
            <ButtonModal
                title="Excluir ?"
                handlePress={onClose}
                // handlePress={limparFiltro}
                // disabled={!filtroAtivo}
                textStyles="text-black"
                
            />
            <Ionicons name="trash-outline" size={12} color="#555" style={{ marginLeft: 5 }} />
          
        </View>
    </View>
  )
}
