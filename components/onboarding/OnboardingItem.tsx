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
      <View className="flex-[0.8] justify-center items-center bg-primary_green" style={{ width }}>

        {item.media.type === 'image' ? (
          <Image
            source={item.media.source}
            className="flex-1 w-full"
            resizeMode="cover"
          />
        ) : (
          <VideoView
            player={player}
            style={{ width: 500, height: '90%', flex: 1 }}
            allowsFullscreen={false}
            nativeControls={false}
          />
        )}
        
      </View>
      <View className="flex-[0.3] px-4">
        <Text className="text-[18px] text-matte_gray mb-3 mt-3 text-center font-bold capitalize">
          {item.title}
        </Text>
        <Text className="text-[12px] text-matte_gray px-10 text-center">
          {item.description}
        </Text>
      </View>
    </View>
  );
}