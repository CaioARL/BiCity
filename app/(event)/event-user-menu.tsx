import { useEffect, useRef, useState } from "react";
import React, { View , SafeAreaView, FlatList, TouchableOpacity, ImageBackground, Text, Image,  } from "react-native";
import { Evento, RequestCreateEvento, RequestCreateEventoImage, RequestPageEvento, RequestUpdateEvento } from "../../types";
import { Ionicons} from "@expo/vector-icons";
import { useAuthProvider } from "../context/AuthProvider";
import CustomEvents from "../../css/CustomEvents";
import { createEvento, createEventoImage, getEventoByUsuario, updateEvento } from "../../api/evento";
import ShowAlert from "../../components/ShowAlert";
import LoadingActivity from "../../components/LoadingActivity";
import EventModal from "../../components/EventModal";
import { router } from "expo-router";
import { ArrowLeft } from 'lucide-react-native'



export default function EventDetail() {
  const [requestPageEvento, setRequestPageEvento] = useState<RequestPageEvento>({ page: 1, nome: null, descricao: null, data: null, cidade: null, estado: null, faixaKm: null, tipoEvento: null, nivelHabilidade: null, gratuito: null})
  const { authState } = useAuthProvider()

  const [eventos, setEventos] = useState<Evento[] | null>()
  const [isContentLoading, setIsContentLoading] = useState<boolean>(false)
  
  const abortControllerRef = useRef<AbortController>()
  const currentPageRef = useRef<number>(1)
  const totalPagesRef = useRef<number>(1)
  const totalRegistrosRef = useRef<number>(1)
  
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage ,setErrorMessage] = useState<string|null>()
  const [staticErrorMessage, setStaticErrorMessage] = useState<string|null>(null)

  const [editingEvento, setEditingEvento] = useState<Evento | null>(null)
  const [isCreatingEvento, setIsCreatingEvento] = useState<boolean>(false)
  const [requestUpdateEvento, setRequestUpdateEvento] = useState<RequestUpdateEvento | null>()
  const [eventoImage, setEventoImage] = useState<string | null>(null)
  const [requestCreateEventoImage, setRequestEventoImage] = useState<RequestCreateEventoImage | null>(null)
  const [requestCreateEvento, setRequestCreateEvento] = useState<RequestCreateEvento | null>(null)

  useEffect(()=>{
    if(!requestUpdateEvento) return
    setIsContentLoading(true)
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController
    updateEvento(requestUpdateEvento, abortControllerRef.current)
    .then((response)=>{
      setSuccessMessage('Evento: ' + response.nome + ' atualizado com sucesso')
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
      setErrorMessage('falha na atualização do Evento. \n Code error: ' + response.message)
    })
    .finally(()=>{
      setIsContentLoading(false)
      setRequestUpdateEvento(null)
    })
  },[requestUpdateEvento])

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
      setStaticErrorMessage("Error ao carregar eventos: "+ response.message)
    })
    .finally(()=>{
      setIsContentLoading(false)
    })

  },[requestPageEvento])

  const loadMorePage = () =>{
    if(currentPageRef.current >= totalPagesRef.current) return
    setRequestPageEvento({...requestPageEvento, page: currentPageRef.current + 1}) 
    currentPageRef.current = currentPageRef.current+1      
  }
  
  const refreshContent = () => {
    setEventos(null)
    // setSearchText('')
    currentPageRef.current = 1
    setRequestPageEvento({ page: 1, nome: null, descricao: null, data: null, cidade: null, estado: null, faixaKm: null, tipoEvento: null, nivelHabilidade: null, gratuito: null})
  }

  const handleLocationEventMap = (item: Evento) => {
    console.log('Você foi direcionar para o evento no mapa:', item.nome);
  };

  return (
    <SafeAreaView className="bg-white h-full w-full">
     
      <TouchableOpacity
        style={{ position: 'absolute', top: 45, right: 20, borderRadius: '50%',  paddingHorizontal: 15,
          paddingVertical: 15, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, zIndex: 10,}} 
          className='bg-primary_green'
           onPress={() => router.back()}
        >
        <ArrowLeft size={24} color="#555" />
      </TouchableOpacity>
      
      {isContentLoading && <LoadingActivity/>}
      <View className="h-full w-full container" >
        {eventos && (
                    <FlatList
                      className="min-h-[100%] my-10"
                      contentContainerStyle={{ 
                        paddingBottom: 50,
                      }}
                      ListHeaderComponent={
                        <Text className='flex-col text-lg font-bold text-center mb-10'>Meus Eventos</Text>
                      }
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
                            onLongPress={()=>setEditingEvento(item)}
                            onPress={()=>router.push({pathname:'event-view', params:{ eventoId: item.id }})}
                          >
                            <ImageBackground  
                              source={{uri: item.s3Url}} 
                              style={CustomEvents.cardImage} 
                              imageStyle={{ borderRadius: 10 }}
                            >
                              <View style={CustomEvents.overlay}>
                               
                                <View style={CustomEvents.cardInfo}>
                                 <View style={{ flexDirection: 'row', alignItems: 'center', zIndex: 3, position: 'relative', top: 10 }}>
                                 
                                      { authState?.user?.s3Url ? 
                                        <Image
                                          src={authState.user.s3Url}
                                          className="w-20 h-20 rounded-full border-color_light_gray"
                                          style={{ width: 65, height: 65, borderRadius: 50, borderWidth: 1, marginRight: 10 }}
                                        />
                                        :
                                        <View className='w-[65px] h-[65px] rounded-[50px] border-[1px] border-[#EAEAEC] mr-[10px] items-center bg-white text-white'>
                                          <Text className='text-[45px]'>{authState?.user?.nome?.[0]}</Text>
                                        </View>
                                      }
                                      <Text style={{ ...CustomEvents.cardUserTitle}}>{authState?.user?.nomeUsuario?.replace(/\b\w/, (c) => c.toUpperCase())}</Text>
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

                              <View style={CustomEvents.containerButton}>
                                <TouchableOpacity 
                                  style={CustomEvents.customButton} 
                                  onPress={() => handleLocationEventMap(item)}
                                  >
                                  <Ionicons name="location-outline" size={20} color="white" />
                                  <Text style={CustomEvents.customButtonText}>Localizada</Text>
                                </TouchableOpacity>
                              </View>
                              
                            </ImageBackground>
                          </TouchableOpacity>
                      )
                      }}
                    />
                  )}

            <TouchableOpacity className='absolute bottom-[20%] elevation-[5px] w-[65px] h-[65px] bg-primary_green rounded-full justify-center items-center drop-shadow-md right-[10px]'
              onPress={()=>setIsCreatingEvento(true)}>
              <Ionicons name="add-circle-outline" size={24} color="#333" />
            </TouchableOpacity>

            {isCreatingEvento && (
              <EventModal
                  visible={isCreatingEvento}
                  closeModal={ (requestCreateEvento, imageURI) => {
                    setRequestCreateEvento(requestCreateEvento)
                    setEventoImage(imageURI)
                    setIsCreatingEvento(false)
                  }}
              />
            )}

          {editingEvento && (
            <EventModal
              visible={editingEvento !== null}
              evento={editingEvento}
              closeModal={(requestUpdateEvento, imageURI) => {
                requestUpdateEvento && setRequestUpdateEvento({...requestUpdateEvento, id: editingEvento.id})
                setEventoImage(imageURI)
                setEditingEvento(null)
              }}
            />
          )}


          {errorMessage && (
            <ShowAlert
              type="error"
              message={errorMessage}
              onClose={()=>{setErrorMessage(null)}}
            />
          )}


          {staticErrorMessage && (
            <ShowAlert
              type="error"
              message={staticErrorMessage}
              isStatic={true}
              onClose={()=>{setErrorMessage(null)}}
            />
          )}

          {successMessage && (
            <ShowAlert
              type="success"
              message={successMessage}
              onClose={()=>{setSuccessMessage(null)}}
            />
          )}

      </View>
    </SafeAreaView>
  )
}
