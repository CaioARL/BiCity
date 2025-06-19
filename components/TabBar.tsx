import React, { useState, useEffect } from 'react';
import { Appearance, Keyboard, LayoutChangeEvent} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import CustomTabBar from '../css/CustomTabBar';
import TabBarButton from './TabBarButton';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useGlobalSearchParams } from 'expo-router';
import { useAuthProvider } from 'app/context/AuthProvider';

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const [dimensions, setDimensions] = useState<{ height: number; width: number }>({ height: 20, width: 100 });
  const tabPositionX = useSharedValue(0);
  const [isVisible, setIsVisible] = useState(true)
  const { tabBarVisible } = useGlobalSearchParams<{tabBarVisible?: string}>()
  const { authState } = useAuthProvider()

  const onTabLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  useEffect(()=>{
    const showListener = Keyboard.addListener('keyboardDidShow', () => setIsVisible(false))
    const hideListener = Keyboard.addListener('keyboardDidHide', () => tabBarVisible !== "no"  && setIsVisible(true))

    return () => {
      showListener.remove()
      hideListener.remove()
    };
  })

  const visibleRoutes = state.routes.filter(route => {
    if(authState?.user?.role === 'PJ' && route.name === 'home') return false;
    return true;
  });

  useEffect(() => {
    const realIndex = visibleRoutes.findIndex(route => route.key === state.routes[state.index].key);
    const buttonWidth = dimensions.width / visibleRoutes.length;
    tabPositionX.value = withSpring(buttonWidth * realIndex, { damping: 100, stiffness: 150 });
  }, [state.index, dimensions.width, visibleRoutes]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  useEffect(() => {
    if(tabBarVisible === "yes")
      setIsVisible(true)

    if(tabBarVisible === "no")
      setIsVisible(false)
  }, [tabBarVisible])

  if (!isVisible) return null

  const buttonWidth = dimensions.width / visibleRoutes.length;
  const theme = Appearance.getColorScheme()

  return (
    <Animated.View style={{...CustomTabBar.tabbar, backgroundColor: theme==='light'?'white':'#1f2937'}} onLayout={onTabLayout}>
      <Animated.View
        className={`absolute bg-primary_green rounded-[30] mx-[12px]`}
        style={[animatedStyle, {
          height: dimensions.height - 15,
          width: authState?.user?.role === 'PJ' ? buttonWidth - 60 : buttonWidth - 25,
          left: authState?.user?.role === 'PJ' ? 15 : 0, 
          marginHorizontal: 0
        }]}
      />

      {state.routes.map((route, index) => {
        if(authState?.user?.role === 'PJ' && route.name === 'home') return null;
        
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;
        const isFocused = state.index === index;
        
        const onPress = () => {
          const realIndex = visibleRoutes.findIndex(r => r.key === route.key);
          tabPositionX.value = withSpring(buttonWidth * realIndex, { damping: 100, stiffness: 150 });

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
            color={theme==='light'? '#333' : 'white'}
            label={label}
          />
        );
      })}
    </Animated.View>
  );
}