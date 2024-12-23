import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import icons from '../../constants/icons'
import {TabBar} from '../../components/TabBar';

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
            <Text className={`${focused? '':''} text-xs text-nowrap`}>
                {name}
            </Text>
        </View>
    )
}

export default function TabsLayout() {
  return (
    <>
    <Tabs tabBar={props => <TabBar {...props} />}
        screenOptions={{
            tabBarShowLabel: true,
        }}
    >
        <Tabs.Screen 
            name="events" 
            options={
                {
                    title: 'Eventos',
                    headerShown: false,
                    tabBarIcon: ({color, focused}) => (
                        <TabIcon 
                        icon={icons.icon} 
                        color={color} 
                        name='Events' 
                        focused={focused} />
                    )
                }
            }
        />
        <Tabs.Screen 
            name="mapView" 
            options={
                {
                    title: 'Mapa',
                    headerShown: false,
                    tabBarIcon: ({color, focused}) => (
                        <TabIcon 
                        icon={icons.icon} 
                        color={color} 
                        name='Mapa' 
                        focused={focused} />
                    )
                    
                }
            }
        />
        <Tabs.Screen 
            name="profile" 
            options={
                {
                    title: 'Perfil',
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