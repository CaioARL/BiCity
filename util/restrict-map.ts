import { RefObject } from 'react';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

// Interface para a região do mapa
export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

// Definir os limites geográficos da cidade de São Paulo
export const SAO_PAULO_CITY_BOUNDS = {
  minLatitude: -24.0082,
  maxLatitude: -23.3569,
  minLongitude: -46.8278,
  maxLongitude: -46.3650,
} as const;

// Definir os limites geográficos do estado de São Paulo
export const SAO_PAULO_STATE_BOUNDS = {
  minLatitude: -25.3,
  maxLatitude: -19.7,
  minLongitude: -53.1,
  maxLongitude: -44.1,
} as const;

// Verificar se está dentro dos limites da cidade de São Paulo
export const isWithinSaoPauloCity = (region: Region): boolean => {
  return (
    region.latitude >= SAO_PAULO_CITY_BOUNDS.minLatitude &&
    region.latitude <= SAO_PAULO_CITY_BOUNDS.maxLatitude &&
    region.longitude >= SAO_PAULO_CITY_BOUNDS.minLongitude &&
    region.longitude <= SAO_PAULO_CITY_BOUNDS.maxLongitude
  );
};

// Limites do estado de São Paulo
export const isWithinSaoPauloState = (region: Region): boolean => {
  return (
    region.latitude >= SAO_PAULO_STATE_BOUNDS.minLatitude &&
    region.latitude <= SAO_PAULO_STATE_BOUNDS.maxLatitude &&
    region.longitude >= SAO_PAULO_STATE_BOUNDS.minLongitude &&
    region.longitude <= SAO_PAULO_STATE_BOUNDS.maxLongitude
  );
};

// Função principal para verificar limites com base no modo selecionado
export const isRegionWithinBounds = (
  region: Region, 
  mode: 'city' | 'state' = 'city'
): boolean => {
  return mode === 'city' 
    ? isWithinSaoPauloCity(region)
    : isWithinSaoPauloState(region);
};

// Animar o mapa para a localização atual do usuário
export const animateToUserLocation = (
  mapRef: MapView | null,
  currentLocation: {latitude: number, longitude: number} | null,
  zoomLevel?: { latitudeDelta: number; longitudeDelta: number }
): void => {
  if (!mapRef || !currentLocation) return;
  
  mapRef.animateToRegion({
    latitude: currentLocation.latitude,
    longitude: currentLocation.longitude,
    latitudeDelta: zoomLevel?.latitudeDelta || 0.0043,
    longitudeDelta: zoomLevel?.longitudeDelta || 0.0034,
  });
};

// Função retornar a mensagem apropriada
export const getOutOfBoundsMessage = (
  region: Region,
  mode: 'city' | 'state' = 'city'
): string | null => {
  if (isRegionWithinBounds(region, mode)) {
    return null;
  }
  
  return mode === 'city'
    ? 'Você saiu da área da cidade de São Paulo. Retornando à sua localização.'
    : 'Você saiu da área do estado de São Paulo. Retornando à sua localização.';
};