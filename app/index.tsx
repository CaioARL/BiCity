import { View, Text, ScrollView, ActivityIndicator, Animated } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthProvider } from './context/AuthProvider'

export default function Index() {
    const { authState, isLoading } = useAuthProvider()
    const [isVisible, setIsVisible] = useState(false)

    const spinValue = useRef(new Animated.Value(0)).current
    const translateY = useRef(new Animated.Value(-30)).current

    useEffect(() => {
        const loading = async () => {
            await new Promise((resolve) => setTimeout(resolve, 3000))
            if (authState?.authenticated) {
                router.replace('/events')
            } else {
                router.replace('/sign-in')
            }
        }
        loading()

        const timer = setTimeout(() => {
            setIsVisible(true)
        }, 200)

        const spinAnimation = Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            })
        )

        const fallAnimation = Animated.timing(translateY, {
            toValue: 0,
            duration: 1500,
            delay: 500,
            useNativeDriver: true,
        })

        spinAnimation.start()
        fallAnimation.start()

        return () => {
            clearTimeout(timer)
            spinAnimation.stop()
        }
    }, [authState])

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    })

    const imageStyle = {
        transform: [{ translateY: translateY }],
    }

    const wheelStyle = {
        transform: [{ rotate: spin }],
    }

    return (
        <SafeAreaView className="h-full bg-[#9ccb00]">
                <ScrollView contentContainerStyle={{ height: '100%' }}>
                    <View className="flex-1 items-center justify-center">
                        <Text
                            className={`text-[32px] text-white font-robotobold mb-[54px] ${
                                isVisible ? 'opacity-100' : 'opacity-0'
                            } transition-opacity duration-1000`}
                        >
                            BICITY
                        </Text>

                        <View className="items-center justify-between mb-[54px]">
                            <Animated.Image
                                source={require('../assets/img/corpo.png')}
                                resizeMode="contain"
                                className="h-[100px] w-[100px]"
                                style={[imageStyle, { top: 35, left: 10 }]}
                            />

                            <View className="flex-row items-center justify-between mb-[54px]">
                                <Animated.Image
                                    source={require('../assets/img/roda.png')}
                                    resizeMode="contain"
                                    className="h-[60px] w-[100px]"
                                    style={wheelStyle}
                                />
                                <Animated.Image
                                    source={require('../assets/img/roda.png')}
                                    resizeMode="contain"
                                    className="h-[60px] w-[100px]"
                                    style={wheelStyle}
                                />
                            </View>
                        </View>

                        {isLoading && (
                            <View>
                                <Text>
                                    <ActivityIndicator size="large" color="#fff" />
                                </Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
        </SafeAreaView>
    )
}
