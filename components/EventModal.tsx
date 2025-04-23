import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Modal, Animated, ScrollView, Image, TouchableOpacity} from 'react-native';
import { Region } from 'react-native-maps';
import { ListTipoEvento, TipoEvento } from '../types/tipo-evento';
import { getTipoEvento } from '../api/tipo-evento';
import FormFieldDropdownSelectList from './FormFieldDropdownSelectList';
import { Evento, NivelHabilidade, RequestCreateEvento, RequestCreateEventoError } from '../types';
import * as ImagePicker from 'expo-image-picker';
import { getCep, getCepByLatAndLong } from '../api/endereco';
import { createEventSchema } from '../util/validationSchemas';
import FormFieldModal from './FormFieldModal';
import FormSelectFieldModal from './FormSelectFieldModal';
import FormFieldCalendarSelectModal from './FormFieldCalendarSelectModal';
import ButtonModal from './ButtonModal';
import MapModalEdit from './MapModalEdit';
import MapModalView from './MapModalView';
import { useAuthProvider } from '../app/context/AuthProvider';
import FormFieldTime from './FormFieldTime';
import CustomButton from './CustomButton';
import ImageSelectionPopup from '../components/ImgPickerModal'

interface EventModalProps {
  visible: boolean
  evento?: Evento
  closeModal: ( requestCreateEvento: RequestCreateEvento | null, requestCreateEventoImage: string | null ) => void
}

const EventModal = ({ visible, closeModal, evento }: EventModalProps) => {


  const { authState } = useAuthProvider()

  // const fadeAnim = useRef(new Animated.Value(0)).current;

  const abortControllerRef = useRef(new AbortController())

  const [cep, setCep] = useState( evento?.endereco.cep ||'')
  const [cepError, setCepError] = useState('')
  const [isCepLoading, setIsCepLoading] = useState(false)

  const [estado, setEstado] = useState( evento?.endereco.estado ||'')
  const [cidade, setCidade] = useState( evento?.endereco.cidade ||'')
  const [bairro, setBairro] = useState( evento?.endereco.bairro ||'')
  const [rua, setRua] = useState( evento?.endereco.rua ||'')
  const [numero, setNumero] = useState( evento?.endereco.numero.toString() ||'')

  const [nome, setNome] = useState( evento?.nome ||'')
  const [descricao, setDescricao] = useState( evento?.descricao ||'')
  const [faixaKm, setfaixaKm] = useState( evento?.faixaKm.toString() ||'')

  const [site, setSite]= useState( evento?.urlSite ||'')
  const [image, setImage] = useState<string | null>( evento?.s3Url || null)



  const [mapRegion, setMapRegion] = useState<Region | null>()
  const [mapPlotError, setMapPlotError] = useState('')

  const [mapViewRegion, setMapViewRegion] = useState<Region | null>(null)


  const [requestCreateEvento, setRequestCreateEvento] = useState<RequestCreateEvento>({ nome: evento?.nome || '', descricao: evento?.descricao || '', data: evento?.data || '', endereco: evento?.endereco || {cep: '', cidade: '', estado: '', bairro: '' , rua: '' ,  numero: 0, latitude: 0, longitude: 0}, faixaKm: evento?.faixaKm || 0, gratuito: evento?.gratuito || false, urlSite: evento?.urlSite || '' , tipoEvento: evento?.tipoEvento || {id: 0, nome: '', nivelHabilidade: {id: 0, descricao: '', nome: '' }}, idUsuario: authState?.user?.id || 0  })

  const [novoEventoError, setNovoEventoError] = useState<RequestCreateEventoError>({ nome: '', descricao: '', data: '', endereco: {cep: '', cidade: '', estado: '', bairro: '' , rua: '' ,  numero: '' }, faixaKm: '', gratuito: '', urlSite: '' , tipoEvento: ''})

  const [showImagePopup, setShowImagePopup] = useState(false)

  const [listTipoEvento, setListTipoEvento] = useState<ListTipoEvento[]> ([])

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
    setCepError('')
    setMapPlotError('')
      getCep(cep, abortControllerRef.current).then((response) => {
        updateCampoNovoEventoEndereco('rua', response.street)
        setRua(response.street)
        updateCampoNovoEventoEndereco('bairro', response.neighborhood)
        setBairro(response.neighborhood)
        updateCampoNovoEventoEndereco('cidade', response.city)
        setCidade(response.city)
        updateCampoNovoEventoEndereco('estado', response.state)
        setEstado(response.state)
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
          setCepError('')
        } else {
          setMapPlotError('Latitude e Longitude não foram encontrados.')
        }
      })
      .catch((error) =>{
        setCepError('Cep não encontrado. Tente novamente. Code Error: ' + error.message )
      })
      .finally(() => {
        setIsCepLoading(false)
      }) 
  }




  const validateEventAndClose = () => {
    const result = createEventSchema.safeParse(requestCreateEvento)
    console.log(result)
    if(!result.success){
      result.error.issues.map(issue => {
        setNovoEventoError({ nome: '', descricao: '', data: '', endereco: {cep: '', cidade: '', estado: '', bairro: '' , rua: '' ,  numero:'' }, faixaKm: '', gratuito: '', urlSite: '', tipoEvento: ''})
        setNovoEventoError(prev => ({
            ...prev,
            [issue.path[0]]: issue.message
        }))
        result.error.issues.forEach((issue) => {
          setNovoEventoError((prev) => ({
            ...prev,
            [issue.path[0]]: issue.message,
          }))
          if(issue.path[0] === 'endereco'){
            setNovoEventoError((prev) => ({
              ...prev,
              endereco:{
                ...prev.endereco,
                [issue.path[1]]: issue.message,
              }
            }))
          }
        })
      })
    }else{
      
      closeModal(requestCreateEvento, image)
    }
  }

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        alert('Desculpe, precisamos de permissão para acessar!')
        return;
      }
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
      })
  
      if (!result.canceled && result.assets[0].uri) {
        setImage(result.assets[0].uri)
        
      }
    } catch (error) {
      console.error("Error picking image:", error)
    }
  }

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
      getCep(response.cep, abortControllerRef.current).then((response) => {
        updateCampoNovoEventoEndereco('rua', response.street)
        setRua(response.street)
        updateCampoNovoEventoEndereco('bairro', response.neighborhood)
        setBairro(response.neighborhood)
        updateCampoNovoEventoEndereco('cidade', response.city)
        setCidade(response.city)
        updateCampoNovoEventoEndereco('estado', response.state)
        setEstado(response.state)
        updateCampoNovoEventoEndereco('cep', response.cep)
        setCep(response.cep)

      })
      .catch((error) =>{
        setCepError('Cep não encontrado. Tente novamente. Code Error: ' + error.message )
      })
      .finally(() => {
        setIsCepLoading(false)
      }) 
      

    })
    .catch(error => {
        setMapPlotError("Cep não foi encontrado." + error)
    })
  }, [mapRegion])



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
                value={cep}
                otherStyles='mt-[2px]'
                handleChangeText={setCep}
                validantionCheck={ e=> {
                  if (cep.length === 8) {
                    checkCep(cep);
                    updateCampoNovoEventoEndereco('cep', e.nativeEvent.text)
                  }
                }}
                placeholder='Digite o cep'
                maxLength={8}
                keyboardType='numeric'
                isLoading={isCepLoading}
                msg={cepError? cepError : novoEventoError.endereco.cep}     
              />
              
              <FormFieldModal
                placeholder="Rua"
                value={rua}
                handleChangeText={setRua}
                validantionCheck={e => {updateCampoNovoEventoEndereco('rua', e.nativeEvent.text)}}
                keyboardType='default'
                msg={novoEventoError.endereco.rua}
              />

              <FormFieldModal
                placeholder="Número"
                value={numero}
                handleChangeText={setNumero}
                validantionCheck={e => {updateCampoNovoEventoEndereco('numero', parseInt(e.nativeEvent.text))}}
                keyboardType="numeric"
                msg={novoEventoError.endereco.numero}
              />

              {/* bairro */}
              <FormFieldModal
                placeholder="Bairro"
                value={bairro}
                handleChangeText={setBairro}
                validantionCheck={e => {updateCampoNovoEventoEndereco('bairro', e.nativeEvent.text)}}
                keyboardType='default'
                msg={novoEventoError.endereco.bairro}
              />
              
              
              <FormFieldModal
                placeholder="Cidade"
                value={cidade}
                handleChangeText={setCidade}
                validantionCheck={e => {updateCampoNovoEventoEndereco('cidade', e.nativeEvent.text)}}
                keyboardType='default'
                msg={novoEventoError.endereco.cidade}
              />

              <FormFieldModal
                value={estado}
                handleChangeText={setEstado}
                validantionCheck={ e=> updateCampoNovoEventoEndereco('estado', e.nativeEvent.text)}
                placeholder='Estado'
                msg={novoEventoError.endereco.estado}
                  
              />
              
                
              <FormFieldModal
                title='Nome'
                value={nome}
                handleChangeText={setNome}
                validantionCheck={ e=> updateCampoNovoEvento('nome', e.nativeEvent.text)}
                placeholder='Digite o nome do evento'
                msg={novoEventoError.nome}
              />
              


              
              <FormFieldModal
                title='Descrição'
                value={descricao}
                handleChangeText={setDescricao}
                validantionCheck={e => updateCampoNovoEvento('descricao', e.nativeEvent.text)}
                placeholder='Descrição do Evento...'
                multiline={true}
                msg={novoEventoError.descricao}
              />

              <FormFieldModal
                title='Site'
                value={site}
                handleChangeText={setSite}
                validantionCheck={ e=> updateCampoNovoEvento('urlSite', e.nativeEvent.text)}
                placeholder='Digite o site do evento'
                msg={novoEventoError.urlSite}
              />
            

              <FormFieldDropdownSelectList
                title='Tipos de Eventos'
                selectedValue={requestCreateEvento.tipoEvento}
                options={listTipoEvento}
                handleChange={(value) => updateCampoNovoEventoTipoEvento(value)}     
              />

            
              
              <FormFieldModal
                title="Tamanho do Percurso"
                placeholder="Tamanho do Percurso (km)"
                value={faixaKm}
                handleChangeText={setfaixaKm}
                validantionCheck={e => (updateCampoNovoEvento('faixaKm', parseInt(e.nativeEvent.text))) }
                msg={novoEventoError.faixaKm}
                keyboardType="numeric"
              />



              <FormSelectFieldModal
                handleChangeValue={(value) => updateCampoNovoEvento('gratuito', value)}
                value={requestCreateEvento.gratuito}
                title='O evento é gratuito ou pago?'
                option_1='Gratuito'
                option_2='Pago'
              />



              <FormFieldTime                
                  value={requestCreateEvento.data}
                  handleChangeValue={(e) => updateCampoNovoEvento('data', e)}
              />



              <FormFieldCalendarSelectModal
                value={requestCreateEvento.data}
                handleChangeValue={(e) => updateCampoNovoEvento('data', e + requestCreateEvento.data)}
                
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
                />

                <ButtonModal
                  title={evento? 'Salvar Evento' : 'Criar Evento'}
                  handlePress={validateEventAndClose}
                  // disabled={}
                />
                  
              </View>



              
            {/* </Animated.View> */}
          </View>
        </ScrollView>
      </View>
    </Modal>

    <ImageSelectionPopup
      visible={showImagePopup}
      onClose={handleCloseImagePopup}
      onTakePhoto={takePhoto}
      onPickFromGallery={pickImageFromGallery}
    />
    </>
  );
};



export default EventModal;