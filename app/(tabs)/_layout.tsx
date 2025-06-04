import React from 'react';
import { Tabs } from 'expo-router';
import { TabBar } from '../../components/TabBar'; 
import { StatusBar } from 'expo-status-bar';

export default function TabsLayout() {
  return (
    <>
      <Tabs
        tabBar={props => <TabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
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
    <StatusBar style='dark' backgroundColor='#C3FF00' />

    </>
  );
}