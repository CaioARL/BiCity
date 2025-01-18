import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, Animated, ScrollView } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';

interface EventItem {
  eventName: string;
  description: string;
  date: string;
  isFree: boolean;
  address?: string;
  cep?: string;
  routeDistance?: string;
}

interface EventModalProps {
  visible: boolean;
  onClose: () => void;
  mapRegion: any;
  setMapRegion: (region: any) => void;
  selectedLocation: { latitude: number; longitude: number } | null;
  handleSelectLocation: (e: any) => void;
  selectedImage: string | null;
  pickImage: () => void;
  newEvent: Partial<EventItem>;
  updateEventField: (field: keyof EventItem, value: string | boolean) => void;
  resetForm: () => void;
  handleSaveEvent: () => void;
}

const EventModal: React.FC<EventModalProps> = ({
  visible,
  onClose,
  mapRegion,
  setMapRegion,
  selectedLocation,
  handleSelectLocation,
  selectedImage,
  pickImage,
  newEvent,
  updateEventField,
  resetForm,
  handleSaveEvent,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showCalendar, setShowCalendar] = useState(false);
  const [showEventTypeOptions, setShowEventTypeOptions] = useState(false);
  const [filterEventType, setFilterEventType] = useState('all');
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [houseNumber, setHouseNumber] = useState('');

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();

      // Reset house number and selected location when modal opens
      setHouseNumber('');
      handleSelectLocation({ nativeEvent: { coordinate: { latitude: -23.55052, longitude: -46.633308 } } }); // Reset selected location to default
      setMapRegion({
        latitude: -23.55052, // Default latitude
        longitude: -46.633308, // Default longitude
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

  const handleMapPress = async (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    handleSelectLocation(e);
  
    try {
      setIsLoadingAddress(true);
      setAddressError('');
      setHouseNumber(''); // Reset house number when new location is selected
      
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`
      );
  
      if (response.data.results.length > 0) {
        const address = response.data.results[0];
        
        const postalCode = address.address_components.find(
          (component: any) => component.types.includes('postal_code')
        );
  
        if (postalCode) {
          const cep = postalCode.long_name.replace(/\D/g, '');
          updateEventField('cep', cep);
        }
  
        updateEventField('address', address.formatted_address);
      }
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      setAddressError('Erro ao buscar endereço. Tente novamente.');
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const searchAddress = async (cep: string) => {
    if (cep.length !== 8) return;

    try {
      setIsLoadingAddress(true);
      setAddressError('');
      setHouseNumber(''); // Reset house number when new CEP is searched

      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      
      if (response.data.erro) {
        setAddressError('CEP não encontrado');
        return;
      }

      const address = `${response.data.logradouro}, ${response.data.bairro}, ${response.data.localidade} - ${response.data.uf}`;
      updateEventField('address', address);

      const geocodeResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=YOUR_GOOGLE_MAPS_API_KEY`
      );

      if (geocodeResponse.data.results.length > 0) {
        const location = geocodeResponse.data.results[0].geometry.location;
        handleSelectLocation({
          nativeEvent: {
            coordinate: {
              latitude: location.lat,
              longitude: location.lng
            }
          }
        });

        setMapRegion({
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    } catch (error) {
      console.error('Error searching address:', error);
      setAddressError('Erro ao buscar endereço. Tente novamente.');
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const handleDayPress = (day: any) => {
    updateEventField('date', day.dateString);
    setShowCalendar(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <ScrollView>
          <View style={styles.modalContainer}>
            <Animated.View style={{ opacity: fadeAnim }}>
               {/* Mapa do Evento */}
               <View style={{ marginBottom: 2 }}>
                <MapView
                  style={{ height: 200, width: '100%', marginBottom: 20 }}
                  region={mapRegion}
                  onRegionChangeComplete={setMapRegion}
                  onPress={handleMapPress}
                >
                  {selectedLocation && (
                    <>
                      <Circle
                        center={{
                          latitude: selectedLocation.latitude,
                          longitude: selectedLocation.longitude,
                        }}
                        radius={100} // Raio em metros
                        fillColor="rgba(195, 255, 0, 0.2)" // Cor do preenchimento com transparência
                        strokeColor="rgba(195, 255, 0, 0.8)" // Cor da borda
                        strokeWidth={2}
                      />
                      <Marker
                        coordinate={{
                          latitude: selectedLocation.latitude,
                          longitude: selectedLocation.longitude,
                        }}
                        title="Local Selecionado"
                        description="Este é o local que você selecionou"
                        image={require('../assets/splash-icon.png')}
                      />
                    </>
                  )}
                </MapView>

                <Text>Selecione o local do evento:</Text>
                <Text>1. Clique no mapa para selecionar o local, ou</Text>
                <Text>2. Digite o CEP abaixo:</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Digite o CEP"
                  value={newEvent.cep || ''}
                  onChangeText={(text) => {
                    const cep = text.replace(/\D/g, '');
                    updateEventField('cep', cep);
                    if (cep.length === 8) {
                      searchAddress(cep);
                    }
                  }}
                  maxLength={8}
                  keyboardType="numeric"
                />

                {isLoadingAddress && <Text>Buscando endereço...</Text>}
                {addressError ? (
                  <Text style={{ color: 'red' }}>{addressError}</Text>
                ) : null}

                <TextInput
                  style={styles.input}
                  placeholder="Endereço completo"
                  value={newEvent.address || ''}
                  editable={false}
                  multiline
                />

                <TextInput
                  style={styles.input}
                  placeholder="Número"
                  value={houseNumber}
                  onChangeText={(text) => {
                    setHouseNumber(text);
                    if (newEvent.address) {
                      const addressParts = newEvent.address.split(',');
                      addressParts[0] = `${addressParts[0].split(',')[0]}, ${text}`;
                      updateEventField('address', addressParts.join(','));
                    }
                  }}
                  keyboardType="numeric"
                />
              </View>
              
              {/* Descrição do Evento */}
              <View style={{ marginBottom: 2 }}>
                <Text style={styles.title}>Descrição</Text>
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  placeholder="Descrição do Evento..."
                  value={newEvent.description || ''}
                  onChangeText={(text) => updateEventField('description', text)}
                  multiline
                />
              </View>

              {/* Event Type Filter */}
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.title}>Tipo de Evento</Text>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    padding: 10,
                  }}
                  onPress={() => setShowEventTypeOptions(!showEventTypeOptions)}
                >
                  <Text style={{ color: '#555', flex: 1 }}>
                    {filterEventType === 'all' ? 'Todos' : filterEventType === 'paid' ? 'Pago' : 'Gratuito'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#555" />
                </TouchableOpacity>

                {/* Dropdown Menu */}
                {showEventTypeOptions && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 70,
                      left: 0,
                      right: 0,
                      borderWidth: 1,
                      borderColor: '#ddd',
                      borderRadius: 8,
                      marginTop: 10,
                      padding: 10,
                      backgroundColor: 'white',
                      zIndex: 10,
                    }}
                  >
                    {['all', 'paid', 'free'].map((type) => (
                      <TouchableOpacity key={type}
                        onPress={() => {
                          setFilterEventType(type);
                          setShowEventTypeOptions(false);
                        }}
                        style={{ padding: 10 }}
                      >
                        <Text style={{ color: '#555', textTransform: 'capitalize' }}>
                          {type === 'all' ? 'Todos' : type === 'paid' ? 'Pago' : 'Gratuito'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              
              {/* Route Distance */}
              <TextInput
                style={styles.input}
                placeholder="Tamanho do Percurso (km)"
                value={newEvent.routeDistance || ''}
                onChangeText={(text) => updateEventField('routeDistance', text)}
                keyboardType="numeric"
              />

              {/* Free/Paid Selection */}
              <View style={styles.priceTypeContainer}>
                <Text style={styles.title}>O evento é gratuito ou pago?</Text>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                  <TouchableOpacity
                    style={[
                      styles.priceTypeButton,
                      newEvent.isFree === true && styles.priceTypeButtonActive
                    ]}
                    onPress={() => updateEventField('isFree', true)}
                  >
                    <Ionicons 
                      name={newEvent.isFree === true ? "checkmark-circle" : "square-outline"} 
                      size={20} 
                      color={newEvent.isFree === true ? "#C3FF00" : "#333"} 
                    />
                    <Text style={styles.priceTypeButtonText}>Gratuito</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.priceTypeButton,
                      newEvent.isFree === false && styles.priceTypeButtonActive
                    ]}
                    onPress={() => updateEventField('isFree', false)}
                  >
                    <Ionicons 
                      name={newEvent.isFree === false ? "checkmark-circle" : "square-outline"} 
                      size={20} 
                      color={newEvent.isFree === false ? "#C3FF00" : "#333"} 
                    />
                    <Text style={styles.priceTypeButtonText}>Pago</Text>
                  </TouchableOpacity>
                </View>
              </View>
        
              {/* Calendario */} 
              <View style={{ marginBottom: 20 }}>
                <TouchableOpacity style={styles.datePicker} onPress={() => setShowCalendar(!showCalendar)}>
                  <Text style={styles.dateText}>
                    {newEvent.date || 'Selecione a data do evento'}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#555" />
                </TouchableOpacity>

                {showCalendar && (
                  <View style={styles.calendarOverlay}>
                    <Calendar
                      minDate={new Date().toISOString().split('T')[0]}
                      markedDates={
                        newEvent.date
                          ? {
                              [newEvent.date]: {
                                selected: true,
                                selectedColor: '#C3FF00',
                                selectedTextColor: '#000',
                              },
                            }: {}
                      }
                      onDayPress={handleDayPress}
                      theme={{
                        selectedDayBackgroundColor: '#C3FF00',
                        todayTextColor: '#C3FF00',
                        arrowColor: '#C3FF00',
                      }}
                    />
                  </View>
                )}
              </View>
              
              <View style={{ marginBottom: 20 }}>
                <Text style={styles.locationText}>Localização Selecionada:</Text>
                <Text>
                  {selectedLocation
                    ? `Latitude: ${selectedLocation.latitude}, Longitude: ${selectedLocation.longitude}`
                    : 'Nenhuma localização selecionada'}
                </Text>
              </View>
              
              {/* Botões Cancelar e Salvar */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={resetForm} style={styles.cancelButton}>
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSaveEvent}
                  disabled={!selectedLocation || !newEvent.eventName || !newEvent.description || !newEvent.date}
                  style={[
                    styles.saveButton,
                    {
                      backgroundColor:
                        !selectedLocation || !newEvent.eventName || !newEvent.description || !newEvent.date
                          ? '#CCC'
                          : '#C3FF00',
                    },
                  ]}
                >
                  <Text style={styles.buttonText}>Salvar Evento</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16, 
    marginBottom: 5,
    color: '#555',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 20,
    padding: 20,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  datePicker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    marginLeft: 10,
    color: '#555',
  },
  calendarOverlay: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden'
  },
  priceTypeContainer: {},
  priceTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  priceTypeButtonActive: {},
  priceTypeButtonText: {
    fontSize: 16,
    marginLeft: 10,
  },
  locationText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
  saveButton: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default EventModal;