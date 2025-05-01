import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Modal, Animated, ScrollView, Image, TouchableOpacity} from 'react-native'
import { Region } from 'react-native-maps'
import { ListTipoEvento, TipoEvento } from '../types/tipo-evento'
import { getTipoEvento } from '../api/tipo-evento'
import FormFieldDropdownSelectList from './FormFieldDropdownSelectList'
import { Evento, Horario, NivelHabilidade, RequestCreateEvento, RequestCreateEventoError } from '../types'
import * as ImagePicker from 'expo-image-picker'
import { getCep, getCepByLatAndLong } from '../api/endereco'
import { createEventSchema } from '../util/validationSchemas'
import FormFieldModal from './FormFieldModal'
import FormSelectFieldModal from './FormSelectFieldModal'
import FormFieldCalendarSelectModal from './FormFieldCalendarSelectModal'
import ButtonModal from './ButtonModal'
import MapModalEdit from './MapModalEdit'
import MapModalView from './MapModalView'
import { useAuthProvider } from '../app/context/AuthProvider'
import ImageSelectionPopup from '../components/ImgPickerModal'
import { Ionicons } from '@expo/vector-icons'
import TimePicker from './TimePicker'

interface EventModalProps {
  visible: boolean
  evento?: Evento
  closeModal: ( requestCreateEvento: RequestCreateEvento | null, requestCreateEventoImage: string | null ) => void
}

export default function EventModal({ visible, closeModal, evento }: EventModalProps) {

  const { authState } = useAuthProvider()

  // const fadeAnim = useRef(new Animated.Value(0)).current;

  const abortControllerRef = useRef(new AbortController())

  const [image, setImage] = useState<string | null>( evento?.s3Url || null)
  
  const [mapRegion, setMapRegion] = useState<Region | null>()
  const [mapPlotError, setMapPlotError] = useState('')

  const [mapViewRegion, setMapViewRegion] = useState<Region | null>(null)

  const [isCepLoading, setIsCepLoading] = useState<boolean>()
  const [requestCreateEvento, setRequestCreateEvento] = useState<RequestCreateEvento>({ nome: evento?.nome || '', descricao: evento?.descricao || '', data: { horario: evento?.data.split(' ')[1] || '' , data: evento?.data.split(' ')[0].split('/').reverse().join('-') || ''} as Horario, endereco: evento?.endereco || {cep: '', cidade: '', estado: '', bairro: '' , rua: '' ,  numero: 0, latitude: 0, longitude: 0}, faixaKm: evento?.faixaKm || 0, gratuito: evento?.gratuito || false, urlSite: evento?.urlSite || '' , tipoEvento: evento?.tipoEvento || {id: 0, nome: '', nivelHabilidade: {id: 0, descricao: '', nome: '' }}, idUsuario: authState?.user?.id || 0  })

  const [novoEventoError, setNovoEventoError] = useState<RequestCreateEventoError>({ nome: '', descricao: '', data: {data: '', horario: ''}, endereco: {cep: '', cidade: '', estado: '', bairro: '' , rua: '' ,  numero: '' }, faixaKm: '', gratuito: '', urlSite: '' , tipoEvento: ''})

  const [showImagePopup, setShowImagePopup] = useState(false)

  const [listTipoEvento, setListTipoEvento] = useState<ListTipoEvento[]> ([])

  const [showTimePicker, setShowTimePicker] = useState<boolean>()
  // useEffect(() => {
  //   if (visible) {
  //     Animated.timing(fadeAnim, {
  //       toValue: 1,
  //       duration: 800,
  //       useNativeDriver: true,
  //     }).start();
    
  //   } else {
  //     Animated.timing(fadeAnim, {
  //       toValue: 0,
  //       duration: 300,
  //       useNativeDriver: true,
  //     }).start();
  //   }
  // }, [visible, fadeAnim]);


  useEffect(() => {
    getTipoEvento()
    .then((response) => {
      setListTipoEvento([])
      response.map((tipoEvento)=>{
        setListTipoEvento((prevList) => {
          return [
            ...prevList,
            {
              nome: tipoEvento.nome,
              id: tipoEvento.id,
              value: tipoEvento
            }
          ]
        })
      })
    })
    .catch((response)=>{
      alert('Error ao carregar Tipos de Eventos, verifique sua conexão. \nCode error:' + response.message)
      closeModal(null, null)
    })
  },[])

  const checkCep = async (cep: string) => {
    if (cep.length !== 8) return
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()
    setIsCepLoading(true)
    updateCampoNovoEventoErrorEndereco(cep,'')
    setMapPlotError('')
      getCep(cep, abortControllerRef.current).then((response) => {
        updateCampoNovoEventoEndereco('rua', response.street)
        updateCampoNovoEventoEndereco('bairro', response.neighborhood)
        updateCampoNovoEventoEndereco('cidade', response.city)
        updateCampoNovoEventoEndereco('estado', response.state)
        if (response.location.coordinates.latitude && response.location.coordinates.longitude) {
          //change map view here -- still need to figure out how
          setMapViewRegion(
            {
              latitude: response.location.coordinates.latitude,
              longitude: response.location.coordinates.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }
          )
        } else {
          setMapPlotError('Latitude e Longitude não foram encontrados.')
        }
      })
      .catch((error) =>{
        updateCampoNovoEventoErrorEndereco('cep','Cep não encontrado. Tente novamente. Code Error: ' + error.message )
      })
      .finally(() => {
        setIsCepLoading(false)
      }) 
  }




  const validateEventAndClose = () => {
    setNovoEventoError({ nome: '', descricao: '', data: { data: '', horario: ''}, endereco: {cep: '', cidade: '', estado: '', bairro: '' , rua: '' ,  numero:'' }, faixaKm: '', gratuito: '', urlSite: '', tipoEvento: ''})
    const result = createEventSchema.safeParse(requestCreateEvento)
    if(!result.success){
      result.error.issues.forEach((issue) => {
        if(issue.path[0] === 'data'){
          setNovoEventoError(prev => ({
            ...prev,
            data: {
              ...prev.data,
              [issue.path[1]] : issue.message
             }
          }))
        } else if(issue.path[0] === 'endereco'){
          setNovoEventoError((prev) => ({
            ...prev,
            endereco:{
              ...prev.endereco,
              [issue.path[1]]: issue.message,
            }
          }))
        } else {
          setNovoEventoError((prev) => ({
            ...prev,
            [issue.path[0]]: issue.message,
          }))
        }
      })
    }else{
      closeModal(requestCreateEvento, image)
    }
  }

  const pickImageFromGallery = async () => {
      try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          alert('Desculpe, precisamos de permissão para acessar a galeria!')
          return
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          quality: 0.8,
        })
  
        if (!result.canceled && result?.assets?.[0]?.uri) {
          setImage(result.assets[0].uri)
        }
        setShowImagePopup(false)
      } catch (error) {
        console.error('Error picking image:', error)
        setShowImagePopup(false)
      }
    }
  
    const takePhoto = async () => {
      try {
        const { status } = await ImagePicker.requestCameraPermissionsAsync()
        if (status !== 'granted') {
          alert('Desculpe, precisamos de permissão para acessar a câmera!')
          return
        }
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          quality: 0.8,
        })
  
        if (!result.canceled && result?.assets?.[0]?.uri) {
          setImage(result.assets[0].uri)
        }
        setShowImagePopup(false)
      } catch (error) {
        console.error('Error taking photo:', error)
        setShowImagePopup(false)
      }
    }
  
    const handleCloseImagePopup = () => {
      setShowImagePopup(false)
    }
  
    const showImageOptions = () => {
      setShowImagePopup(true)
    }

  useEffect(() => {
    if(!mapRegion) return
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()
    getCepByLatAndLong(mapRegion.latitude, mapRegion.longitude , abortControllerRef.current)
    .then( response => {
      setIsCepLoading(true)
      abortControllerRef.current = new AbortController()
      getCep(response.cep.replace('-',''), abortControllerRef.current).then((response) => {
        updateCampoNovoEventoEndereco('rua', response.street)
        updateCampoNovoEventoEndereco('bairro', response.neighborhood)
        updateCampoNovoEventoEndereco('cidade', response.city)
        updateCampoNovoEventoEndereco('estado', response.state)
        updateCampoNovoEventoEndereco('cep', response.cep.replace('-',''))
      })
      .catch((error) =>{
        updateCampoNovoEventoErrorEndereco('cep','Cep não encontrado. Tente novamente. Code Error: ' + error.message )
      })
      .finally(() => {
        setIsCepLoading(false)
      }) 
    })
    .catch(error => {
        setMapPlotError("Cep não foi encontrado." + error)
    })
  }, [mapRegion])

  const updateCampoNovoEvento = (campo: string, valor: string | NivelHabilidade | number | TipoEvento | boolean) => {
    setRequestCreateEvento(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  const updateCampoNovoEventoEndereco = (campo: string, valor: number | string) => {
    setRequestCreateEvento(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        [campo]: valor
      }
    }))
  }

  const updateCampoNovoEventoTipoEvento = (valor: TipoEvento) => {
    setRequestCreateEvento(prev => ({
      ...prev,
      tipoEvento: valor
    }))
  }

  const updateCampoData = (campo: string, valor: string) => {
    setRequestCreateEvento(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [campo]: valor
      }
    }))
  }

  const updateCampoNovoEventoError = ( campo: string, valor: string) => {
    setNovoEventoError(prev => (
      {...prev,
        [campo]: valor
      }
    ))
  }

  const updateCampoNovoEventoErrorData = (campo: string, valor: string) =>{
    setNovoEventoError(prev=> (
      {...prev,
        data: {
          ...prev.data,
          [campo]: valor
        }
      }
    ))
  }

  const updateCampoNovoEventoErrorEndereco = (campo: string, valor: string) => {
    setNovoEventoError(prev=> (
      {...prev,
        endereco: {
          ...prev.endereco,
          [campo]: valor
        }
      }
    ))
  }

  return (
    <>

    <Modal visible={visible} animationType="slide" transparent={true} >
      <View className='flex-row bg-[rgba(0,0,0,0.5)] justify-center'>
        <ScrollView>
        <View className='bg-white flex-[1] rounded-[10px] p-[20px] m-[20px]'>
            {/* <Animated.View style={{ opacity: fadeAnim }}> */}

               <View  className='mb-[2px]'>
                  {mapViewRegion?(
                    <>
                      <MapModalView
                        prop={mapViewRegion}
                        />
                      <ButtonModal 
                              title='Editar'
                              customStyles='w-full'
                              customColor='bg-[#000]'
                              handlePress={() => {
                                  setMapViewRegion(null)
                              }}   
                               />
                    </>
                    
                  ):(

                    <MapModalEdit
                      getRegion={setMapRegion}
                    />
                    
                  )}
                  {mapPlotError && (
                    <Text className='text-color_red_error  my-2'>{'*'+mapPlotError}</Text>
                  )}
                    
                  <Text>Selecione o local do evento:</Text> 
                  <Text>1. Clique no mapa para selecionar o local, ou</Text>
                  <Text>2. Digite o CEP abaixo:</Text>
                </View>
               
              <FormFieldModal
                title='Cep'
                value={requestCreateEvento.endereco.cep}
                otherStyles='mt-[2px]'
                handleChangeText={text => updateCampoNovoEventoEndereco('cep', text )}
                validantionCheck={ e=> {
                  if (requestCreateEvento.endereco.cep.length === 8) {
                    checkCep(requestCreateEvento.endereco.cep);
                    updateCampoNovoEventoEndereco('cep', e.nativeEvent.text)
                  }
                }}
                placeholder='Digite o cep'
                maxLength={8}
                keyboardType='number-pad'
                isLoading={isCepLoading}
                onFocus={()=>updateCampoNovoEventoErrorEndereco('cep','')}
                msg={novoEventoError.endereco.cep}     
              />
              
              <FormFieldModal
                placeholder="Rua"
                value={requestCreateEvento.endereco.rua}
                handleChangeText={text => {updateCampoNovoEventoEndereco('rua', text)}}
                keyboardType='default'
                onFocus={()=>updateCampoNovoEventoErrorEndereco('rua','')}
                msg={novoEventoError.endereco.rua}
              />

              <FormFieldModal
                placeholder="Número"
                value={requestCreateEvento.endereco.numero === 0? '' : requestCreateEvento.endereco.numero.toString()}
                handleChangeText={text => {updateCampoNovoEventoEndereco('numero', parseInt(text || '0', 10))}}
                keyboardType="number-pad"
                onFocus={()=>updateCampoNovoEventoErrorEndereco('numero','')}
                msg={novoEventoError.endereco.numero}
              />

              <FormFieldModal
                placeholder="Bairro"
                value={requestCreateEvento.endereco.bairro}
                handleChangeText={text => {updateCampoNovoEventoEndereco('bairro', text)}}
                keyboardType='default'
                onFocus={()=>updateCampoNovoEventoErrorEndereco('bairro','')}
                msg={novoEventoError.endereco.bairro}
              />
              
              <FormFieldModal
                placeholder="Cidade"
                value={requestCreateEvento.endereco.cidade}
                handleChangeText={text => {updateCampoNovoEventoEndereco('cidade', text)}}
                keyboardType='default'
                onFocus={()=>updateCampoNovoEventoErrorEndereco('cidade','')}
                msg={novoEventoError.endereco.cidade}
              />

              <FormFieldModal
                value={requestCreateEvento.endereco.estado}
                handleChangeText={ text=> updateCampoNovoEventoEndereco('estado', text)}
                placeholder='Estado'
                onFocus={()=>updateCampoNovoEventoErrorEndereco('estado','')}
                msg={novoEventoError.endereco.estado}
                  
              />
                       
              <FormFieldModal
                title='Nome'
                value={requestCreateEvento.nome}
                handleChangeText={ text=> updateCampoNovoEvento('nome', text)}
                placeholder='Digite o nome do evento'
                onFocus={()=>updateCampoNovoEventoError('nome','')}
                msg={novoEventoError.nome}
              />
              
              <FormFieldModal
                title='Descrição'
                value={requestCreateEvento.descricao}
                handleChangeText={text => updateCampoNovoEvento('descricao', text)}
                placeholder='Descrição do evento...'
                multiline={true}
                onFocus={()=>updateCampoNovoEventoError('descricao','')}
                msg={novoEventoError.descricao}
              />

              <FormFieldModal
                title='Site'
                value={requestCreateEvento.urlSite}
                keyboardType='url'
                handleChangeText={ text=> updateCampoNovoEvento('urlSite', text)}
                placeholder='Digite o site do evento'
                onFocus={()=>updateCampoNovoEventoError('urlSite','')}
                msg={novoEventoError.urlSite}
              />
            
              <FormFieldDropdownSelectList
                title='Tipos de Eventos'
                selectedValue={requestCreateEvento.tipoEvento}
                options={listTipoEvento}
                handleChange={(value) => updateCampoNovoEventoTipoEvento(value)}
                onFocus={()=>updateCampoNovoEventoError('tipoEvento','')}
                msg={novoEventoError.tipoEvento}     
              />

              <FormFieldModal
                title="Tamanho do Percurso"
                placeholder="Tamanho do percurso (km)"
                value={requestCreateEvento.faixaKm === 0? '' : requestCreateEvento.faixaKm.toString()}
                handleChangeText={text => {updateCampoNovoEvento('faixaKm', parseInt(text || '0', 10))}}
                onFocus={()=>updateCampoNovoEventoError('faixaKm','')}
                msg={novoEventoError.faixaKm}
                keyboardType="number-pad"
              />

              <FormSelectFieldModal
                handleChangeValue={(value) => updateCampoNovoEvento('gratuito', value)}
                value={requestCreateEvento.gratuito}
                title='O evento é gratuito ou pago?'
                option_1='Gratuito'
                option_2='Pago'
              />

              <TouchableOpacity     
                  className='border-[1px] mt-5 border-color_light_gray rounded-[8px] p-[10px] flex-row items-center justify-between' 
                  onPress={() => setShowTimePicker(!showTimePicker )}
                  onPressIn={()=>{updateCampoNovoEventoErrorData('horario','')}}
              >
                <Text className='text-matte_gray'>
                {requestCreateEvento.data.horario.replace(':00', '') || 'Selecione a hora do evento'}
                </Text>
                <Ionicons name="time-outline" size={24} color="#666" />
              </TouchableOpacity>
              {novoEventoError.data.horario && (<Text className='text-color_red_error'>*{novoEventoError.data.horario}</Text>)}
              

              <FormFieldCalendarSelectModal
                value={requestCreateEvento.data.data}
                handleChangeValue={data => {updateCampoData('data', data)}}
                onFocus={()=>updateCampoNovoEventoErrorData('data', '')}
                msg={novoEventoError.data.data}
              />

              <TouchableOpacity onPress={showImageOptions} activeOpacity={0.7}>
                    {image ? (
                      <View>
                        <Image
                          className="h-[120px] w-[100%] rounded-[10px] mb-4 border-[1px] border-color__lightGray"
                          source={{ uri: image }}
                        />
                        <Text className="text-center text-xs text-gray-500 mb-4">
                          Toque para alterar a imagem
                        </Text>
                      </View>
                    ) : (
                      <View className="h-[120px] w-[100%] mb-4 bg-[#f0f0f0] rounded-[10px] items-center justify-center">
                        <Text className="text-gray-500 mb-2">Toque para adicionar uma imagem</Text>
                        <Text className="text-xs text-gray-400">Você pode tirar uma foto ou escolher da galeria</Text>
                      </View>
                    )}
              </TouchableOpacity>

              <View className='flex-row justify-between mt-[20px]'>
            
                <ButtonModal
                  title='Cancelar'
                  handlePress={() => closeModal(null, null)}
                  customStyles='bg-[#FF0000]'
                  textStyles="text-black "
                />

                <ButtonModal
                  title={evento? 'Salvar Evento' : 'Criar Evento'}
                  handlePress={validateEventAndClose}
                  textStyles="text-black "
                />
                  
              </View>

            {/* </Animated.View> */}
          </View>
        </ScrollView>
          
          {showTimePicker &&
            <TimePicker
                onClose={(time) => {
                    setShowTimePicker(false)
                    updateCampoData('horario', time)
                }}
            />
          }

      </View>
    </Modal>

    <ImageSelectionPopup
      visible={showImagePopup}
      onClose={handleCloseImagePopup}
      onTakePhoto={takePhoto}
      onPickFromGallery={pickImageFromGallery}
    />
    </>
  )
}
