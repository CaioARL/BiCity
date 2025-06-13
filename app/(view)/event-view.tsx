import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Image, Linking, ScrollView, View, Animated, Dimensions, TouchableOpacity, Share } from 'react-native'
import { getEventoById } from '../../api/evento'
import { Evento } from '../../types'
import { Text } from 'react-native'
import ShowAlert from '../../components/ShowAlert'
import LoadingActivity from '../../components/LoadingActivity'
import CustomEvents from '../../css/CustomEvents';
import { Ionicons } from "@expo/vector-icons";
import { useAuthProvider } from 'app/context/AuthProvider'
import { SafeAreaView } from 'react-native-safe-area-context'
import icons from 'constants/icons'

export default function EventV() {

  const { eventoId, isFromLocation } = useLocalSearchParams<{eventoId: string, isFromLocation: string}>()
  const { authState } = useAuthProvider()
  
  const [evento, setEvento] = useState<Evento>()

  const [isContentLoading, setIsContentLoading] = useState<boolean>(true)
  const [errorMessage ,setErrorMessage] = useState<string|null>()

  // Animação para o box de informações
  const slideAnim = useState(new Animated.Value(Dimensions.get('window').height))[0];
  
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

  // Iniciar animação quando o conteúdo carregar
  useEffect(() => {
    if (!isContentLoading && evento) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [isContentLoading, evento]);

  const handleLocationEventMap = (evento: Evento) => {
    if ( isFromLocation === "true") return router.back()
    if ( !authState ) return
    if ( !authState.user ) return
    if ( authState.user.role === 'PJ') return
    router.dismissTo({pathname:'home', params:{ eventoId: evento.id.toString() }})
    // console.log('Você foi direcionar para o evento no mapa:', evento.nome);
  }

  const handleToshareEvent = async (item: Evento) => {
    try {
      // Título 
      const title = `Evento: ${item.nome}`;
      
      // Conteúdo
      const shareMessage = `🎉 *${item.nome}*\n\n${item.descricao}\n\n📍 *Local:* ${item.endereco.rua}, ${item.endereco.numero}, ${item.endereco.bairro}, ${item.endereco.cidade} - ${item.endereco.estado}\n\n📆 *Data:* ${item.data}\n🏃 *Distância:* ${item.faixaKm} km\n💰 *Tipo:* ${item.gratuito ? 'Gratuito' : 'Pago'}\n\n [©] 2025 BiCity`;
      
      // Construir opções de compartilhamento
      const shareOptions = {
        title: title,
        message: shareMessage,
      };
      
      // Adicionar URL do site ou da imagem se disponíveis
      if (item.urlSite) {
        shareOptions.message += `\n\n🔗 ${item.urlSite}`;
      } else if (item.s3Url) {
        shareOptions.message += `\n\n🖼️ ${item.s3Url}`;
      }
      
      // Chamar a API de compartilhamento
      const result = await Share.share(shareOptions);
      
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(`Compartilhado com sucesso via: ${result.activityType}`);
        } else {
          console.log('Compartilhado com sucesso');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Compartilhamento cancelado');
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      setErrorMessage('Erro ao compartilhar evento. Por favor, tente novamente.');
    }
  }

if(isContentLoading){
  return  <LoadingActivity/>
} else if (!evento){
  return (
    <SafeAreaView className="flex-col justify-center bg-white h-full w-full">
      <TouchableOpacity
        style={{ position: 'absolute', top: 45, right: 20, borderRadius: '50%',  paddingHorizontal: 15,
          paddingVertical: 15, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, zIndex: 10,}} 
          className='bg-primary_green'
          onPress={() => router.back()}
        >
        <Ionicons name='arrow-back' size={24} color="#555"/>
        </TouchableOpacity>
      <Text className="text-center text-red-500 mt-4">
        Algo deu errado ao carregar o evento. Tente novamente mais tarde.
      </Text>
    </SafeAreaView>
  )
} else
  return (
    <SafeAreaView className="bg-white h-full w-full">
       <TouchableOpacity
        style={{ position: 'absolute', top: 45, right: 20, borderRadius: '50%',  paddingHorizontal: 15,
          paddingVertical: 15, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, zIndex: 10,}} 
          className='bg-primary_green'
          onPress={() => router.back()}
        >
        <Ionicons name='arrow-back' size={24} color="#555"/>
        </TouchableOpacity>

      {errorMessage && (
        <ShowAlert
          type="error"
          message={errorMessage}
          isStatic={true}
          onClose={() => setErrorMessage(null)}
        />
      )}
      <View className="flex-1">
          {evento?.s3Url && (
            <Image
              source={{ uri: evento.s3Url }}
             className="w-full h-full"
              resizeMode="cover"
            />
          )}

          
        <Animated.View  style={{flexDirection: 'row', position: 'absolute', top: 270, right: 10, alignItems: 'center', width: '100%',  transform: [{ translateY: slideAnim }] }}>
          <TouchableOpacity 
            className='bg-primary_green flex-row p-[10px] ml-auto w-[40%] items-center justify-center' 
            style={{ borderRadius: 50}}
            onPress={() => evento && handleToshareEvent(evento)}
            >
            <Text className="text-matte_gray font-bold align-items-center">Compartilhe</Text>
            <Ionicons name="navigate-outline" size={20} color="#555" style={{ paddingLeft: 8 }} />
          </TouchableOpacity>
        </Animated.View>

        {/* Box de informações com gradiente e animação */}
        <Animated.View style={{ transform: [{ translateY: slideAnim }], backgroundColor: 'white', borderTopLeftRadius: 16, borderTopRightRadius: 18, paddingHorizontal:20 , position: 'absolute', bottom: 0, left: 0, right: 0, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, }}
          className=" h-[402px] rounded-xl">
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="flex-col items-center py-[10px]">
              {evento && (
                <>
                 <View style={CustomEvents.containerButtonEventView}>
                    <TouchableOpacity 
                      style={CustomEvents.customButtonEventView} 
                        onPress={() => {
                          handleLocationEventMap(evento)
                        }}
                      >
                      <Ionicons name="location-outline" size={20} color="white" />
                      <Text className="text-white font-bold ml-2">Ver no Mapa</Text>
                    </TouchableOpacity>
                    <Text className=" text-matte_gray font-bold text-left w-[50%]">
                    Endereço: {evento.endereco.rua}, {evento.endereco.numero},{' '}
                    {evento.endereco.bairro}, {evento.endereco.cidade} - {evento.endereco.estado}
                  </Text>
                  </View>

                  <View className='bg-color_light_gray_2 border w-full flex-row items-center justify-between px-10 py-4 mt-[16px]' style={{ borderRadius: 18}}>
                    <Text className='text-32 font-bold text-white w-[50%]'>Organizado Por: {"\n"}{evento.usuario.nome.replace(/\b\w/, (c) => c.toUpperCase())}</Text>
                  
                    {evento.usuario.s3Url ? 
                      <Image
                        src={evento.usuario.s3Url}
                        className="w-20 h-20 rounded-full border-color_light_gray bg-primary_green"
                        style={{ width: 65, height: 65, borderRadius: 50, borderWidth: 1, marginRight: 10 }}
                      />
                      :
                      <View className='w-[65px] h-[65px] rounded-[50px] border-[1px] border-color_light_gray bg-primary_green items-center'>
                        <Text className='text-[45px] text-black '>{evento.usuario.nome?.[0]}</Text>
                      </View>
                    }
                  </View>

                  <View className='w-full mt-1'>
                    <Text className="text-[31px] font-bold text-matte_gray text-center">{evento.nome}</Text>
                    <Text className="text-matte_gray text-[12px]">{evento.descricao}</Text>
                  </View>
                  
                  <View className='flex-row justify-around mt-4 w-full'>
                    
                    <View>
                      <Text className='text-center text-matte_gray font-[12px]'>{evento.data.split(' ')[1].slice(0, 5)}</Text>
                      <Text className='text-center text-matte_gray font-bold'>{evento.data.split(' ')[0]}</Text>
                    </View>

                    <View>
                      <Text className='text-center text-matte_gray font-[12px]'>{evento.faixaKm} km</Text>
                      <Text className='text-center text-matte_gray font-bold'>Faixa</Text>
                    </View>

                    <View>
                      <Text className='text-center text-matte_gray font-[12px]'>{evento.gratuito ? 'Gratuito' : 'Pago'} </Text>
                      <Text className='text-center text-matte_gray font-bold'>Tipo</Text>
                    </View>
                  </View>
                 
              

                 <View className="flex-row items-center justify-between mt-3 px-4">
                    <View className="w-[90px] flex-row items-center">
                      <Image
                        source={evento.gratuito ? icons.mapa_pino_evento_gratuito : icons.mapa_pino_evento_pago}
                        style={{ width: 55, height: 55, marginRight: 8 }}
                        resizeMode="contain"
                      />
                    </View>
                    <View className="w-[100] flex-col items-center justify-end">
                      <View className="flex-row items-center justify-center">
                        <Ionicons name="cash-outline" size={20} color="#555" style={{ marginRight: 8 }} />
                        <Text className="text-color_light_gray_2 text-[12px]">
                          R$: 10
                        </Text>
                      </View>
                      <Text className="text-color_light_gray_2 text-[12px] mt-1">{evento.gratuito ? 'Gratuito' : 'Pago'}</Text>
                    </View>
                  </View>

                  {evento.urlSite && (
                  <View className="flex-row items-center justify-center mt-3">
                    <Text className="text-color__text__link text-[14.5px]">
                      Site:{' '}
                      <Text onPress={() => Linking.openURL(evento.urlSite)}>
                        {evento.urlSite}
                      </Text>
                    </Text>
                    <Ionicons name="ticket-outline" size={12} color="#555" style={{ marginLeft: 5 }} />
                  </View>
                  )}
                  <Text className="text-color_light_gray_2 text-[12px] text-center mt-3 bg-primary_green w-full p-5" style={{ borderRadius: 50}}>
                    Tipo de Evento: {evento.tipoEvento.nome}
                  </Text>
              
                </>
              )}

              {!isContentLoading && !evento && (
                <Text className="text-center text-red-500 mt-4">
                  Algo deu errado ao carregar o evento. Tente novamente mais tarde.
                </Text> 
              )}
            </View>
            
          </ScrollView>
        </Animated.View>
      </View>
    </SafeAreaView>
  )
}
