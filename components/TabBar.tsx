import React, { useState, useEffect } from 'react';
import { View, LayoutChangeEvent } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import CustomTabBar from '../css/CustomTabBar';
import TabBarButton from './TabBarButton';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTabBar } from '../app/context/TabBarContext'; 

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const [dimensions, setDimensions] = useState<{ height: number; width: number }>({ height: 20, width: 100 });
  const tabPositionX = useSharedValue(0);
  const { tabBarOffset } = useTabBar(); 

  const onTabLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  useEffect(() => {
    const buttonWidth = dimensions.width / state.routes.length;
    tabPositionX.value = withSpring(buttonWidth * state.index, { damping: 100, stiffness: 150 });
  }, [state.index, dimensions.width]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  const animatedTabBarStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: tabBarOffset.value }],
    };
  });

  const buttonWidth = dimensions.width / state.routes.length;

  return (
    <Animated.View style={[CustomTabBar.tabbar, animatedTabBarStyle]} onLayout={onTabLayout}>
      <Animated.View
        className={`absolute bg-primary_green rounded-[30] mx-[12px]`}
        style={[animatedStyle, {
          height: dimensions.height - 15,
          width: buttonWidth - 25,
        }]}
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          tabPositionX.value = withSpring(buttonWidth * index, { damping: 100, stiffness: 150 });

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? '#333' : '#333'}
            label={label}
          />
        );
      })}
    </Animated.View>
  );
}