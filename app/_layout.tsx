import "../global.css";
import React, { useEffect } from 'react';
import { router, SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import AuthProvider from "./context/AuthProvider";
import { ThemeProvider } from './context/ThemeProvider';
import { TabBarProvider } from '../app/context/TabBarContext';
import DarkMode from '../components/DarkMode';

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
    <ThemeProvider>
      <AuthProvider>
      <TabBarProvider> 
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
        {/* DarkMode Global*/}
        <DarkMode /> 
        </TabBarProvider>
      </AuthProvider> 
    </ThemeProvider>
  );
}