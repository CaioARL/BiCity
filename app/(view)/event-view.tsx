import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Image, Linking, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getEventoById } from '../../api/evento'
import { Evento } from '../../types'
import { Text } from 'react-native'
import ShowAlert from '../../components/ShowAlert'
import LoadingActivity from '../../components/LoadingActivity'

export default function EventV() {

  const { eventoId } = useLocalSearchParams<{eventoId: string}>()
  const [evento, setEvento] = useState<Evento>()

  const [isContentLoading, setIsContentLoading] = useState<boolean>(true)
  const [errorMessage ,setErrorMessage] = useState<string|null>()
  
  useEffect(()=>{
    if(!eventoId) return
    getEventoById(eventoId, null)
    .then((response)=>{
      setEvento(response)
    })
    .catch((error)=>{
      setErrorMessage('Erro ao carregar Evento' + error.message)
    })
    .finally(()=>{
      setIsContentLoading(false)
    })
  },[eventoId])

  return (
    <SafeAreaView className='bg-[#DCDCDC] h-full'>
      {isContentLoading && <LoadingActivity/>}
      {errorMessage &&
        <ShowAlert type='error' message={errorMessage} isStatic={true} onClose={()=>setErrorMessage(null)}/>
      }  
      <ScrollView className='h-[98%] w-[92%] ml-[4%] bg-white rounded-[10px] drop-shadow-lg p-4' >
          {evento?.s3Url && (
            <Image
              source={{ uri: evento.s3Url }}
              className="w-full h-64 mt-4 rounded-[10px]"
              resizeMode="cover"
            />
          )}
          <View className="flex-col items-center mt-4 container" >
            {evento && (
              <>
                <Text className="text-2xl font-bold text-gray-800 mt-5">{evento.nome}</Text>
                <Text className="text-gray-600 mt-2">{evento.descricao}</Text>
                <Text className="text-gray-500 mt-2">Data: {new Date(evento.data).toLocaleString()}</Text>
                <Text className="text-gray-500 mt-2">Última Atualização: {new Date(evento.dtAtualizacao).toLocaleString()}</Text>
                <Text className="text-gray-500 mt-2">Endereço: {evento.endereco.rua}, {evento.endereco.numero}, {evento.endereco.bairro}, {evento.endereco.cidade} - {evento.endereco.estado}</Text>
                <Text className="text-gray-500 mt-2">Faixa de Km: {evento.faixaKm} km</Text>
                <Text className="text-gray-500 mt-2">Gratuito: {evento.gratuito ? 'Sim' : 'Não'}</Text>
                {evento.urlSite && (
                  <Text className="text-blue-500 mt-2">Site: <Text onPress={() => Linking.openURL(evento.urlSite)}>{evento.urlSite}</Text></Text>
                )}
                <Text className="text-gray-500 mt-2">Tipo de Evento: {evento.tipoEvento.nome}</Text>
                <Text className="text-gray-500 mt-4 text-center">Organizado por: {evento.usuario.nome}</Text>
              </>
            )}

            {!isContentLoading && !evento && (
              <Text className='text-center text-red-500 mt-4'>
                Algo deu errado ao carregar o evento. Tente novamente mais tarde.
              </Text>
            )}
          </View>

      </ScrollView>
    </SafeAreaView>
  )
}
