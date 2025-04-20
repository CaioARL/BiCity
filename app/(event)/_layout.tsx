import { Stack } from 'expo-router'
import React from 'react'

export default function EventLayout() {
  return (
    <Stack>
            <Stack.Screen name='event-user-menu'
              options={{ 
                headerShown: false,
              }}
            />
    </Stack>
  )
}
