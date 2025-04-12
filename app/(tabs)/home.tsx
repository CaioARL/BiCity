import { View, Text, SafeAreaView } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import MapView, { Circle, Geojson, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useTheme } from '../context/ThemeProvider';
import tailwindConfig from '../../tailwind.config';
import { mapStylesLight, mapStylesDark } from '../../components/mapStyles';
import { Evento, InfraestruturaGeoJson, Problema, RequestCreateProblema, RequestEventoByRadius, RequestInfraestruturaByRadius, RequestProblemaByRadius, } from '../../types';
import { getEventoByRadius } from '../../api/evento';
import LoadingActivity from '../../components/LoadingActivity';
import ButtonModal from '../../components/ButtonModal';
import { getInfraestrutura } from '../../api/infraestrutura';
import { createProblema, getProblemaByRadius } from '../../api/problema';
import ShowAlert from '../../components/ShowAlert';
import ProblemaModal from '../../components/ProblemaModal';
import OpsModalMapView from '../../components/OpsModalMapView';
import AvaliacaoModal from '../../components/AvaliacaoModal';

const colors = (tailwindConfig as any)?.theme?.colors as Record<string, string>;

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface LocationError {
  key: string;
  message: string;
}

export default function Home() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [initialRegion, setInitialRegion] = useState<Region>({
    latitude: -23.556312,
    longitude: -46.637752,
    latitudeDelta: 0.0043,
    longitudeDelta: 0.0034,
  });
  const [currentViewLocation, setCurrentViewLocation] = useState<Region | null>(null);
  const [currentLocationError, setCurrentLocationError] = useState<LocationError | null>(null);
  const [isMoved, setIsMoved] = useState<boolean | undefined>(false);
  const [requestInfraestrutura, setRequestInfraestrutura] = useState<RequestInfraestruturaByRadius>();
  const [infraestrutura, setInfraestrutura] = useState<InfraestruturaGeoJson>();
  const [requestCreateProblema, setRequestCreateProblema] = useState<RequestCreateProblema | null>();
  const [requestProblemas, setRequestProblemas] = useState<RequestProblemaByRadius>();
  const [problemas, setProblemas] = useState<Problema[]>([]);
  const [problemaCoords, setProblemaCoords] = useState<{ latitude: number; longitude: number }>({
    latitude: 0,
    longitude: 0,
  });
  const [showProblemaModal, setShowProblemaModal] = useState<boolean>(false);
  const [showSelectionModal, setShowSelectionModal] = useState<boolean>(false);
  const [showCyclewayModal, setShowCyclewayModal] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController>();
  const [initalLoading, setInitalLoading] = useState<boolean>(true);
  const [isContentLoading, setIsContentLoading] = useState<boolean>(false);
  const [requestEventos, setRequestEventos] = useState<RequestEventoByRadius>();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const locationErrors = {
    PERMISSION: {
      key: 'PERMISSION',
      message: 'Permissão de localização negada, cheque as permissões do aplicativo',
    },
    SERVICE: { key: 'SERVICE', message: 'Serviço de localização desativado' },
    ERROR: { key: 'ERROR', message: 'Erro ao obter localização' },
  };

  const emptyGeoJson: InfraestruturaGeoJson = {
    type: 'FeatureCollection',
    features: [],
  };

  const getCurrentLocation = async (): Promise<void> => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setCurrentLocationError(locationErrors.PERMISSION);
      return;
    }
    await Location.hasServicesEnabledAsync()
      .then((response) => {
        if (!response) {
          setCurrentLocationError(locationErrors.SERVICE);
        } else {
          setCurrentLocationError(null);
        }
      })
      .catch((error) => {
        setErrorMessage('Erro ao checar serviço de localização: ' + error);
      });

    await Location.getCurrentPositionAsync({})
      .then((response) => {
        setCurrentLocation(response);
        setRequestInfraestrutura({
          latitude: response.coords.latitude,
          longitude: response.coords.longitude,
          raio: 750,
        });
        setRequestProblemas({
          latitude: response.coords.latitude,
          longitude: response.coords.longitude,
          raio: 7000,
        });
        setRequestEventos({
          latitude: response.coords.latitude,
          longitude: response.coords.longitude,
          raio: 7000,
        });
        setInitialRegion({
          latitude: response.coords.latitude,
          longitude: response.coords.longitude,
          latitudeDelta: 0.0043,
          longitudeDelta: 0.0034,
        });
        initalLoading && setInitalLoading(false);
      })
      .catch((error) => {
        setCurrentLocationError(locationErrors.ERROR);
        setErrorMessage('Erro ao obter localização: ' + error);
      });
  };

  useEffect(() => {
    if (!currentLocation) {
      getCurrentLocation();
    }
    const interval = setInterval(getCurrentLocation, 120000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!requestEventos) return;
    getEventoByRadius(requestEventos, null)
      .then((response) => {
        setEventos(response);
      })
      .catch((response) => {
        setErrorMessage('Erro ao carregar eventos: ' + response.message);
      })
      .finally(() => {
        console.log('Terminou a requisição de eventos');
        isContentLoading && setIsContentLoading(false);
      });
  }, [requestEventos]);

  useEffect(() => {
    if (!requestProblemas) return;
    getProblemaByRadius(requestProblemas, null)
      .then((response) => {
        setProblemas(response);
      })
      .catch((response) => {
        setErrorMessage('Erro ao carregar problemas: ' + response.message);
      })
      .finally(() => {
        console.log('Terminou a requisição de problemas');
        isContentLoading && setIsContentLoading(false);
      });
  }, [requestProblemas]);

  useEffect(() => {
    if (!requestInfraestrutura) return;
    getInfraestrutura(requestInfraestrutura, null)
      .then((response) => {
        setInfraestrutura(response);
      })
      .catch((response) => {
        setErrorMessage('Erro ao carregar infraestrutura: ' + response.message);
      })
      .finally(() => {
        console.log('Terminou a requisição de infraestrutura');
        isContentLoading && setIsContentLoading(false);
      });
  }, [requestInfraestrutura]);

  const getEventsOnViewLocation = () => {
    abortControllerRef.current?.abort();
    if (!currentViewLocation) return;
    setIsContentLoading(true);
    setRequestInfraestrutura({
      latitude: currentViewLocation.latitude,
      longitude: currentViewLocation.longitude,
      raio: 750,
    });
    setRequestProblemas({
      latitude: currentViewLocation.latitude,
      longitude: currentViewLocation.longitude,
      raio: 7000,
    });
    setRequestEventos({
      latitude: currentViewLocation.latitude,
      longitude: currentViewLocation.longitude,
      raio: 7000,
    });
  };

  useEffect(() => {
    if (!requestCreateProblema) return;
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    setIsContentLoading(true);
    createProblema(requestCreateProblema, abortControllerRef.current)
      .then((response) => {
        setSuccessMessage('Problema criado com sucesso');
      })
      .catch((response) => {
        setErrorMessage('Erro ao criar problema: ' + response.message);
      })
      .finally(() => {
        setIsContentLoading(false);
        setRequestCreateProblema(null);
      });
  }, [requestCreateProblema]);

  // Raio da Terra em metros
  const isPointNearLine = (
    point: { latitude: number; longitude: number },
    coordinates: [number, number][],
    toleranceMeters: number = 5
  ): boolean => {
    const earthRadius = 6371000; 

    for (let i = 0; i < coordinates.length - 1; i++) {
      const start = { lng: coordinates[i][0], lat: coordinates[i][1] };
      const end = { lng: coordinates[i + 1][0], lat: coordinates[i + 1][1] };
      const pointCoord = { lng: point.longitude, lat: point.latitude };

      // Converter para radianos
      const lat1 = (start.lat * Math.PI) / 180;
      const lon1 = (start.lng * Math.PI) / 180;
      const lat2 = (end.lat * Math.PI) / 180;
      const lon2 = (end.lng * Math.PI) / 180;
      const latP = (pointCoord.lat * Math.PI) / 180;
      const lonP = (pointCoord.lng * Math.PI) / 180;

      // Calcular distâncias usando fórmula de Haversine
      const dLat1 = latP - lat1;
      const dLon1 = lonP - lon1;
      const a1 = Math.sin(dLat1 / 2) ** 2 + Math.cos(lat1) * Math.cos(latP) * Math.sin(dLon1 / 2) ** 2;
      const c1 = 2 * Math.atan2(Math.sqrt(a1), Math.sqrt(1 - a1));
      const distToStart = earthRadius * c1;

      const dLat2 = latP - lat2;
      const dLon2 = lonP - lon2;
      const a2 = Math.sin(dLat2 / 2) ** 2 + Math.cos(lat2) * Math.cos(latP) * Math.sin(dLon2 / 2) ** 2;
      const c2 = 2 * Math.atan2(Math.sqrt(a2), Math.sqrt(1 - a2));
      const distToEnd = earthRadius * c2;

      // Calcular distância perpendicular do ponto ao segmento de linha
      const A = pointCoord.lat - start.lat;
      const B = pointCoord.lng - start.lng;
      const C = end.lat - start.lat;
      const D = end.lng - start.lng;

      const dot = A * C + B * D;
      const lenSq = C * C + D * D;
      const param = lenSq !== 0 ? dot / lenSq : -1;

      let xx, yy;
      if (param < 0) {
        xx = start.lat;
        yy = start.lng;
      } else if (param > 1) {
        xx = end.lat;
        yy = end.lng;
      } else {
        xx = start.lat + param * C;
        yy = start.lng + param * D;
      }

      const dLatP = ((pointCoord.lat - xx) * Math.PI) / 180;
      const dLonP = ((pointCoord.lng - yy) * Math.PI) / 180;
      const aP =
        Math.sin(dLatP / 2) ** 2 +
        Math.cos((pointCoord.lat * Math.PI) / 180) * Math.cos((xx * Math.PI) / 180) * Math.sin(dLonP / 2) ** 2;
      const cP = 2 * Math.atan2(Math.sqrt(aP), Math.sqrt(1 - aP));
      const distance = earthRadius * cP;

      if (distance <= toleranceMeters) {
        return true;
      }
    }
    return false;
  };

  const isPointInCiclovia = (point: { latitude: number; longitude: number }): boolean => {
    if (!infraestrutura || !infraestrutura.features.length) return false;

    for (const feature of infraestrutura.features) {
      if (feature.geometry.type === 'LineString') {
        const coordinates = feature.geometry.coordinates as [number, number][];
        if (isPointNearLine(point, coordinates)) {
          return true;
        }
      } else if (feature.geometry.type === 'MultiLineString') {
        const multiCoordinates = feature.geometry.coordinates as [number, number][][];
        for (const coords of multiCoordinates) {
          if (isPointNearLine(point, coords)) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const pressionado = (latitude: number, longitude: number) => {
    const point = { latitude, longitude };
    const isInCiclovia = isPointInCiclovia(point);
    if (isInCiclovia) {
      setProblemaCoords({ latitude, longitude });
      setShowSelectionModal(true);
    } else {
      setErrorMessage('Ação disponível apenas dentro de ciclovias');
    }
  };

  const handleCyclewayRating = (rating: any) => {
    if (!rating) {
      setShowCyclewayModal(false);
      return;
    }
    // TODO: Add API call to submit the rating
    console.log('Submitting cycleway rating:', rating);
    setSuccessMessage('Avaliação enviada com sucesso!');
    setShowCyclewayModal(false);
  };

  if (initalLoading) return <LoadingActivity />;

  return (
    <SafeAreaView className={isDarkMode ? 'bg-gray-900' : 'bg-white'} style={{ flex: 1 }}>
      <MapView
        style={{ width: '100%', height: '100%' }}
        provider={PROVIDER_GOOGLE}
        customMapStyle={isDarkMode ? mapStylesDark : mapStylesLight}
        onRegionChange={setCurrentViewLocation}
        mapPadding={{ top: 0, right: 0, bottom: 100, left: 0 }}
        initialRegion={initialRegion}
        showsUserLocation={true}
        onPress={(e) => {
          console.log('Press ', e.nativeEvent.coordinate);
        }}
        onLongPress={(e) => {
          console.log('Long Press', e.nativeEvent.coordinate);
          pressionado(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude);
        }}
        onRegionChangeComplete={(e, { isGesture }) => {
          setIsMoved(isGesture);
        }}
      >
        {eventos.map((evento) => (
          <View key={evento.id}>
            <Circle
              fillColor={
                evento.gratuito
                  ? isDarkMode
                    ? 'rgba(195, 255, 0, 0.2)'
                    : 'rgba(195, 255, 0, 0.2)'
                  : isDarkMode
                  ? 'rgba(192, 170, 129, 0.2)'
                  : 'rgba(192, 170, 129, 0.2)'
              }
              strokeColor={
                evento.gratuito
                  ? isDarkMode
                    ? 'rgba(195, 255, 0, 0.5)'
                    : 'rgba(195, 255, 0, 0.5)'
                  : isDarkMode
                  ? 'rgba(192, 170, 129, 0.5)'
                  : 'rgba(192, 170, 129, 0.5)'
              }
              center={evento.endereco}
              radius={evento.faixaKm * 100}
              strokeWidth={2}
            />
            <Marker
              key={evento.id}
              coordinate={evento.endereco}
              title={evento.nome}
              image={
                evento.gratuito
                  ? require('../../assets/pins/pin_free_evento.png')
                  : require('../../assets/pins/pin_paid_evento.png')
              }
            />
          </View>
        ))}

        {problemas.map((problema) => (
          <Marker
            key={problema.id}
            coordinate={problema}
            title={problema.descricao}
            image={
              problema.tipoProblema.id === 1
                ? require('../../assets/pins/pin_problema_tipo_1.png')
                : problema.tipoProblema.id === 2
                ? require('../../assets/pins/pin_problema_tipo_2.png')
                : problema.tipoProblema.id === 3
                ? require('../../assets/pins/pin_problema_tipo_3.png')
                : problema.tipoProblema.id === 4
                ? require('../../assets/pins/pin_problema_tipo_4.png')
                : problema.tipoProblema.id === 5
                ? require('../../assets/pins/pin_problema_tipo_5.png')
                : problema.tipoProblema.id === 6
                ? require('../../assets/pins/pin_problema_tipo_6.png')
                : problema.tipoProblema.id === 7
                ? require('../../assets/pins/pin_problema_tipo_7.png')
                : problema.tipoProblema.id === 8
                ? require('../../assets/pins/pin_problema_tipo_8.png')
                : require('../../assets/pins/pin_problema_tipo_1.png')
            }
          />
        ))}

        <Geojson
          geojson={infraestrutura || emptyGeoJson}
          strokeColor={isDarkMode ? 'rgba(255, 99, 71, 0.5)' : 'rgba(255, 0, 0, 0.35)'}
          strokeWidth={10}
        />
      </MapView>

      {currentLocationError && (
        <View
          className={`items-center justify-center h-[200px] w-[100%] absolute top-[50%] rounded-[100px] ${
            isDarkMode ? 'bg-gray-800' : 'bg-primary_green'
          }`}
        >
          <Text
            className={`text-xl ${
              isDarkMode ? 'color-white' : 'color-color_lightGray'
            }`}
          >
            {currentLocationError.message}
          </Text>
          {currentLocationError.key === 'SERVICE' && (
            <ButtonModal
              title="Tentar Novamente"
              handlePress={getCurrentLocation}
              customStyles={`w-[200px] h-[50px] px-4 py-2 rounded-[8px] ${
                isDarkMode ? 'bg-green-700 border-[1px] border-green-500' : 'bg-primary_green_light border-[1px] border-green-300'
              }`}
              textStyles={`text-center ${isDarkMode ? 'color-white' : 'color-black'}`}
            />
          )}
        </View>
      )}

      {isMoved && (
        <View className="items-center justify-center h-[50%] w-[100%] absolute top-[-20%]">
          <ButtonModal
            title="Achar Eventos Próximos"
            handlePress={getEventsOnViewLocation}
            textStyles={`text-center ${isDarkMode ? 'color-white' : 'color-black'}`}
            customStyles={`min-w-[200px] min-h-[50px] px-4 py-2 rounded-[8px] ${
              isDarkMode ? 'bg-green-700 border-[1px] border-green-500' : 'bg-primary_green_light border-[1px] border-green-300'
            }`}
          />
        </View>
      )}

      {isContentLoading && <LoadingActivity />}

      {successMessage && (
        <ShowAlert
          message={successMessage}
          type="success"
          onClose={() => setSuccessMessage(null)}
        />
      )}

      {errorMessage && (
        <ShowAlert
          message={errorMessage}
          type="error"
          onClose={() => setErrorMessage(null)}
        />
      )}

      {showSelectionModal && (
        <OpsModalMapView
          coords={problemaCoords}
          visible={showSelectionModal}
          onClose={() => setShowSelectionModal(false)}
          onSelectProblem={() => {
            setShowSelectionModal(false);
            setShowProblemaModal(true);
          }}
          onSelectCycleway={() => {
            setShowSelectionModal(false);
            setShowCyclewayModal(true);
          }}
        />
      )}

      {showProblemaModal && (
        <ProblemaModal
          coords={problemaCoords}
          visible={showProblemaModal}
          closeModal={(e) => {
            setRequestCreateProblema(e);
            setShowProblemaModal(false);
          }}
        />
      )}

      {showCyclewayModal && (
        <AvaliacaoModal
          coords={problemaCoords}
          visible={showCyclewayModal}
          closeModal={handleCyclewayRating}
        />
      )}
    </SafeAreaView>
  );
}