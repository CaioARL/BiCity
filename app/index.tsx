import React, { useEffect, useState, useMemo, useCallback } from "react";
import MapView, { Geojson, Marker, Region } from "react-native-maps";
import { StyleSheet, View, Text, Button, SafeAreaView, ScrollView, TouchableOpacity, Image  } from "react-native";
import * as Location from 'expo-location';
import mapCase from '../data/cicloMapSP.json';

// Define types for GeoJSON data
import { Feature, Geometry, GeoJsonProperties, Position } from 'geojson';

interface GeoJSONFeature extends Feature<Geometry, GeoJsonProperties> {
  properties: {
    type: string;
  };
  geometry: {
    type: "MultiPolygon";
    coordinates: Position[][][];
  };
}

interface GeoJSON {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

interface ProcessedData {
  [key: string]: GeoJSON;
}

interface LocationObject {
  coords: {
    latitude: number;
    longitude: number;
  };
}

// Pré-processamento dos dados do GeoJSON por tipo
const processGeoJSON = (data: GeoJSON) => {
  const processed: ProcessedData = {};
  const types = new Set<string>();
  
  data.features.forEach((feature: GeoJSONFeature) => {
    const type = feature.properties.type;
    types.add(type);
    
    if (!processed[type]) {
      processed[type] = {
        type: "FeatureCollection",
        features: []
      };
    }
    processed[type].features.push(feature);
  });
  
  return { processed, types: Array.from(types) };
};

const { processed: processedData, types: pathTypes } = processGeoJSON(mapCase as GeoJSON);

const App = () => {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<{ [key: string]: boolean }>(
    Object.fromEntries(pathTypes.map(type => [type, true]))
  );
  const mapRef = React.useRef<MapView>(null);

  const pathColors: { [key: string]: string } = {
    "Ciclofaixa": "rgb(5, 150, 105)",
    "Calçada compartilhada": "rgb(231, 111, 81)",
    "Ciclovia": "rgb(233, 196, 106)"
  };

  const initialRegion: Region = {
    latitude: -23.55052,
    longitude: -46.633308,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });
      setLocation(location as LocationObject);
    })();
  }, []);

  const visibleLayers = useMemo(() => 
    Object.entries(selectedTypes)
      .filter(([_, isSelected]) => isSelected)
      .map(([type]) => type),
    [selectedTypes]
  );

  const handlePress = useCallback(async () => {
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced
    });
    setLocation(location as LocationObject);
    
    mapRef.current?.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
  }, []);

  const togglePathType = useCallback((type: string) => {
    setSelectedTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  }, []);

  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }

  if (!location) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        maxZoomLevel={18}
        minZoomLevel={10}
        moveOnMarkerPress={false}
        loadingEnabled={true}
        loadingIndicatorColor="#666666"
        loadingBackgroundColor="#eeeeee"
      >
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="Você está aqui"
          flat={true}
          tracksViewChanges={false}
        />
        
        {visibleLayers.map(type => (
          <Geojson
            key={type}
            geojson={processedData[type]}
            strokeColor={pathColors[type]}
            strokeWidth={2}
            tappable={false}
          />
        ))}
      </MapView>

      <ScrollView 
      
        style={styles.filterContainer}
        showsHorizontalScrollIndicator={false}
      >
       {pathTypes.map(type => (
          <View key={type} style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => togglePathType(type)} style={styles.button}>
              <Text style={[styles.buttonText, { color: selectedTypes[type] ? pathColors[type] : '#666666' }]}>
                {`${type} ${selectedTypes[type] ? '✓' : '✗'}`}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.locationButtonContainer}>
        <TouchableOpacity onPress={handlePress} style={styles.locationButton}>
          <Image
            source={require('../assets/icons/transferir.png')} 
            style={styles.locationIcon}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  filterContainer: {
    position: "absolute",
    bottom: 30,
    left: 4,
    flexDirection: 'column',
    padding: 10,
    backgroundColor: '#0a16323d',
    shadowColor: "#fff",
    elevation: 5,
    borderTopRightRadius: 5, 
    borderBottomRightRadius: 5, 
    borderTopLeftRadius: 0, 
    borderBottomLeftRadius: 0, 
  },
  buttonContainer: {
    marginTop: 4,
    marginBottom: 4,
    cursor: 'pointer',
  },
  button: {
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: '#f2f2f2',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 600,
  },
  locationButtonContainer: {
    position: "absolute", 
    bottom: "5%",          
    right: 20,           
    zIndex: 1,
    width: 50,           
    height: 50,          
  },
  locationButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 25,    
    elevation: 5,
    width: 50,           
    height: 50,          
    justifyContent: 'center', 
    alignItems: 'center',
    opacity: 0.9,
  },
 locationIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff",  
  },
});


export default React.memo(App);