import { View, Animated, useWindowDimensions } from 'react-native'
import React from 'react'
import { Slide } from 'util/slides'


interface PaginatorProps {
  data: Slide[]
  scrollX: Animated.Value
}

export default function Paginator({ data, scrollX }: PaginatorProps) {
  const { width } = useWindowDimensions()

  return (
    <View className="flex-row flex-[0.4] mb-6 items-center justify-center">
      {data.map((_: Slide, i: number) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width]

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: 'clamp',
        })

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        })

        return (
          <Animated.View
            className="h-3 bg-primary_green mx-2 rounded-full"
            style={{ width: dotWidth, opacity }}
            key={i.toString()}
          />
        )
      })}
    </View>
  )
}