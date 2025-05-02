import { router } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { View, Text, FlatList, Image, Dimensions, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native'
import { Evento, Problema } from 'types'
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get('window')

interface EventCardCarouselProps {
  data: Evento[]
  problemas?: Problema[]
  visible?: boolean
  hilightedEvento?: Evento
  isMoved?: boolean
  handleChangeEvento: ({evento, interno} :{
      evento: Evento
      interno: boolean
  })  => void
  handleProblemSelect?: (problema: Problema) => void
  hideCarousel?: () => void
}

export default function EventCardCarousel({ 
  data, 
  problemas = [], 
  visible, 
  hilightedEvento, 
  isMoved = false,
  handleChangeEvento,
  handleProblemSelect,
  hideCarousel 
}: EventCardCarouselProps) {
  const flatListRef = useRef<FlatList>(null)
  const [activeTab, setActiveTab] = useState<'eventos' | 'problemas'>('eventos')

  useEffect(() => {
    if (flatListRef.current && visible && hilightedEvento) {
        const index = data.findIndex(evento => evento.id === hilightedEvento.id)
        if (index !== -1) {
            flatListRef.current.scrollToIndex({
                index,
                animated: true,
                viewPosition: 0.5
            })
        }
    }
  }, [hilightedEvento, visible, data])

  const onScrollToIndexFailed = (info: { index: number }) => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: info.index,
          animated: true,
        })
      }, 100); // Retry after a slight delay
    }
  }

  // Hide carousel when moved and conditions are met
  const handleMomentumScrollEnd = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x
    const index = Math.round(offsetX / (width * 0.9 + 16))
    
    if (index >= 0 && index < data.length) {
      handleChangeEvento({ evento: data[index], interno: false })
      
      // Hide carousel if user has moved it and we're showing highlighted event
      if (isMoved && hideCarousel) {
        hideCarousel()
      }
    }
  }

  // Don't render if not visible or if highlighted event exists and user has moved (based on the hide condition)
  if (!visible || (hilightedEvento && isMoved && activeTab === 'eventos')) {
    return null
  }

  const getStatusColor = (status: string): string => {
    const statusColors: {[key: string]: string} = {
      'PENDENTE': '#FFD166',
      'EM_ANALISE': '#4ECDC4',
      'RESOLVIDO': '#2EC4B6',
      'ARQUIVADO': '#011627',
    }
    return statusColors[status] || '#333333'
  }

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Data desconhecida'
    
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    } catch (error) {
      return 'Data inválida'
    }
  }

  return (
    <View className="absolute bottom-[-1%] left-0 w-full bg-white">
      <View className="flex-row mb-2 mt-1">
        <TouchableOpacity className={`px-6 py-3 items-center`} onPress={() => setActiveTab('eventos')}>
          <Text className={`text-[16px] font-bold ${activeTab === 'eventos' ? 'text-secondary_black_sub_title' : 'text-black'}`}>
          Eventos ({data.length})</Text>
          <View className={`mt-1 h-0.5 w-[66px] ${activeTab === 'eventos' ? 'bg-primary_green' : 'bg-transparent'}`}/>
        </TouchableOpacity>
        

        <TouchableOpacity className={`px-6 py-3 items-center`} onPress={() => setActiveTab('problemas')}>
          <Text className={`text-[16px] font-bold ${activeTab === 'problemas' ? 'text-black' : 'text-secondary_black_sub_title'}`}>
          Problemas ({problemas.length})</Text>
          <View className={`mt-1 h-0.5 w-[66px] ${activeTab === 'eventos' ? 'bg-transparent' : ' bg-primary_green'}`}/>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'eventos' ? (
          <FlatList
          ref={flatListRef}
          data={data}
          horizontal
          onMomentumScrollEnd={(event) => {
                  const offsetX = event.nativeEvent.contentOffset.x
                  const index = Math.round(offsetX / (width * 0.9 + 16))
                  if (index >= 0 && index < data.length) {
                      handleChangeEvento({ evento: data[index], interno: false})
                  }
              }
          }
          // getItemLayout={getItemLayout}
          onScrollToIndexFailed={onScrollToIndexFailed}
          showsHorizontalScrollIndicator={false}
          snapToInterval={width * 0.9 + 16}
          snapToAlignment="center"
          decelerationRate="fast"
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={()=>router.push({pathname:'event-view', params:{ eventoId: item.id, isFromLocation: "true" }})}
              style={[
                styles.card,
                {
                  width: width * 0.9,
                  marginLeft: index === 0 ? (width - width * 0.9) / 2 : 8,
                  marginRight: index === data.length - 1 ? (width - width * 0.9) / 2 : 8,
                  borderRadius: 16,shadowColor: '#000', shadowOffset: { width: 0, height: -2 },
                  
                },
              ]}
              className="h-[289px] bg-white shadow-lg mx-16 mb-10">
  
              
               <ImageBackground  
                  source={{uri: item.s3Url}} 
                  className="h-full w-full rounded-t-lg"
                  imageStyle={{ borderRadius: 10 }}
  >
                <View style={{ backgroundColor: "rgba(0,0,0,0.34)", position: "absolute", height: "100%", width: "100%", borderRadius: 10,}} >
  
                  <View className="pt-6 pb-[22px] px-6 flex-col justify-around items-center">
  
                    <View className='w-full mt-1 mb-[14px]'>
                      <Text className="text-[20px] text-color__text__light font-bold text-center mb-4">{item.nome}</Text>
                      <Text className="text-color__text__light text-[12px]">{item.descricao}</Text>
                    </View>
                    
                    <View className='w-full flex-row items-center justify-between mb-2' style={{ borderRadius: 18}}>
                      <Text className='text-[14px] font-bold text-white w-[50%]'>Organizado Por: {"\n"}{item.usuario.nome.replace(/\b\w/, (c: string) => c.toUpperCase())}</Text>
                                      
                      {item.usuario.s3Url ? 
                        <Image
                          src={item.usuario.s3Url}
                          className="w-20 h-20 rounded-full border-color_light_gray bg-white"
                          style={{ width: 65, height: 65, borderRadius: 50, borderWidth: 1, marginRight: 10 }}
                        />
                        :
                        <View className='w-[60px] h-[60px] rounded-[50px] border-[1px] border-color_light_gray bg-white items-center'>
                          <Text className='text-[40px] text-black '>{item.usuario.nome?.[0]}</Text>
                        </View>
                      }
                    </View>
  
                    <View className='flex-row justify-around w-full'>
                                        
                      <View>
                        <Text className='text-center text-color__text__light font-[12px]'>{item.data.split(' ')[1]}</Text>
                        <Text className='text-center text-color__text__light font-bold'>{item.data.split(' ')[0]}</Text>
                      </View>
  
                      <View>
                        <Text className='text-center text-color__text__light font-[12px]'>{item.faixaKm} km</Text>
                        <Text className='text-center text-color__text__light font-bold'>Faixa</Text>
                      </View>
  
                      <View>
                        <Text className='text-center text-color__text__light font-[12px]'>{item.gratuito ? 'Gratuito' : 'Pago'} </Text>
                        <Text className='text-center text-color__text__light font-bold'>Tipo</Text>
                      </View>
                    </View>
                
                    <Text className="text-color_light_gray_2 text-[12px] text-center mt-6 bg-primary_green w-full p-5" style={{ borderRadius: 50}}>
                      Tipo de Evento: {item.tipoEvento.nome}
                    </Text>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          )}
        />
      ) : (
        <FlatList
          data={problemas}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={width * 0.9 + 16}
          snapToAlignment="center"
          decelerationRate="fast"
          keyExtractor={(problema) => problema.id.toString()}
          renderItem={({ item: problema, index }) => (
            <TouchableOpacity
              onPress={() => handleProblemSelect && handleProblemSelect(problema)}
              style={[
                styles.card,
                {
                  width: width * 0.9,
                  marginLeft: index === 0 ? (width - width * 0.9) / 2 : 8,
                  marginRight: index === data.length - 1 ? (width - width * 0.9) / 2 : 8,
                  borderRadius: 16,shadowColor: '#000', shadowOffset: { width: 0, height: -2 },
                },
              ]}
              className="h-[289px] bg-white shadow-lg mx-16 mb-10">
              
              <View className="pt-6 pb-[22px] px-6 flex-col">
                  <View className='w-full mt-1 mb-[14px]'>
                    <Text className="text-[20px] text-matte_grayt font-bold text-center mb-4">{problema.tipoProblema.descricao}</Text>
                    <Text className='text-[12px] text-matte_gray mb-[5px]'>{problema.descricao || "Sem descrição"}</Text>
                            
                    <View className="w-full flex-row justify-end">
                        <Text className='text-[12px] text-matte_gray'>
                        {problema.dtCriacao}
                        </Text>
                    </View>
                  </View>

                <View key={problema.id} className='w-full flex-row h-[120px] items-stretch mb-2' style={{ borderRadius: 18}}>
            
                  <Image
                      source={
                        problema.tipoProblema.id === 1?( require('../assets/problema/problema_tipo_1.png')) 
                          :
                          problema.tipoProblema.id === 2?( require('../assets/problema/problema_tipo_2.png') )
                          : 
                          problema.tipoProblema.id === 3?( require('../assets/problema/problema_tipo_3.png') )
                          :
                          problema.tipoProblema.id === 4?( require('../assets/problema/problema_tipo_4.png') ) 
                          :
                          problema.tipoProblema.id === 5?( require('../assets/problema/problema_tipo_5.png') )   
                          :
                          problema.tipoProblema.id === 6?( require('../assets/problema/problema_tipo_6.png') )   
                          :
                          problema.tipoProblema.id === 7?( require('../assets/problema/problema_tipo_7.png') )   
                          :  
                          problema.tipoProblema.id === 8?( require('../assets/problema/problema_tipo_8.png') )   
                          :  
                            require('../assets/problema/problema_tipo_1.png')}
                      className="w-20 h-20 rounded-full border-color_light_gray"
                      style={{ width: 65, height: 65, borderRadius: 50, borderWidth: 1,  marginRight: 10, marginTop: 30 }}
                  />
                
                  {problema.s3Url ? 
                    (<View className='flex-col flex-grow-[2px] w-[90%] p-[10px] justify-center items-center text-left my-4 border-color_light_gray rounded-[10px]' style={{ borderWidth: 1, borderRadius: 10 }}>
                        {problema.s3Url && <Image className="w-full h-[20%] rounded-[10px]" src={problema.s3Url}/>}
                      
                    </View>)
                    :
                    (<View className='flex-col flex-grow-[2px] w-[100px] p-[10px] justify-center items-center text-left my-4 border-color_light_gray rounded-[10px] h-[100px]'
                        style={{borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10}}>
                        <Ionicons name="image-outline" size={24} color="#555" style={{ marginLeft: 5 }} />
                    </View>)
                  } 
                             
                </View>

                
                <View className="mt-auto flex-row ">
                  <View className="flex-row items-center">
                    <Text className="text-[14px] text-secondary_black_sub_title mr-2">
                      Status:
                    </Text>
                    <View 
                      className="px-3 py-1 rounded-full"
                      // style={{ backgroundColor: getStatusColor(problema.reportCount || 'PENDENTE') }}
                    >
                      <Text className="text-white font-medium">{problema.reportCount || 'PENDENTE'}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
      
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 8,
  },
})