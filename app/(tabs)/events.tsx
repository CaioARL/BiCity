import { View, Text, FlatList, ImageBackground, TouchableOpacity, TextInput, Image, Modal, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons, Feather } from "@expo/vector-icons";
import CustomEvents from '../../components/CustomEvents';
import { SafeAreaView } from 'react-native-safe-area-context';
import FilterModal from '../../components/FilterModal';
import EventModal from '../../components//EventModal';
import { useAuthProvider } from '../context/AuthProvider';
import { Evento, EventoEndereco, Usuario } from '../../types';
import { set } from 'zod';

interface MarkedDates {
  [date: string]: {
    selected?: boolean;
    marked?: boolean;
    starting?: boolean;
    ending?: boolean;
    color?: string;
  };
}

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
  const [usuario, setUsuario] = useState<Usuario>({ id: 0, nome: '', nomeUsuario: '', endereco: { cep: '', estado: '', cidade: '', bairro: '', rua: '', numero: 0, }, email: '', senha: '', hash: '', cpf: '', cnpj: '', dtCriacao: '', nivelHabilidade: { id: 0, nome: '', descricao: '' } });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [eventos, setEventos] = useState<Evento[]>([]);
  // New filter states
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterDistance, setFilterDistance] = useState(10);
  const [filterDateStart, setFilterDateStart] = useState('');
  const [filterDateEnd, setFilterDateEnd] = useState('');
  const [filterEventType, setFilterEventType] = useState('all'); 
  const [showEventTypeOptions, setShowEventTypeOptions] = useState(false);

  // Filtro - Data Calendario
  {{/* Aquiiiii */}} 
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});

  
  const  { authState }  = useAuthProvider()
  
  
  

  useEffect(() => {


    if(authState?.user){
      if(authState.user){
        setUsuario(authState.user)
      }
    }
      
  }, [])
  
  
  
  
  
  
  
  
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };








  const handleDayPress = (day: any) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      // Iniciando nova seleção
      setSelectedStartDate(day.dateString);
      setSelectedEndDate('');
      setFilterDateStart(formatDisplayDate(day.dateString));
      setFilterDateEnd('');
      
      setMarkedDates({
        [day.dateString]: {
          selected: true,
          color: '#C3FF00'
        }
      });
    } else {
      // Selecionando data final
      if (day.dateString < selectedStartDate) {
        // Se a data final for menor que a inicial, inverte
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(day.dateString);
        setFilterDateEnd(formatDisplayDate(selectedStartDate));
        setFilterDateStart(formatDisplayDate(day.dateString));
      } else {
        setSelectedEndDate(day.dateString);
        setFilterDateEnd(formatDisplayDate(day.dateString));
      }

      // Marcar o período inteiro
      const markedDatesObj: MarkedDates = {};
      let currentDate = new Date(Math.min(new Date(selectedStartDate).getTime(), new Date(day.dateString).getTime()));
      const endDate = new Date(Math.max(new Date(selectedStartDate).getTime(), new Date(day.dateString).getTime()));

      while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().split('T')[0];
        if (dateString === selectedStartDate) {
          markedDatesObj[dateString] = {
            selected: true,
            color: '#C3FF00',
            starting: true
          };
        } else if (dateString === day.dateString) {
          markedDatesObj[dateString] = {
            selected: true,
            color: '#C3FF00',
            ending: true
          };
        } else {
          markedDatesObj[dateString] = {
            selected: true,
            color: '#E8FFB7'
          };
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      setMarkedDates(markedDatesObj);
      
      // Fechar o calendário após selecionar o período completo
      setTimeout(() => setShowCalendar(false), 500);
    }
  };

  {{/*----------------------------------------------------------------- */}}

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
  };

  const handleSelectLocation = (e: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  

  const resetForm = () => {
    setModalVisible(false);
    setSelectedImage(null);
    setSelectedLocation(null);
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
              <Text style={CustomEvents.locationText}>{usuario?.nomeUsuario}</Text>
              <View style={{ flexDirection: 'row' }}>
                <Feather name="map-pin" size={18} color="#555" style={{marginLeft: 2}}/>
                <Text style={CustomEvents.locationText}>{usuario?.endereco.cidade}</Text>
                {/* <Feather name="chevron-down" size={18} color="#555" /> */} 
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Ionicons name="star-half-outline" size={18} color="#ffcc00" style={{marginLeft: 2}}/> 
                <Text style={CustomEvents.nivelText}>{usuario?.nivelHabilidade.nome}</Text>   
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
        {modalVisible && 
        
          <EventModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            mapRegion={mapRegion}
            setMapRegion={setMapRegion}
            selectedLocation={selectedLocation}
            handleSelectLocation={handleSelectLocation}
              
            // formatDateInput={formatDateInput}
            resetForm={resetForm}
          />
        
        }
        {/* Modal Filtro - Eventos */}  
        <FilterModal
          visible={filterModalVisible}
          onClose={() => setFilterModalVisible(false)}
          filterDistance={filterDistance}
          setFilterDistance={setFilterDistance}
          filterDateStart={filterDateStart}
          setFilterDateStart={setFilterDateStart}
          filterDateEnd={filterDateEnd}
          setFilterDateEnd={setFilterDateEnd}
          markedDates={markedDates}
          handleDayPress={handleDayPress}
          filterEventType={filterEventType}
          setFilterEventType={setFilterEventType}
          showEventTypeOptions={showEventTypeOptions}
          setShowEventTypeOptions={setShowEventTypeOptions}
          showCalendar={showCalendar} 
          setShowCalendar={setShowCalendar}
        />
      
      </View>
    </SafeAreaView>
  );
}
