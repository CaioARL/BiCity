import React from 'react'
import { Text, View , ScrollView} from 'react-native'
import { PageAvaliacao } from '../../types'
import CustomButton from '../../components/CustomButton'



interface AvaliacaoViewProps {
    pageAvaliacao : PageAvaliacao
    onClose: () => void
}


export default function AvaliacaoView({ pageAvaliacao, onClose }: AvaliacaoViewProps) {
  return (
    <View className="obsolute bg-white rounded-lg shadow-md  h-fit w-[94%] top-[25%] left-[3%] absolute justify-center">
            <ScrollView>
            {pageAvaliacao.avaliacoes.map((avaliacao)=>(
                <View key={avaliacao.id} className="relative px-4 py-2 border-b-hairline border-gray-200">
                    <Text className="text-lg font-semibold">{avaliacao.comentario}</Text>

                </View>
                )
            )}
            

            </ScrollView>

            
    
            <View className="px-4 py-2">
                <Text className="text-gray-500">{"Total de registros: "+pageAvaliacao.totalRegistros}</Text>
                <CustomButton
                    title="Fechar"
                    handlePress={onClose}
                    containerStyles="mt-4 mb-4"
                />
            </View>   
        </View>

  )
}
