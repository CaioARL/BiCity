import { router } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { View, Text, FlatList, Image, Dimensions, StyleSheet, TouchableOpacity } from 'react-native'
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
            onPress={()=>router.push({pathname:'event-view', params:{ eventoId: item.id }})}
            style={[
              styles.card,
              {
                width: width * 0.9,
                marginLeft: index === 0 ? (width - width * 0.9) / 2 : 8,
                marginRight: index === data.length - 1 ? (width - width * 0.9) / 2 : 8,
              },
            ]}
            className="h-fit bg-white rounded-lg shadow-lg mx-2"
          >
            <Image className="h-24 w-full rounded-t-lg" source={{ uri: item.s3Url }} />
            <View className="p-2 flex-row justify-around items-center">
              <View>
                <Image className="h-12 w-12 rounded-full" source={{ uri: item.usuario.s3Url }} />
              </View>
              <View>
                <Text className="font-bold text-lg">{item.nome}</Text>
                <Text className="text-base">{item.descricao}</Text>
                <Text className="text-base">{item.tipoEvento.nivelHabilidade.nome}</Text>
                <Text className="text-base">{item.data}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.container}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    //mudancaaaaaaaaaaaa se necessario
  },
  card: {
    marginHorizontal: 8,
  },
})
