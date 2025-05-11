import { View, Text, Image, useWindowDimensions } from 'react-native'
import React from 'react'
import { Slide } from 'util/slides'


interface OnBoardingItemProps {
  item: Slide
}

export default function OnBoardingItem({ item }: OnBoardingItemProps) {
  const { width } = useWindowDimensions()

  return (
    <View className="flex-1 justify-center items-center" style={{ width }}>
      <Image
        source={item.image}
        className="flex-[0.7] w-full"
        resizeMode="cover"
      />
      <View className="flex-[0.3] px-4">
        <Text className="text-[18px] text-matte_gray mb-3 text-center font-bold capitalize">
          {item.title}
        </Text>
        <Text className="text-[12px] text-matte_gray px-16 text-center">
          {item.description}
        </Text>
      </View>
    </View>
  )
}