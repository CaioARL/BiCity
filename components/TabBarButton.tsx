import React, { useEffect } from 'react';
import { Pressable, Text } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import CustomTabBar from '../css/CustomTabBar';
import { useSharedValue, withSpring, useAnimatedStyle, interpolate } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

interface TabBarButtonProps {
    onPress: () => void;
    onLongPress: () => void;
    isFocused: boolean;
    routeName: string;
    color: string;
    label: any;
}

const icons = {
  events: "albums-outline",
  home: "map-outline",
  profile: "person-outline"
} as const;

const TabBarButton = ({
    onPress, 
    onLongPress, 
    isFocused, 
    routeName, 
    color, 
    label 
}: TabBarButtonProps ) => {

  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, { duration: 350 });
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.1]);
    const top = interpolate(scale.value, [0, 1], [0, 9]);
    return {
      transform: [{ scale: scaleValue }],
      top: top
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale .value, [0, 1], [1, 0]);
    return {
      opacity: opacity,
    };
  });

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={CustomTabBar.tabbarItem}
    >
      <Animated.View style={[animatedIconStyle]}>
        <Ionicons 
          name={icons[routeName as keyof typeof icons]} 
          size={20} 
          color={color} 
        />
      </Animated.View>
      <Animated.Text style={[{ color }, animatedTextStyle, { fontSize: 12 }]}>
        {label}
      </Animated.Text>
    </Pressable>  
  );
}

export default TabBarButton;