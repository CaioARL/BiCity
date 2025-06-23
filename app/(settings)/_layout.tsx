import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function SettingsLayout() {
  return (
    <Stack>
        <Stack.Screen
            name='settings'
            options={{headerShown:false}}
        />
        <Stack.Screen
            name='appearance'
            options={{headerShown:false}}
        />
        <Stack.Screen
            name='account'
            options={{headerShown:false}}
        />
    </Stack>
  )
}