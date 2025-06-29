import { View, Text, FlatList, ImageBackground, TouchableOpacity, TextInput, Image, Appearance } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Ionicons, Feather } from "@expo/vector-icons";
import CustomEvents from '../../css/CustomEvents';
import { SafeAreaView } from 'react-native-safe-area-context';
import FilterModal from '../../components/FilterModal';
import { useAuthProvider } from '../context/AuthProvider';
import { Evento, RequestPageEvento, TipoEvento, Usuario } from '../../types';
import { getEvento } from '../../api/evento';
import ShowAlert from '../../components/ShowAlert';
import LoadingActivity from '../../components/LoadingActivity';
import { router, useFocusEffect } from 'expo-router';
import ScrollUp from '../../components/ScrollUp'; 

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

interface FastFowardFilter {
  id: number
  name: string
  isActive: boolean
  campo: string
  value: boolean | null | string | number
}

export default function Events() {
  const [usuario, setUsuario] = useState<Usuario>({ id: 0, nome: '', nomeUsuario: '', endereco: { cep: '', estado: '', cidade: '', bairro: '', rua: '', numero: 0, }, email: '', role: '', senha: '', hash: '', cpf: '', cnpj: '', dtCriacao: '', nivelHabilidade: { id: 0, nome: '', descricao: '' }, sessao: {id:0, token:''}, s3Url:'' });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const theme = Appearance.getColorScheme()
  
  //requests - api
  const [eventos, setEventos] = useState<Evento[] | null>(null)
  const [isContentLoading, setIsContentLoading] = useState<boolean>(false)
  const totalPagesRef = useRef<number>(2)
  const totalRegistrosRef = useRef<number>(0)
  const currentPageRef = useRef<number>(0)
  const [requestPageEvento, setRequestPageEvento] = useState<RequestPageEvento>({ page: 1, nome: null, descricao: null, data: null, cidade: null, estado: null, faixaKm: null, tipoEvento: null, nivelHabilidade: null, gratuito: null, aprovado: null })
  const abortControllerRef = useRef<AbortController>(null)
  const scrollY = useRef<number>(0)
  


  //modals - filtro e criar evento
  const [showScrollUpButton, setShowScrollUpButton] = useState(false)
  const [filterModalVisible, setFilterModalVisible] = useState(false)



  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  const flatListRef = useRef<FlatList>(null);

  const [fastFowardFilter, setFastFowardFilter] = useState<FastFowardFilter[]>(
    [
      {id:1, name: 'Gratuito', isActive: false , campo: 'gratuito', value: true},
      {id:2, name: 'Pago', isActive: false , campo: 'gratuito', value: false},
    ]
  )


  const toogleTabBar = (yScroll : number) => {
    if(yScroll < 50 || yScroll < scrollY.current){
      router.setParams({tabBarVisible: 'yes'})
      setShowScrollUpButton(false)
    } else {
      router.setParams({tabBarVisible: 'no'})
      setShowScrollUpButton(true)
    }
      scrollY.current = yScroll
  }

  
  const  { authState }  = useAuthProvider()
  
  useEffect(() => {
    if(authState?.user){
      if(authState.user){
        setUsuario(authState.user)
      }
    }
    console.log('detalhes de usuario carregados no evento')
  },[])

  useFocusEffect(
    useCallback(() => {
      // Invoked whenever the route is focused.
      // console.log("Hello, I'm focused!");
      router.setParams({tabBarVisible: 'yes'})

      // Return function is invoked whenever the route gets out of focus.
      return () => {
        // console.log('This route is now unfocused.');
      }
    }, [])
  )

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
    setRequestPageEvento({ page: 1, nome: null, descricao: null, data: null, cidade: null, estado: null, faixaKm: null, tipoEvento: null, nivelHabilidade: null, gratuito: null, aprovado: null })
    setFastFowardFilter(prev => prev.map(item => ({ ...item, isActive: false })))	
  }
      
      
      
  const setFilteredEvents = (tipoEvento: TipoEvento | null, faixaKm: number | null, data: string| null) => {
    setEventos(null)
    currentPageRef.current = 0
    console.log('tipoEvento', tipoEvento)
    console.log('faixaKm', faixaKm)
    console.log('data', data)
    setRequestPageEvento({...requestPageEvento, tipoEvento: tipoEvento, faixaKm: faixaKm, data: data ,page: 1})
  }


  const applyFastFowardFilter = (filter: FastFowardFilter) => {
    setFastFowardFilter(prev => 
      prev
      .map(fastFoward => fastFoward.campo === filter.campo && fastFoward.id !== filter.id ? { ...fastFoward, isActive: false } 
        : fastFoward.id === filter.id ? { ...fastFoward, isActive: !fastFoward.isActive } : fastFoward )
    )
    setEventos(null)
    currentPageRef.current = 0
    if(filter.isActive){
      setRequestPageEvento({...requestPageEvento, [filter.campo]: null, page: 1})
    }else{
      setRequestPageEvento({...requestPageEvento, [filter.campo]: filter.value, page: 1})
    }
  }





 
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

  const handleLocalizarEvento = (id: number) => {
    router.navigate({pathname:'home', params:{ eventoId: id.toString() }})
  };


  return (
  <SafeAreaView>
      <View className={`container h-full ${theme==='light'?'bg-white':'bg-secondary_black'}`}>

        {/* Perfil, busca e filtro */}
        <View style={CustomEvents.evento}>
          <View style={CustomEvents.location} className='justify-between'>
            {
              //width: 65, height: 65, borderRadius: 50, borderWidth: 1, borderColor: '#EAEAEC', marginRight: 10
              
            }

            <View style={{flexDirection:'row'}}>
                { authState?.user?.s3Url ? 
                
                <Image
                  source={{uri:authState.user.s3Url, cache:'reload'}}
                  // className='w-[65px] h-[70px] rounded-[50px] border-[1px] mr-[10px] items-center'
                  className="w-20 h-20 rounded-full border-color_light_gray"
                  style={{ width: 65, height: 65, borderRadius: 50, borderWidth: 1,  marginRight: 10 }}
                />
                :
                <View className='w-[65px] h-[65px] rounded-[50px] border-[1px] border-[#EAEAEC] mr-[10px] items-center'>
                  <Text className={`text-[45px] ${theme==='light'?'text-black':'text-white'}`}>{usuario && usuario.nome[0]}</Text>
                </View>
                
                }
              <View style={{ flexDirection: 'column' }}>
                <Text style={{ ...CustomEvents.locationText, color: theme==='light'?'black':'white'}}>{usuario && usuario?.nomeUsuario?.replace(/\b\w/, (c) => c.toUpperCase())}</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Feather name="map-pin" size={18} color="#555" style={{marginLeft: 2}}/>
                  {authState?.user?.endereco && <Text style={{ ...CustomEvents.locationText, color: theme==='light'?'black':'white'}}>{authState.user.endereco.cidade}</Text> }
                  {/* <Feather name="chevron-down" size={18} color="#555" /> */} 
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Ionicons name="star-half-outline" size={18} color="#ffcc00" style={{marginLeft: 2}}/> 
                  
                  {authState?.user?.nivelHabilidade && (
                    <Text style={{ ...CustomEvents.nivelText, color: theme==='light'?'#555555':'white'}}>{authState.user.nivelHabilidade.nome}</Text>)  
                  }

                </View>
              </View>
            </View>

                {authState?.user?.role !== 'PF' &&
                <View className='mr-[10px]'>
                  <TouchableOpacity 
                  className='flex-col flex-nowrap items-center justify-center'
                  onPress={()=>{
                          router.push('event-user-menu')
                  }}>
                      {/* <Image source={require('../../assets/img/1581943.png')} style={{ width: 25, height: 25, tintColor: '#555' }} resizeMode="contain" /> */}
                      <Ionicons name='calendar-outline' size={25} color={theme==='light'?'#555':'white'}/>
                      <Text className={`text-xs text-center ${theme==='light'?'text-matte_gray':'text-white'}`}>Meus {'\n'} Eventos</Text>
                  </TouchableOpacity>
                </View>}

          </View>

          <View 
            className={`flex-row items-center rounded-[100px] px-[10px] h-[50px] elevation-[3px] border-[1px] border-color__lightGray ${theme==='light'?'bg-white ':'bg-matte_gray'}`}
          > 
            <Ionicons name="search-outline" size={20} color={theme==='light'?'#555':'white'}/>
            <TextInput
              placeholder="Digite o nome do evento"
              style={{...CustomEvents.input, color: theme==='light'?'black':'white'}}
              value={searchText}
              placeholderTextColor={theme==='light'?'rgba(0,0,0,0.4)':'rgba(255,255,255,0.4)'}
              onChangeText={setSearchText}
              onEndEditing={() => searchName()}
            />
            <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
                <Ionicons name="options-outline" size={20} color={theme==='light'?'#555':'white'} />
              </TouchableOpacity>
          </View>

          <View style={CustomEvents.filterContainer}>
            {fastFowardFilter.map((item) => (
              <TouchableOpacity 
                key={item.id.toString()} 
                onPress={() => applyFastFowardFilter(item)}
              >
                <Text
                  style={[
                    CustomEvents.filterText,
                    item.isActive && {
                      ...CustomEvents.filterText,fontWeight: "bold",
                      color: theme==='light'?'white':'#555',
                      backgroundColor: "#C3FF00",
                      borderColor: "#555" 
                    }
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Box - Eventos */}
        <View>
      
        <Text style={{...CustomEvents.placesContainer, color: theme==='light'?'#555':'white'}}>Eventos</Text>

           {eventos && (
            <FlatList
              ref={flatListRef}
              onScroll={e=>{toogleTabBar(e.nativeEvent.contentOffset.y)}}
              contentContainerStyle={{ paddingBottom: '100%'}}
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
                    onPress={()=>router.push({pathname:'event-view', params:{ eventoId: item.id }})}
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
                          <View style={{ flexDirection: 'row', alignItems: 'center', zIndex: 3, position: 'relative', top: 10 }}>
                          { item.usuario.s3Url ? 
                            
                            <Image
                              src={item.usuario.s3Url}
                              // className='w-[65px] h-[70px] rounded-[50px] border-[1px] mr-[10px] items-center'
                              className="w-20 h-20 rounded-full border-color_light_gray"
                              style={{ width: 65, height: 65, borderRadius: 50, borderWidth: 1,  marginRight: 10 }}
                            />
                            :
                            <View className='w-[65px] h-[65px] rounded-[50px] border-[1px] border-[#EAEAEC] mr-[10px] items-center'>
                              <Text className='text-[45px]'>{item.usuario.nome[0]}</Text>
                            </View>
                            
                            }
                            
                            <Text style={{ ...CustomEvents.cardUserTitle}}>{item.usuario.nome.replace(/\b\w/, (c: string) => c.toUpperCase())}</Text>
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
                            <Text style={CustomEvents.cardDate}>Data: {item.data.split(' ')[0]}</Text>
                            <Text style={CustomEvents.cardDate}>Horário: {item.data.split(' ')[1]}</Text>
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
                        {authState?.user?.role !== "PJ" &&
                          <TouchableOpacity 
                          style={CustomEvents.customButton} 
                          onPress={() => handleLocalizarEvento(item.id)}
                          >
                          <Ionicons name="location-outline" size={20} color="white" />
                          <Text style={CustomEvents.customButtonText}>Localização</Text>
                        </TouchableOpacity>}
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
        {/* Modal Criar - Eventos */}
        {/* Modal Filtro - Eventos */}  
        <FilterModal
          visible={filterModalVisible}
          onClose={() => setFilterModalVisible(false)}
          setFilterEntity={setFilteredEvents}
        />

        {/* Modal Visualizar - Eventos */}  
        
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


        <ScrollUp  hide={showScrollUpButton} onClick={()=>{
          flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
          }}/>

      </View>
    </SafeAreaView>
  );
}
