import React from 'react'
import { Problema } from '../../types'
import { Text, View, Image } from 'react-native'
import CustomButton from '../../components/CustomButton'



interface PinProblemaViewProps {
    problema: Problema
    onClose: () => void
}


export default function PinProblemaView( { problema , onClose} : PinProblemaViewProps) {
  return (
    <View className="obsolute bg-white rounded-lg shadow-md  h-fit w-[94%] top-[25%] left-[3%] absolute justify-center">
        <View className="relative px-4 py-2 border-b-hairline border-gray-200">
            <Text className="text-lg font-semibold">{problema.tipoProblema.descricao}</Text>
        </View>

        <View className="px-4 py-2">
            <Text className="text-gray-500">{problema.descricao}</Text>
            {problema.s3Url && <Image className="w-full h-[125px] rounded-[10px]" src={problema.s3Url}/>}
            <CustomButton
                title="Fechar"
                handlePress={onClose}
                containerStyles="mt-4 mb-4"
            />
        </View>   
    </View>
  )
}
