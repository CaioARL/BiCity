import { View, Text, FlatList, ImageBackground, TouchableOpacity, TextInput, Image } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Ionicons, Feather } from "@expo/vector-icons";
import CustomEvents from '../../css/CustomEvents';
import { SafeAreaView } from 'react-native-safe-area-context';
import FilterModal from '../../components/FilterModal';
import EventModal from '../../components//EventModal';
import { useAuthProvider } from '../context/AuthProvider';
import { Evento, RequestCreateEvento, RequestCreateEventoImage, RequestPageEvento, TipoEvento, Usuario } from '../../types';
import { createEvento, createEventoImage, getEvento } from '../../api/evento';
import EventView from '../view/EventView';
import ShowAlert from '../../components/ShowAlert';
import LoadingActivity from '../../components/LoadingActivity';
import { router } from 'expo-router';


// interface EventItem {
//   id: string;
//   nameUser: string;
//   userImage: string;
//   eventName: string;
//   description: string;
//   date: string;
//   image: string;
//   location: string;
//   status: string;
//   isPast?: boolean;
// }
// Versão original
//type FilterType = "Todos" | "Ativos" | "Realizados" | "Pendentes";

type FilterType = "Ativos" | "Realizados" ;


export default function Events() {
  const [usuario, setUsuario] = useState<Usuario>({ id: 0, nome: '', nomeUsuario: '', endereco: { cep: '', estado: '', cidade: '', bairro: '', rua: '', numero: 0, }, email: '', role: '', senha: '', hash: '', cpf: '', cnpj: '', dtCriacao: '', nivelHabilidade: { id: 0, nome: '', descricao: '' }, sessao: {id:0, token:''}, s3Url:'' });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  
  //requests - api
  const [eventos, setEventos] = useState<Evento[] | null>(null)
  const [isContentLoading, setIsContentLoading] = useState<boolean>(false)
  const totalPagesRef = useRef<number>(2)
  const totalRegistrosRef = useRef<number>()
  const currentPageRef = useRef<number>(0)
  const [requestPageEvento, setRequestPageEvento] = useState<RequestPageEvento>({ page: 1, nome: null, descricao: null, data: null, cidade: null, estado: null, faixaKm: null, tipoEvento: null, nivelHabilidade: null, gratuito: null})
  const abortControllerRef = useRef<AbortController>()


  //modals - filtro e criar evento
  const [modalVisible, setModalVisible] = useState(false)
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [requestCreateEvento, setRequestCreateEvento] = useState<RequestCreateEvento | null>(null)



  const [modalViewEvento, setModalViewEvento] = useState<Evento | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [eventoImage, setEventoImage] = useState<string | null>(null)
  const [requestCreateEventoImage, setRequestEventoImage] = useState<RequestCreateEventoImage | null>(null)
  


  const [filter, setFilter] = useState<FilterType>("Ativos");
  







  
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
      if(requestPageEvento.page === currentPageRef.current ) return 
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController
      setIsContentLoading(true)
      console.log('requestPageEvento', requestPageEvento)
      getEvento(requestPageEvento, abortControllerRef.current)
      .then((response) =>{
        totalPagesRef.current = response.totalPaginas
        totalRegistrosRef.current = response.totalRegistros
        currentPageRef.current = requestPageEvento.page
        eventos ? setEventos([...eventos,...response.eventos]) :
        setEventos(response.eventos)
      })
      .catch((response)=>{  
        setErrorMessage("Error ao carregar eventos: "+ response.message)
      })
      .finally(()=>{
        setIsContentLoading(false)
      })
  }, [requestPageEvento])
  
  
  
  const loadMorePage =() =>{
    if(requestPageEvento.page >= totalPagesRef.current) return //alert removed
    setRequestPageEvento({...requestPageEvento, page: requestPageEvento.page + 1})
  }
  
  

  const refreshContent = () => {
        setEventos(null)
        setSearchText('')
        currentPageRef.current = 0
        setRequestPageEvento({ page: 1, nome: null, descricao: null, data: null, cidade: null, estado: null, faixaKm: null, tipoEvento: null, nivelHabilidade: null, gratuito: null})
  }
  


  const setFilteredEvents = (tipoEvento: TipoEvento | null, faixaKm: number | null, data: string| null) => {
    setEventos(null)
    currentPageRef.current = 0
    console.log('tipoEvento', tipoEvento)
    console.log('faixaKm', faixaKm)
    console.log('data', data)
    setRequestPageEvento({...requestPageEvento, tipoEvento: tipoEvento, faixaKm: faixaKm, data: data ,page: 1})
  }

  useEffect( () => {
      if(!requestCreateEvento) return 
      setIsContentLoading(true)
      abortControllerRef.current?.abort
      abortControllerRef.current = new AbortController
        createEvento(requestCreateEvento, abortControllerRef.current)
        .then((response)=>{
          setSuccessMessage('Evento: ' + response.nome + ' criado com sucesso')
          if(eventoImage){
            const formData = new FormData()
            formData.append('file', {
              uri: eventoImage,
              name: 'evento.jpeg',
              type: 'image/jpeg',
            } as any)
            setRequestEventoImage({
              id: response.id,
              image: formData
            })
          }else{
            refreshContent()
          }
        })
        .catch((response)=>{
          setErrorMessage('falha na criação do Evento. \n Code error: ' + response.message)
          
        })
        .finally(()=>{
          setIsContentLoading(false)
          setRequestCreateEvento(null)
        })
      }, [requestCreateEvento])



  useEffect(()=>{
    if(!requestCreateEventoImage){return}
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController
    setIsContentLoading(true)
    createEventoImage(requestCreateEventoImage, abortControllerRef.current)
    .then((response) => {
      setSuccessMessage("Imagem enviada com sucesso" + response)
      
    })
    .catch((response) => {
      setErrorMessage("Error ao enviar imagem: " + response.message)
    }).finally(() => {
      setIsContentLoading(false)
      setRequestEventoImage(null)
      setEventoImage(null)
      refreshContent()
    })
  }, [requestCreateEventoImage])

 
  const searchName = () => {
    setEventos(null)
    currentPageRef.current = 0
    setRequestPageEvento({...requestPageEvento, nome: searchText, page: 1})
  }


  {{/*----------------------------------------------------------------- */}}


  

  

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

  const handleAddEvent = () => {
    router.push('/event/event-user-menu')
    // setModalVisible(true);
  };
  
  return (
  <SafeAreaView>
      <View className='container' style={{ backgroundColor: 'white' }}>

        {/* Perfil, busca e filtro */}
        <View style={CustomEvents.evento}>
          <View style={CustomEvents.location}>
            {
              //width: 65, height: 65, borderRadius: 50, borderWidth: 1, borderColor: '#EAEAEC', marginRight: 10
              
            }
            { authState?.user?.s3Url ? 
            
            <Image
              src={authState.user.s3Url}
              // className='w-[65px] h-[70px] rounded-[50px] border-[1px] mr-[10px] items-center'
              style={{ width: 65, height: 65, borderRadius: 50, borderWidth: 1, borderColor: '#EAEAEC', marginRight: 10 }}
            />
            :
            <View className='w-[65px] h-[65px] rounded-[50px] border-[1px] border-[#EAEAEC] mr-[10px] items-center'>
              <Text className='text-[45px]'>{usuario && usuario.nome[0]}</Text>
            </View>
            
            }


            <View style={{ flexDirection: 'column' }}>
              <Text style={{ ...CustomEvents.locationText}}>{usuario && usuario?.nomeUsuario?.replace(/\b\w/, (c) => c.toUpperCase())}</Text>
              <View style={{ flexDirection: 'row' }}>
                <Feather name="map-pin" size={18} color="#555" style={{marginLeft: 2}}/>
                {authState?.user?.endereco && <Text style={{ ...CustomEvents.locationText}}>{authState.user.endereco.cidade}</Text> }
                {/* <Feather name="chevron-down" size={18} color="#555" /> */} 
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Ionicons name="star-half-outline" size={18} color="#ffcc00" style={{marginLeft: 2}}/> 
                
                {authState?.user?.nivelHabilidade && (
                  <Text style={{ ...CustomEvents.nivelText}}>{authState.user.nivelHabilidade.nome}</Text>)  
                }

              </View>
            </View>
          </View>

          <View style={{ ...CustomEvents.searchBox, }}>
            <Ionicons name="search-outline" size={20} color="#555"/>
            <TextInput
              placeholder="Digite o nome do evento"
              style={CustomEvents.input}
              value={searchText}
              onChangeText={setSearchText}
              onEndEditing={() => searchName()}
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
                      ...CustomEvents.filterText,fontWeight: "bold",
                      color: "#555",
                      backgroundColor: "#C3FF00",
                      borderColor: "white" 
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
              contentContainerStyle={{ paddingBottom: "300%" }}
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
                    onPress={() => setModalViewEvento(item)}
                  >
                    <ImageBackground  
                      source={{uri: item.s3Url}} 
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
        {authState?.user?.role !== 'PF' && <TouchableOpacity style={CustomEvents.addButton} onPress={handleAddEvent}>
         <Ionicons name="add-circle-outline" size={24} color="#333" />
        </TouchableOpacity>}

        {/* Modal Criar - Eventos */}
        {/* { modalVisible && <EventModal
          visible={modalVisible}
          closeModal={ (requestCreateEvento, imageURI) => {
            setRequestCreateEvento(requestCreateEvento)
            setEventoImage(imageURI)
            setModalVisible(false)
          }}
          />} */}
        {/* Modal Filtro - Eventos */}  
        <FilterModal
          visible={filterModalVisible}
          onClose={() => setFilterModalVisible(false)}
          setFilterEntity={setFilteredEvents}
        />

        {/* Modal Visualizar - Eventos */}  
        {modalViewEvento && 
          <EventView
            closeModal={ () => setModalViewEvento(null) }
            onUpdate={refreshContent}
            evento={modalViewEvento}
          />
        }

        {successMessage && 
          <ShowAlert
            message={successMessage}
            type="success"
            onClose={() => setSuccessMessage(null)}
          />}

        {errorMessage &&
          <ShowAlert
            message={errorMessage}
            type="error"
            onClose={() => setErrorMessage(null)}
          />}
        {isContentLoading && <LoadingActivity/>}


      
      </View>

    </SafeAreaView>
  );
}
