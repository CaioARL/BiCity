import { Stack } from 'expo-router'
import React from 'react'

export default function NavigatorLayout() {
  return (
    <Stack>
            <Stack.Screen name='navigator'
              options={{ 
                headerShown: false,
              }}
            />
    </Stack>
  )
}