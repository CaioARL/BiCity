import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import icons from '../../constants/icons'


interface TabIconProps {
    icon: any;
    color: string;
    name: string;
    focused: boolean;
}

const TabIcon = ({icon, color, name, focused}: TabIconProps) => {
    return (
        <View className='items-center justify-center gap-2'>
            <Image 
                source={icon}
                resizeMode='contain'
                tintColor={color}
                className='w-6 h-6'
            />
            <Text className={`${focused? '':''} text-xs`}>
                {name}
            </Text>
        </View>
    )
}

export default function TabsLayout() {
  return (
    <>
    <Tabs
        screenOptions={{
            tabBarShowLabel: false,
        }}
    >
        <Tabs.Screen 
            name="home" 
            options={
                {
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({color, focused}) => (
                        <TabIcon 
                        icon={icons.icon} 
                        color={color} 
                        name='Home' 
                        focused={focused} />
                    )
                    
                }
            }
        />
        <Tabs.Screen 
            name="profile" 
            options={
                {
                    title: 'Profile',
                    headerShown: false,
                    tabBarIcon: ({color, focused}) => (
                        <TabIcon 
                        icon={icons.icon} 
                        color={color} 
                        name='Profile' 
                        focused={focused} />
                    )
                }
            }
        />
    </Tabs>
    </>
  )
}