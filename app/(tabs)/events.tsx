import { View, Text, FlatList, ImageBackground, TouchableOpacity, TextInput, Image, Modal, Button } from 'react-native';
import React, { useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons, Feather } from "@expo/vector-icons";
import CustomEvents from '../../components/CustomEvents';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider  from '@react-native-community/slider';

interface EventItem {
  id: string;
  nameUser: string;
  userImage: string;
  eventName: string;
  description: string;
  date: string;
  image: string;
  location: string;
  status: string;
  isPast?: boolean;
}
// Versão original
//type FilterType = "Todos" | "Ativos" | "Realizados" | "Pendentes";

type FilterType = "Ativos" | "Realizados" ;

const nearbyPlaces: EventItem[] = [
  {
    id: "1",
    nameUser:  "Banco Itau",
    userImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEC3xi3ITmg6ExgDPUiR_5dvX90EuMAnK8eg&s",
    eventName: "Evento de Networking",
    location: "São Paulo, Brasil",
    description: "Um evento para conectar profissionais da área financeira com bicicletas.",
    date: "21/12/2024",
    image: "https://s5.static.brasilescola.uol.com.br/be/2022/10/vista-floresta-amazonica.jpg",
    status: "Aprovado",
  },
  {
    id: "2",
    nameUser:  "Banco Santander",
    userImage: "https://img.freepik.com/fotos-gratis/mulher-vai-trabalhar-de-bicicleta_23-2149443039.jpg",
    eventName: "Evento de Networking",
    description: "Um evento para conectar profissionais da área financeira.",
    date: "2023-09-30",
    image: "https://s5.static.brasilescola.uol.com.br/be/2022/10/vista-floresta-amazonica.jpg",
    location: "Lahore, Pakistan",
    status: "Realizado",
  },
  {
    id: "3",
    nameUser: "Banco do Brasil",
    userImage: "https://img.freepik.com/fotos-gratis/mulher-vai-trabalhar-de-bicicleta_23-2149443039.jpg",
    eventName: "Evento de Avaliação",
    description: "Aguardando avaliação.",
    date: "2023-10-15",
    image: "https://s5.static.brasilescola.uol.com.br/be/2022/10/vista-floresta-amazonica.jpg",
    location: "Rio de Janeiro, Brasil",
    status: "Aguardando",
  },
  {
    id: "4",
    nameUser:  "Banco do Brasil",
    userImage: "https://img.freepik.com/fotos-gratis/mulher-vai-trabalhar-de-bicicleta_23-2149443039.jpg",
    eventName: "2Evento de Lançamento",
    description: "Evento de lançamento de produto.",
    date: "2023-11-01",
    image: "https://s5.static.brasilescola.uol.com.br/be/2022/10/vista-floresta_amazonica.jpg",
    location: "São Paulo, Brasil",
    status: "Aprovado",
  },
  {
    id: "5",
    nameUser:  "Banco B2B",
    userImage: "https://img.freepik.com/fotos-gratis/mulher-vai-trabalhar-de-bicicleta_23-2149443039.jpg",
    eventName: "3 Evento de Lançamento",
    description: "Evento de lançamento de produto.",
    date: "2025-30-2025",
    image: "https://s5.static.brasilescola.uol.com.br/be/2022/10/vista-floresta_amazonica.jpg",
    location: "São Paulo, Brasil",
    status: "Aprovado",
  },
  // ... other events remain the same ...
];

export default function Events() {
  const [filter, setFilter] = useState<FilterType>("Ativos");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<EventItem>>({});
  // New filter states
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterDistance, setFilterDistance] = useState(10);
  const [filterDateStart, setFilterDateStart] = useState('');
  const [filterDateEnd, setFilterDateEnd] = useState('');
  const [filterEventType, setFilterEventType] = useState('all'); 
  const [showEventTypeOptions, setShowEventTypeOptions] = useState(false);

  const [mapRegion, setMapRegion] = useState({
    latitude: -23.55052,
    longitude: -46.633308,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [selectedLocation, setSelectedLocation] = useState< { latitude: number , longitude: number} | null>({ latitude: 0, longitude: 0 });
  const [modalVisible, setModalVisible] = useState(false);

  

  const getFilteredEvents = () => {
    const currentDate = new Date();

    return nearbyPlaces.filter((event) => {
      const eventDate = new Date(event.date);
      const isSearchMatch =
        event.eventName.toLowerCase().includes(searchText.toLowerCase()) ||
        event.description.toLowerCase().includes(searchText.toLowerCase()) ||
        event.nameUser.toLowerCase().includes(searchText.toLowerCase());

        // Versão original
      // switch (filter) {
      //   case "Ativos":
      //     const thirtyDaysAgo = new Date();
      //     thirtyDaysAgo.setDate(currentDate.getDate() - 1);
      //     return eventDate >= thirtyDaysAgo && event.status === "Aprovado" && isSearchMatch;
      //   case "Pendentes":
      //     return eventDate < currentDate && event.status === "Aguardando" && isSearchMatch;
      //   case "Realizados":
      //     return eventDate < currentDate && event.status === "Realizado" && isSearchMatch;
      //   case "Todos":
      //   default:
      //     return isSearchMatch;
      // }
      switch (filter) {
          case "Ativos":
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(currentDate.getDate() - 1);
            return eventDate >= thirtyDaysAgo && event.status === "Aprovado" && isSearchMatch;
          case "Realizados":
            return eventDate < currentDate && event.status === "Realizado" && isSearchMatch;
            return isSearchMatch;
        }
    }).map(event => ({
      ...event,
      isPast: new Date(event.date) < currentDate
    }));
  };
  
  // Função para formatar a data
  const formatDateInput = (input : any) => {
    // Remove todos os caracteres que não são dígitos
    const numbers = input.replace(/\D/g, '');

    // Formata a data no formato dd/MM/yyyy
    const day = numbers.slice(0, 2);
    const month = numbers.slice(2, 4);
    const year = numbers.slice(4, 8);

    if (numbers.length < 2) return day;
    if (numbers.length < 4) return `${day}/${month}`;
    return `${day}/${month}/${year}`;
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setNewEvent(prev => ({
        ...prev,
        image: result.assets[0].uri
      }));
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const handleSave = (item: EventItem) => {
    console.log('Evento salvo:', item.eventName);
  };

  // const handleShare = (item: EventItem) => {
  //   console.log('Evento compartilhado:', item.eventName);
  // };

  // const handleFavorite = (item: EventItem) => {
  //   console.log('Evento favoritado:', item.eventName);
  // };

  const handleAddEvent = () => {
    setModalVisible(true);
    setNewEvent({});
  };

  const handleSelectLocation = (e: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const handleSaveEvent = () => {
    if (selectedLocation && newEvent.eventName && newEvent.description && newEvent.date) {
      const eventToSave: EventItem = {
        id: (nearbyPlaces.length + 1).toString(),
        nameUser: newEvent.nameUser || "Novo Usuário",
        userImage: newEvent.userImage || "https://via.placeholder.com/100",
        eventName: newEvent.eventName,
        description: newEvent.description,
        date: newEvent.date,
        image: selectedImage || 'https://via.placeholder.com/300',
        location: `${selectedLocation.latitude}, ${selectedLocation.longitude}`,
        status: "Aprovado"
      };

      nearbyPlaces.push(eventToSave);
      resetForm();
    }
  };

  const resetForm = () => {
    setModalVisible(false);
    setNewEvent({});
    setSelectedImage(null);
    setSelectedLocation(null);
  };

  const updateEventField = (field: keyof EventItem, value: string) => {
    setNewEvent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <SafeAreaView>
      <View className='container' style={{ backgroundColor: 'white' }}>

        {/* Perfil, busca e filtro */}
        
        <View style={CustomEvents.evento}>
          <View style={CustomEvents.location}>
            <Image
              source={{ uri: 'https://img.freepik.com/fotos-gratis/mulher-vai-trabalhar-de-bicicleta_23-2149443039.jpg' }}
              style={CustomEvents.userImage}
            />

            <View style={{ flexDirection: 'column' }}>
              <Text style={CustomEvents.locationText}>USERNAME</Text>
              <View style={{ flexDirection: 'row' }}>
                <Feather name="map-pin" size={18} color="#555" style={{marginLeft: 2}}/>
                <Text style={CustomEvents.locationText}>LOCATION</Text>
                {/* <Feather name="chevron-down" size={18} color="#555" /> */} 
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Ionicons name="star-half-outline" size={18} color="#ffcc00" style={{marginLeft: 2}}/> 
                <Text style={CustomEvents.nivelText}>Initiciante</Text>   
              </View>
            </View>
          </View>

          <View style={CustomEvents.searchBox}>
            <Ionicons name="search-outline" size={20} color="#555"/>
            <TextInput
              placeholder="Where do you wanna go?"
              style={CustomEvents.input}
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
                <Ionicons name="options-outline" size={20} color="#555" />
              </TouchableOpacity>
          </View>

          <View style={CustomEvents.filterContainer}>
            {["Ativos",  "Realizados"].map((item) => (
              <TouchableOpacity 
                key={item} 
                onPress={() => setFilter(item as FilterType)}
              >
                <Text
                  style={[
                    CustomEvents.filterText,
                    filter === item && {
                      fontWeight: "bold",
                      color: "#555",
                      backgroundColor: "#C3FF00",
                      borderColor: "white",
                    }
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Box - Eventos */}
        <View>
          <Text style={CustomEvents.placesContainer}>Eventos</Text>
          <FlatList
            style={{ minHeight: "100%" }}
            contentContainerStyle={{ paddingBottom: 200 }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={getFilteredEvents()}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isSelected = selectedItems.includes(item.id);
              return (
                <TouchableOpacity
                  style={[
                    CustomEvents.card,
                    isSelected && { backgroundColor: "#d3e5ff" }
                  ]}
                  onPress={() => toggleSelection(item.id)}
                >
                  <ImageBackground 
                    source={{ uri: item.image }} 
                    style={CustomEvents.cardImage} 
                    imageStyle={{ borderRadius: 10 }}
                  >
                    <View style={CustomEvents.overlay}>
                      {/* <View>
                        <TouchableOpacity 
                          style={CustomEvents.customButtonSave} 
                          onPress={() => handleSave(item)}
                        >
                          <Ionicons name="bookmarks-outline" size={20} color="white" />
                        </TouchableOpacity>
                      </View> */}
                      <View style={CustomEvents.cardInfo}>
                        <View style={{ 
                          flexDirection: 'row', 
                          alignItems: 'center', 
                          zIndex: 3, 
                          position: 'relative', 
                          top: 10 
                        }}>
                          <Image source={{ uri: item.userImage }} style={CustomEvents.CarduserImage} />
                          <Text style={CustomEvents.cardUserTitle}>{item.nameUser}</Text>
                        </View>

                        <View style={CustomEvents.cardLine}/>

                        <View style={CustomEvents.cardInfoBox}>
                          <Text style={CustomEvents.cardTitle}>{item.eventName}</Text>
                          <Text style={CustomEvents.cardLocation}>{item.location}</Text>
                          <Text 
                            style={CustomEvents.cardDescription} 
                            numberOfLines={2} 
                            ellipsizeMode="tail"
                          >
                            {item.description}
                          </Text>
                          <Text style={CustomEvents.cardDate}>{item.date}</Text>
                        </View>
                      </View>
                    </View>

                    {/* <View>
                      <TouchableOpacity 
                        style={CustomEvents.customButtonToShare} 
                        onPress={() => handleShare(item)}
                      >
                        <Ionicons name="return-up-forward" size={20} color="#555" />
                      </TouchableOpacity>
                    </View> */}

                    <View style={CustomEvents.containerButton}>
                      <TouchableOpacity 
                        style={CustomEvents.customButton} 
                        onPress={() => handleSave(item)}
                      >
                        <Ionicons name="location-outline" size={20} color="white" />
                        <Text style={CustomEvents.customButtonText}>Localizada</Text>
                      </TouchableOpacity>
                      {/* <TouchableOpacity 
                        style={CustomEvents.customButton} 
                        onPress={() => handleFavorite(item)}
                      >
                        <Ionicons name="star-outline" size={20} color="white" />
                        <Text style={CustomEvents.customButtonText}>DAR O LIKE TIU</Text>
                      </TouchableOpacity> */}
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* Add - Eventos */}
        <TouchableOpacity style={CustomEvents.addButton} onPress={handleAddEvent}>
          <Ionicons name="add-circle-outline" size={24} color="#333" />
        </TouchableOpacity>

        {/* Modal Criar - Eventos */}
        <Modal visible={modalVisible} animationType="slide">
          <View style={{ flex: 1 }}>
          <MapView
              style={{ flex: 1 }}
              region={mapRegion}
              onRegionChangeComplete={setMapRegion}
              onPress={handleSelectLocation}
            >
              {selectedLocation && (
                <Marker
                  coordinate={{
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                  }}
                  title="Local Selecionado"
                  description="Este é o local que você selecionou"
                  image={require('../../assets/splash-icon.png')}
                />
              )}
            </MapView>

            <View style={{ padding: 20 }}>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  padding: 15,
                  backgroundColor: '#f0f0f0',
                  borderRadius: 8,
                  marginBottom: 15
                }}
                onPress={pickImage}
              >
                {selectedImage ? (
                  <Image
                    source={{ uri: selectedImage }}
                    style={{ width: '100%', height: 200, borderRadius: 8 }}
                  />
                ) : (
                  <>
                    <Ionicons name="image-outline" size={24} color="#333" />
                    <Text style={{ marginTop: 8 }}>Selecionar Imagem do Evento</Text>
                  </>
                )}
              </TouchableOpacity>

              <TextInput
                style={{ borderBottomWidth: 1, marginBottom: 10 }}
                placeholder="Nome do Evento"
                value={newEvent.eventName || ''}
                onChangeText={(text) => updateEventField('eventName', text)}
              />

              {/* <TextInput
                style={{ borderBottomWidth: 1, marginBottom: 10 }}
                placeholder="WEBSITE"
                value={newEvent.website || ''}
                onChangeText={(text) => updateEventField('website', text)}
              /> */}

              <TextInput
                style={{ borderBottomWidth: 1, marginBottom: 10 }}
                placeholder="Descrição do Evento"
                value={newEvent.description || ''}
                onChangeText={(text) => updateEventField('description', text)}
                multiline
              />

              <TextInput
                style={{ borderBottomWidth: 1, marginBottom: 10 }}
                placeholder="Data do Evento (dd/MM/yyyy)"
                value={formatDateInput(newEvent.date || '')} 
                onChangeText={(text) => updateEventField('date', formatDateInput(text))}
              />

              <Text style={{ marginBottom: 10 }}>Localização Selecionada:</Text>
              <Text>
                {selectedLocation
                  ? `Latitude: ${selectedLocation.latitude}, Longitude: ${selectedLocation.longitude}`
                  : 'Nenhuma localização selecionada'}
              </Text>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                <TouchableOpacity
                  onPress={resetForm}
                  style={CustomEvents.CustomButtonCancelEvent}
                >
                  <Text style={{ color: '#FFF', fontWeight: 'bold', textAlign: 'center' }}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSaveEvent}
                  disabled={!selectedLocation || !newEvent.eventName || !newEvent.description || !newEvent.date}
                  style={{
                    backgroundColor:
                      !selectedLocation || !newEvent.eventName || !newEvent.description || !newEvent.date
                        ? '#CCCCCC'
                        : '#C3FF00',
                        width: '45%', 
                        borderRadius: 4,
                        paddingHorizontal: 20, 
                        paddingVertical: 15, 
                  }}
                >
                  <Text
                    style={{
                      color: !selectedLocation || !newEvent.eventName || !newEvent.description || !newEvent.date ? '#666' : '#EAEAEC',
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}
                  >
                    Salvar Evento
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal Filtro - Eventos */}
        <Modal
          visible={filterModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <View style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.5)'
          }}>
            <View style={{
              backgroundColor: 'white',
              padding: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              minHeight: '50%'
            }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 20
              }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Filtros</Text>
                <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#555" />
                </TouchableOpacity>
              </View>

              {/* Event Type Filter */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, marginBottom: 10 }}>Tipo de Evento</Text>
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
                
                  <Ionicons
                    name="chevron-down" // Ícone de seta para baixo
                    size={20}
                    color="#555"
                  />
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
                      <TouchableOpacity
                        key={type}
                        onPress={() => {
                          setFilterEventType(type);
                          setShowEventTypeOptions(false); 
                        }}
                        style={{
                          padding: 10,
                        }}
                      >
                        <Text style={{ color: '#555', textTransform: 'capitalize' }}>
                          {type === 'all' ? 'Todos' : type === 'paid' ? 'Pago' : 'Gratuito'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Date Range Filter */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, marginBottom: 10 }}>Período</Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TextInput
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderColor: '#ddd',
                      borderRadius: 8,
                      padding: 10
                    }}
                    placeholder="Data inicial"
                    value={filterDateStart}
                    onChangeText={(text) => setFilterDateStart(formatDateInput(text))}
                  />
                  <TextInput
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderColor: '#ddd',
                      borderRadius: 8,
                      padding: 10
                    }}
                    placeholder="Data final"
                    value={filterDateEnd}
                    onChangeText={(text) => setFilterDateEnd(formatDateInput(text))}
                  />
                </View>
              </View>

              {/* Distance Slider */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, marginBottom: 10 }}>
                  Distância: {filterDistance}km
                </Text>
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={1}
                  maximumValue={100}
                  value={filterDistance}
                  onValueChange={setFilterDistance}
                  minimumTrackTintColor="#C3FF00"
                  maximumTrackTintColor="#ddd"
                  thumbTintColor="#C3FF00"
                />
              </View>

              {/* Apply Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: '#C3FF00',
                  padding: 15,
                  borderRadius: 8,
                  alignItems: 'center'
                }}
                onPress={() => {
                  setFilterModalVisible(false);
                }}
              >
                <Text style={{ fontWeight: 'bold' }}>Aplicar Filtros</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
