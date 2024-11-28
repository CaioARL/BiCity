import { View, Text, SafeAreaView, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import MapView from 'react-native-maps'

export default function Home() {
  return (
    <SafeAreaView>
        <MapView style={{ width: '100%', height: '100%', }}>
        </MapView>
    </SafeAreaView>
  )
}

