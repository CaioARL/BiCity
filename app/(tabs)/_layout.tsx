import { View, Text, Image } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import icons from '../../constants/icons';
import { TabBar } from '../../components/TabBar'; 

export default function TabsLayout() {
  return (
    <>
      <Tabs
        tabBar={props => <TabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen 
          name="events" 
          options={{
            title: 'Eventos',
          }}
        />
        <Tabs.Screen 
          name="home" 
          options={{
            title: 'Mapa',
          }}
        />
        <Tabs.Screen 
          name="profile" 
          options={{
            title: 'Perfil',
          }}
        />
      </Tabs>
    </>
  );
}