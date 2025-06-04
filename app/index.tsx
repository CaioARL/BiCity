import { View, Text, ScrollView, Image, ActivityIndicator, Alert  } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthProvider } from './context/AuthProvider'
import { Video, ResizeMode } from 'expo-av';

export default function Index() {
   const { authState, isLoading } = useAuthProvider();
    const [isVisible, setIsVisible] = useState(false);
  
    useEffect(() => {
    
      const timer = setTimeout(() => {
        setIsVisible(true); 
      }, 200);
  
      const loading = async () => {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        if (authState?.authenticated) {
          router.replace('/events');
        } else {
          router.replace('/sign-in');
        }
      };
      loading();

      return () => clearTimeout(timer);
    }, [isLoading]);

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
                {/* <Image 
                  source={require('../assets/img/logo.png')} 
                  resizeMode="contain" 
                  className='h-[172px] w-[135px]'
                  
                ></Image> */}
                <Video
                  source={require('../assets/img/Slides - BiCity (39).mp4')}
                  style={{ width: 210, height: 230, alignSelf: 'center', top: -35, opacity: 0.81, }}
                  className="position-fixed"
                  resizeMode={ResizeMode.COVER}
                  isLooping
                  isMuted
                  shouldPlay
                />

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