import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'

export default function ViewLayout() {
  return (
    <>
      <Stack>
              <Stack.Screen name='event-view'
                options={{ 
                  headerShown: false,
                }}
                />
      </Stack>
      <StatusBar hidden />
    </>
  )
}
