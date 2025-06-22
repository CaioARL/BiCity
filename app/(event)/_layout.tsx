import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'

export default function EventLayout() {
  return (
    <>
      <Stack>
              <Stack.Screen name='event-user-menu'
                options={{ 
                  headerShown: false,
                }}
              />
      </Stack>
      <StatusBar style='dark' backgroundColor='#C3FF00' />
    </>
  )
}
