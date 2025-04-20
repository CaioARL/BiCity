import "../global.css";
import React, { useEffect } from 'react';
import { router, SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import AuthProvider from "./context/AuthProvider";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    'Roboto': require('../assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
    'Roboto-Medium': require('../assets/fonts/Roboto-Medium.ttf'),
    'Roboto-Light': require('../assets/fonts/Roboto-Light.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
      <AuthProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(view)" options={{ headerShown: false }} />
          <Stack.Screen name="(event)" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider> 
  );
}