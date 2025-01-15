import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, Image, StyleSheet, Animated, ScrollView } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';

interface EventItem {
  eventName: string;
  description: string;
  date: string;
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
  updateEventField: (field: keyof EventItem, value: string) => void;
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

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

  const handleDayPress = (day: any) => {
    updateEventField('date', day.dateString);
    setShowCalendar(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
       <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.modalContainer}>
            <Animated.View style={{ opacity: fadeAnim }}>
              <MapView
                style={{ height: 200, position:'relative' , width: '100%' , marginBottom: 20 }}
                region={mapRegion}
                onRegionChangeComplete={setMapRegion}
                onPress={handleSelectLocation}
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

              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {selectedImage ? (
                  <Image source={{ uri: selectedImage }} style={styles.image} />
                ) : (
                  <>
                    <Ionicons name="image-outline" size={24} color="#333" />
                    <Text style={styles.imageText}>Selecionar Imagem do Evento</Text>
                  </>
                )}
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                placeholder="Nome do Evento"
                value={newEvent.eventName || ''}
                onChangeText={(text) => updateEventField('eventName', text)}
              />

              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder="Descrição do Evento"
                value={newEvent.description || ''}
                onChangeText={(text) => updateEventField('description', text)}
                multiline
              />

              <TouchableOpacity
                style={styles.datePicker}
                onPress={() => setShowCalendar(!showCalendar)}
              >
                <Ionicons name="calendar-outline" size={20} color="#555" />
                <Text style={styles.dateText}>
                  {newEvent.date || 'Selecione a data do evento'}
                </Text>
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
                          }
                        : {}
                        
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

              <Text style={styles.locationText}>Localização Selecionada:</Text>
              <Text>
                {selectedLocation
                  ? `Latitude: ${selectedLocation.latitude}, Longitude: ${selectedLocation.longitude}`
                  : 'Nenhuma localização selecionada'}
              </Text>

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
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 20,
    padding: 20,
  },
  imagePicker: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  imageText: {
    marginTop: 8,
    color: '#333',
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  multilineInput: {
    height: 60,
    textAlignVertical: 'top',
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  dateText: {
    marginLeft: 10,
    color: '#555',
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
  calendarOverlay: {
    marginTop: -5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden'
  },
});

export default EventModal;
