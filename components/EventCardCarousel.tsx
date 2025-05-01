import { router } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { View, Text, FlatList, Image, Dimensions, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native'
import { Evento } from 'types'

const { width } = Dimensions.get('window')

interface EventCardCarouselProps {
  data: Evento[]
  visible?: boolean
  hilightedEvento: Evento
  handleChangeEvento: ({evento, interno} :{
    evento: Evento
    interno: boolean
})  => void
}

export default function EventCardCarousel({ data, visible, hilightedEvento, handleChangeEvento }: EventCardCarouselProps) {
  const flatListRef = useRef<FlatList>(null)

  useEffect(() => {
    if (flatListRef.current && visible) {
        flatListRef.current.scrollToItem({
            item: hilightedEvento,
            animated: true,
            viewPosition: 0.5
        })
    }
  }, [hilightedEvento, visible])

  // const getItemLayout = (_: any, index: number) => ({
  //   length: width * 0.9 + 16, // Card width + margin
  //   offset: (width * 0.9 + 16) * index,
  //   index,
  // })


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



  if (!visible) {
    return null
  }

  return (
    <View className="absolute bottom-[3%] left-0 w-full">

      <View>
        {/* Eventos */}
        {/* Problemas */}
      </View>
      
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
            className="h-[289px] bg-white shadow-lg mx-16">

            
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
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 8,
  },
})
