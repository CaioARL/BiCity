import { View, Text, ScrollView, Image, ActivityIndicator, Alert, Animated } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthProvider } from './context/AuthProvider'
// import { Video, ResizeMode } from 'expo-av';

export default function Index() {
    const { authState, isLoading } = useAuthProvider();
    const [isVisible, setIsVisible] = useState(false);
  
    const spinValue = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(-30)).current;
      

    useEffect(() => {
    
      const loading = async () => {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        if (authState?.authenticated) {
          router.replace('/events');
        } else {
          router.replace('/sign-in');
        }
      };
      loading();
      
      const timer = setTimeout(() => {
           setIsVisible(true); 
       }, 200);

       const spinAnimation = Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 2000, 
                useNativeDriver: true,
            })
        );

        const fallAnimation = Animated.timing(translateY, {
            toValue: 0,
            duration: 1500, 
            delay: 500, 
            useNativeDriver: true,
        });

        spinAnimation.start();
        fallAnimation.start();

      return () => {
            clearTimeout(timer);
            spinAnimation.stop();
        };
    }, [isLoading]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
      <SafeAreaView className="h-full bg-primary_green">
          <View style={{flex: 1, justifyContent: 'flex-end',backgroundColor: 'rgba(0,0,0,0.2)'}}>
              <ScrollView contentContainerStyle={{ height: '100%' }}>
                  <View className="flex-1 items-center justify-center">
                      <Text
                          className={`text-[32px] text-white font-robotobold mb-[54px] ${
                              isVisible ? 'opacity-100' : 'opacity-0'
                          } transition-opacity duration-1000`} 
                      >
                          BICITY
                      </Text>
                      
                      <View className={'items-center justify-between mb-[54px]'}>
                          <Animated.Image 
                              source={require('../assets/img/corpo.png')} 
                              resizeMode="contain" 
                              className='h-[100px] w-[100px]'
                              style={{
                                  transform: [{ translateY: translateY }],
                                  top: 35,
                                  left: 10,
                              }}
                          />

                          <View className={`flex-row items-center justify-between mb-[54px]`}>
                              <Animated.Image 
                                  source={require('../assets/img/roda.png')} 
                                  resizeMode="contain" 
                                  className='h-[60px] w-[100px] '
                                  style={{
                                      transform: [{ rotate: spin }]
                                  }}
                              />
                              <Animated.Image 
                                  source={require('../assets/img/roda.png')} 
                                  resizeMode="contain" 
                                  className='h-[60px] w-[100px]'
                                  style={{
                                      transform: [{ rotate: spin }]
                                  }}
                              />
                          </View>
                      </View> 
                      
                      {/* Comentário do vídeo mantido */}
                      {/* <Video
                        source={require('../assets/img/Slides - BiCity (39).mp4')}
                        style={{ width: 210, height: 230, alignSelf: 'center', top: -35, opacity: 0.81, }}
                        className="position-fixed"
                        resizeMode={ResizeMode.COVER}
                        isLooping
                        isMuted
                        shouldPlay
                      /> */}

                      {isLoading && (
                          <View>
                              <Text>
                                  <ActivityIndicator
                                      size='large'
                                      color='#fff'
                                  />
                              </Text>
                          </View>
                      )}
                      
                  </View>
              </ScrollView>
          </View>
      </SafeAreaView>
  )
}