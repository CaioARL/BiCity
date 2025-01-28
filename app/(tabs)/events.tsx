import { View, Text, FlatList, ImageBackground, TouchableOpacity, TextInput, Image, Modal, Button } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons, Feather } from "@expo/vector-icons";
import CustomEvents from '../../components/CustomEvents';
import { SafeAreaView } from 'react-native-safe-area-context';
import FilterModal from '../../components/FilterModal';
import EventModal from '../../components//EventModal';
import { useAuthProvider } from '../context/AuthProvider';
import { Evento, EventoEndereco, RequestPageEvento, Usuario } from '../../types';
import { set } from 'zod';
import { getEvento } from '../../api/evento';
import LoadingActivity from '../../components/LoadingActivity';



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
];

export default function Events() {
  const [usuario, setUsuario] = useState<Usuario>({ id: 0, nome: '', nomeUsuario: '', endereco: { cep: '', estado: '', cidade: '', bairro: '', rua: '', numero: 0, }, email: '', senha: '', hash: '', cpf: '', cnpj: '', dtCriacao: '', nivelHabilidade: { id: 0, nome: '', descricao: '' } });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  
  
  //requests - api
  const [eventos, setEventos] = useState<Evento[] | null>(null)
  const [isContentLoading, setIsContentLoading] = useState<boolean>(false)
  const totalPagesRef = useRef<number>(2)
  const totalRegistrosRef = useRef<number>()
  const [requestPageEvento, setRequestPageEvento] = useState<RequestPageEvento>({ page: 1, nome: null, descricao: null, data: null, cidade: null, estado: null, faixaKm: 0, tipoEvento: { id:0, nivelHabilidade: {nome:'', descricao:'', id:0}, nome: '' }, nivelHabilidade: {nome:'', descricao:'', id:0}, gratuito: null})
  const abortControllerRef = useRef<AbortController>()
  
  //modals - filtro e criar evento
  const [modalVisible, setModalVisible] = useState(false)
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [filter, setFilter] = useState<FilterType>("Ativos");
  



  const [showEventTypeOptions, setShowEventTypeOptions] = useState(false);

  // Filtro - Data Calendario
  {{/* Aquiiiii */}} 


  
  const  { authState }  = useAuthProvider()
  
  useEffect(() => {
    if(authState?.user){
      if(authState.user){
        setUsuario(authState.user)
      }
    }
    console.log('detalhes de usuario carregados no evento')
  },[])
  

  useEffect(() => {
      if(requestPageEvento.page > totalPagesRef.current) return alert("Não há mais eventos para carregar")
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController
      setIsContentLoading(true)
      console.log('requestPageEvento', requestPageEvento)
      getEvento(requestPageEvento, abortControllerRef.current)
      .then((response) =>{
        totalPagesRef.current = response.totalPaginas
        totalRegistrosRef.current = response.totalRegistros
        eventos ? setEventos([...eventos,...response.eventos]) :
        setEventos(response.eventos)
      })
      .catch((response)=>{  
        alert("Error ao carregar eventos: "+ response.message)
      })
      .finally(()=>{
        setIsContentLoading(false)
      })
  }, [requestPageEvento])
  
  
  
  const loadMorePage =() =>{
    if(requestPageEvento.page >= totalPagesRef.current) return alert("Não há mais eventos para carregar")
    setRequestPageEvento({...requestPageEvento, page: requestPageEvento.page + 1})
  }
  
  

  const refreshContent = () => {
        setEventos(null)
        setRequestPageEvento({ page: 1, nome: null, descricao: null, data: null, cidade: null, estado: null, faixaKm: 0, tipoEvento: { id:0, nivelHabilidade: {nome:'', descricao:'', id:0}, nome: '' }, nivelHabilidade: {nome:'', descricao:'', id:0}, gratuito: null})
  }
  
  
 

  {{/*----------------------------------------------------------------- */}}


  

  

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

  const handleSave = (item: Evento) => {
    console.log('Evento salvo:', item.nome);
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


          
           {eventos && (
            <FlatList
              style={{ minHeight: "100%" }}
              contentContainerStyle={{ paddingBottom: 200 }}
              onEndReached={loadMorePage}
              onEndReachedThreshold={0.1}
              refreshing={isContentLoading}
              onRefresh={refreshContent}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false} 
              data={eventos}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                const isSelected = selectedItems.includes(item.id.toString());
                return (
                  <TouchableOpacity
                    style={[
                      CustomEvents.card,
                      isSelected && { backgroundColor: "#d3e5ff" }
                    ]}
                    onPress={() => toggleSelection(item.id.toString())}
                  >
                    <ImageBackground 
                      // source={{ uri: item.image }} 
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
                            {/* <Image source={{ uri: item.userImage }} style={CustomEvents.CarduserImage} /> */}
                            {/* <Text style={CustomEvents.cardUserTitle}>{item.nameUser}</Text> */}
                          </View>

                          <View style={CustomEvents.cardLine}/>

                          <View style={CustomEvents.cardInfoBox}>
                            <Text style={CustomEvents.cardTitle}>{item.nome}</Text>
                            <Text style={CustomEvents.cardLocation}>{item.endereco.bairro}</Text>
                            <Text 
                              style={CustomEvents.cardDescription} 
                              numberOfLines={2} 
                              ellipsizeMode="tail"
                            >
                              {item.descricao}
                            </Text>
                            <Text style={CustomEvents.cardDate}>{item.data}</Text>
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
          )}
          


        </View>

        {/* Add - Eventos */}
        <TouchableOpacity style={CustomEvents.addButton} onPress={handleAddEvent}>
          <Ionicons name="add-circle-outline" size={24} color="#333" />
        </TouchableOpacity>

        {/* Modal Criar - Eventos */}
        {modalVisible && 
          <EventModal
            visible={modalVisible}
            closeModal={ () => setModalVisible(!modalVisible)}
          />
        }
        {/* Modal Filtro - Eventos */}  
        <FilterModal
          visible={filterModalVisible}
          onClose={() => setFilterModalVisible(false)}
          showEventTypeOptions={showEventTypeOptions}
          setShowEventTypeOptions={setShowEventTypeOptions}
        />
      
      </View>

    </SafeAreaView>
  );
}
