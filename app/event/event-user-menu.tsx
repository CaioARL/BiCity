import { useEffect, useRef, useState } from "react";
import React, { View , SafeAreaView, FlatList, TouchableOpacity, ImageBackground, Text} from "react-native";
import { Evento, RequestPageEvento } from "../../types";
import { Ionicons} from "@expo/vector-icons";
import { useAuthProvider } from "../context/AuthProvider";
import CustomEvents from "../../css/CustomEvents";
import { getEventoByUsuario } from "../../api/evento";
import ShowAlert from "../../components/ShowAlert";



export default function EventDetail() {
  const [requestPageEvento, setRequestPageEvento] = useState<RequestPageEvento>({ page: 1, nome: null, descricao: null, data: null, cidade: null, estado: null, faixaKm: null, tipoEvento: null, nivelHabilidade: null, gratuito: null})
  const { authState } = useAuthProvider()

  const [eventos, setEventos] = useState<Evento[] | null>()
  const [isContentLoading, setIsContentLoading] = useState<boolean>(false)
  
  const [errorMessage ,setErrorMessage] = useState<string|null>()
  const abortControllerRef = useRef<AbortController>()
  const currentPageRef = useRef<number>(1)
  const totalPagesRef = useRef<number>(1)
  const totalRegistrosRef = useRef<number>(1)

  useEffect(() => {
    if(!requestPageEvento || !authState?.id) return
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController
    setIsContentLoading(true)
    getEventoByUsuario(requestPageEvento, authState.id , abortControllerRef.current)
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

  },[requestPageEvento])


  const loadMorePage = () =>{
    
    if(currentPageRef.current >= totalPagesRef.current) return //alert removed
    setRequestPageEvento({...requestPageEvento, page: currentPageRef.current + 1})    
      
  }
  
  
  const refreshContent = () => {
    setEventos(null)
    // setSearchText('')
    currentPageRef.current = 1
    setRequestPageEvento({ page: 1, nome: null, descricao: null, data: null, cidade: null, estado: null, faixaKm: null, tipoEvento: null, nivelHabilidade: null, gratuito: null})
  }



  return (
    <SafeAreaView>
      <View className="h-full w-full bg-primary_green_milico">
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
                        return (
                          <TouchableOpacity
                            style={[
                              CustomEvents.card,
                            ]}
                            // onPress={() => setModalViewEvento(item)}
                          >
                            <ImageBackground  
                              source={{uri: item.s3Url}} 
                              style={CustomEvents.cardImage} 
                              imageStyle={{ borderRadius: 10 }}
                            >
                              <View style={CustomEvents.overlay}>
                               
                                <View style={CustomEvents.cardInfo}>
                                  <View style={{ 
                                    flexDirection: 'row', 
                                    alignItems: 'center', 
                                    zIndex: 3, 
                                    position: 'relative', 
                                    top: 10 
                                  }}>
                                    
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
                              
        
                        
                            </ImageBackground>
                          </TouchableOpacity>
                      );
                      }}
                    />
                  )}

            <TouchableOpacity className='absolute bottom-[20%] elevation-[5px] w-[65px] h-[65px] bg-primary_green rounded-full justify-center items-center drop-shadow-md right-[10px]'
              onPress={() => {console.log("add event")}}>
              <Ionicons name="add-circle-outline" size={24} color="#333" />
            </TouchableOpacity>

            {/* {modalVisible && (
              <EventModal
                  visible={modalVisible}
                  closeModal={ (requestCreateEvento, imageURI) => {
                    setRequestCreateEvento(requestCreateEvento)
                    setEventoImage(imageURI)
                    setModalVisible(false)
                  }}
              />
            )} */}



          {errorMessage && (
            <ShowAlert
              type="error"
              message="errorMessage"
              onClose={()=>{setErrorMessage(null)}}
            />
          )}

      </View>
    </SafeAreaView>
  )
}
