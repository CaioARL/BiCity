import React, { useEffect, useState } from "react";
import MapView, { Geojson } from "react-native-maps";
import { StyleSheet, View, Text, Button } from "react-native";
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const mapRef = React.useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Carregar dados GeoJSON
      const data = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            id: "way/4331570",
            properties: {
              name: "Rua das Juntas Provisórias",
              id: "way/4331570",
              type: "Ciclofaixa",
            },
            geometry: {
              type: "LineString",
              coordinates: [
                [-46.5993709, -23.6024512],
                [-46.5993227, -23.6023959],
                [-46.5990883, -23.6021271],
              ],
            },
          },
        ],
      };
      setGeoJsonData(data);
    })();
  }, []);

  const handlePress = async () => {
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    mapRef.current.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
  };

  if (errorMsg) {
    return <View style={styles.container}><Text>{errorMsg}</Text></View>;
  }

  if (!location || !geoJsonData) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Geojson 
          geojson={geoJsonData} 
          strokeColor="red" 
          strokeWidth={10} 
        />
      </MapView>
      <Button title="Voltar à Localização Atual" onPress={handlePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: "100%",
    height: "90%",
  },
});