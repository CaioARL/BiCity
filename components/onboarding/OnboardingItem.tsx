import { View, Text, Image, useWindowDimensions } from 'react-native';
import React from 'react';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Slide } from 'util/slides';

interface OnBoardingItemProps {
  item: Slide;
}

export default function OnBoardingItem({ item }: OnBoardingItemProps) {
  const { width } = useWindowDimensions();
  
  const player = useVideoPlayer(
    item.media.type === 'video' ? item.media.source : null,
    (player) => {
      if (player) {
        player.loop = true;
        player.play();
      }
    }
  );

  return (
    <View className="justify-center items-cente" style={{ width }}>
      <View className="flex-[0.9] justify-end items-center bg-primary_green" style={{ width }}>

        {item.media.type === 'image' ? (
          <Image
            source={item.media.source}
            style={{ width: 630,  height:'85%', }}
            resizeMode="contain"
          />
        ) : (
          <VideoView
            player={player}
            style={{ width: 500, height: '90%', flex: item.id === '5' || item.id === '4' ? 0.79 : 0.79,
              marginBottom: item.id === '3' || item.id === '5' || item.id === '6' || item.id === '4' ? 5 : 0
             }}
            allowsFullscreen={false}
            nativeControls={false}
          />
        )}
        
      </View>
      <View className="flex-[0.4] px-4">
        <Text className="text-lg text-matte_gray mb-3 mt-3 text-center font-bold capitalize">
          {item.title}
        </Text>
        <Text className={`text-${item.id === '7' ? '[12px]' : '[14.5px]'} text-matte_gray px-10 text-center`}>
          {item.description}
        </Text>
      </View>
    </View>
  );
}