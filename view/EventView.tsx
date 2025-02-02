import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Modal, Animated, ScrollView} from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { ListTipoEvento, TipoEvento } from '../types/tipo-evento';
import { getTipoEvento } from '../api/tipo-evento';

import { Evento, NivelHabilidade, RequestCreateEvento, RequestCreateEventoError, RequestUpdateEventoError, RequestUpdateEvento } from '../types';
import * as ImagePicker from 'expo-image-picker';
import { getCep, getViaCep } from '../api/endereco';
import { upateEventSchema } from '../util/validationSchemas';
import { createEvento } from '../api/evento';
import FormFieldModal from '../components/FormFieldModal';
import FormSelectFieldModal from '../components/FormSelectFieldModal';
import FormFieldCalendarSelectModal from '../components/FormFieldCalendarSelectModal';
import ButtonModal from '../components/ButtonModal';
import LoadingActivity from '../components/LoadingActivity';
import FormFieldDropdownSelectList from '../components/FormFieldDropdownSelectList';
import FormFieldViewModal from '../components/FormFieldViewModal';
import MapModalView from '../components/MapModalView';






interface EventModalProps {
  closeModal: () => void
  evento : Evento
}

const EventView: React.FC<EventModalProps> = ({ closeModal, evento}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const abortControllerRef = useRef(new AbortController())

  const [isEditing, setIsEditing] = useState(false)

  const [cep, setCep] = useState(evento.endereco.cep)
  const [cepError, setCepError] = useState('')
  const [isCepLoading, setIsCepLoading] = useState(false)

  const [estado, setEstado] = useState(evento.endereco.estado)
  const [cidade, setCidade] = useState(evento.endereco.cidade)
  const [bairro, setBairro] = useState(evento.endereco.bairro)
  const [rua, setRua] = useState(evento.endereco.rua)
  const [numero, setNumero] = useState(evento.endereco.numero.toString())   

  const [nome, setNome] = useState(evento.nome)
  const [descricao, setDescricao] = useState(evento.descricao)
  const [faixaKm, setfaixaKm] = useState(evento.faixaKm.toString())


  const [isSavingLoading, setIsSavingLoading] = useState(false)
  const [saveError, setSaveError] = useState('')


  
  const [mapPlotError, setMapPlotError] = useState('')
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  


  const [eventoToUpdate, setEventoToUpdate] = useState<RequestUpdateEvento>({id: evento.id, nome: evento.nome,descricao: evento.descricao,data: evento.data,endereco: {cep: evento.endereco.cep,cidade: evento.endereco.cidade,estado: evento.endereco.estado,bairro: evento.endereco.bairro,rua: evento.endereco.rua,numero: evento.endereco.numero,latitude: evento.endereco.latitude,longitude: evento.endereco.longitude    },faixaKm: evento.faixaKm,gratuito: evento.gratuito,tipoEvento: evento.tipoEvento })
  const [eventoToUpdateError, setEventoToUpdateError] = useState<RequestUpdateEventoError>({ nome: '', descricao: '', data: '', endereco: {cep: '', cidade: '', estado: '', bairro: '' , rua: '' ,  numero: '' }, faixaKm: '', gratuito: '', tipoEvento: ''})


  const [listTipoEvento, setListTipoEvento] = useState<ListTipoEvento[]> ([])

  useEffect(() => {
    if (evento) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();

      // Reset house number and selected location when modal opens
      handleSelectLocation({ nativeEvent: { coordinate: { latitude: -23.55052, longitude: -46.633308 } } }); // Reset selected location to default
      setMapRegion({
        latitude: -23.55052, // Default latitude
        longitude: -46.633308, // Default longitude
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [evento, fadeAnim]);


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
    })
  },[])


  const [mapRegion, setMapRegion] = useState({
    latitude: -23.55052,
    longitude: -46.633308,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [selectedLocation, setSelectedLocation] = useState< { latitude: number , longitude: number} | null>({ latitude: 0, longitude: 0 });

  const handleSelectLocation = (e: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  


  // const handleMapPress = async (e: any) => {
  //   const { latitude, longitude } = e.nativeEvent.coordinate;
  //   handleSelectLocation(e);
  
  //   try {
  //     setIsLoadingAddress(true);
  //     setAddressError('');
  //     setHouseNumber(''); // Reset house number when new location is selected
      
  //     const response = await axios.get(
  //       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`
  //     );
  
  //     if (response.data.results.length > 0) {
  //       const address = response.data.results[0];
        
  //       const postalCode = address.address_components.find(
  //         (component: any) => component.types.includes('postal_code')
  //       );
  
  //       if (postalCode) {
  //         const cep = postalCode.long_name.replace(/\D/g, '');
  //         updateEventField('cep', cep);
  //       }
  
  //       updateEventField('address', address.formatted_address);
  //     }
  //   } catch (error) {
  //     console.error('Error in reverse geocoding:', error);
  //     setAddressError('Erro ao buscar endereço. Tente novamente.');
  //   } finally {
  //     setIsLoadingAddress(false);
  //   }
  // };

  const checkCep = async (cep: string) => {
    if (cep.length !== 8) return
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()
    setIsCepLoading(true)
      getViaCep(cep, abortControllerRef.current).then((response) => {
        updateCampoNovoEventoEndereco('rua', response.logradouro)
        setRua(response.logradouro)
        updateCampoNovoEventoEndereco('bairro', response.bairro)
        setBairro(response.bairro)
        updateCampoNovoEventoEndereco('cidade', response.localidade)
        setCidade(response.localidade)
        updateCampoNovoEventoEndereco('estado', response.estado)
        setEstado(response.estado)
        // if (response.location.coordinates.latitude && response.location.coordinates.longitude) {
        //   const location = response.location.coordinates;
        //   handleSelectLocation({
        //     nativeEvent: {
        //       coordinate: {
        //         latitude: location.latitude,
        //         longitude: location.longitude
        //       }
        //     }
        //   })
  
        //   setMapRegion({
        //     latitude: location.latitude,
        //     longitude: location.longitude,
        //     latitudeDelta: 0.01,
        //     longitudeDelta: 0.01,
        //   })
        //   setCepError('')
        // } else {
        //   setMapPlotError('Latitude e Longitude não foram encontrados.')
        // }
      })
      .catch((error) =>{
        setCepError('Cep não encontrado. Tente novamente. Code Error: ' + error.message )
      })
      .finally(() => {
        setIsCepLoading(false)
      }) 
  }




  const checkEvento = () => {
     const result = upateEventSchema.safeParse(evento)
    //  console.log(result)
    if(!result.success){
      result.error.issues.map(issue => {
        setEventoToUpdateError({ nome: '', descricao: '', data: '', endereco: {cep: '', cidade: '', estado: '', bairro: '' , rua: '' ,  numero:'' }, faixaKm: '', gratuito: '', tipoEvento: ''})
        setEventoToUpdateError(prev => ({
            ...prev,
            [issue.path[0]]: issue.message
        }))
        result.error.issues.forEach((issue) => {
          setEventoToUpdateError((prev) => ({
            ...prev,
            [issue.path[0]]: issue.message,
          }))
          if(issue.path[0] === 'endereco'){
            setEventoToUpdateError((prev) => ({
              ...prev,
              endereco:{
                ...prev.endereco,
                [issue.path[1]]: issue.message,
              }
            }))
          }
        })
      })
      return false
    }else{
      setEventoToUpdateError({ nome: '', descricao: '', data: '', endereco: {cep: '', cidade: '', estado: '', bairro: '' , rua: '' ,  numero: '' }, faixaKm: '', gratuito: '', tipoEvento: ''})
      return true
    }

  }


  const handleSaveEvento = () => {
    if(!checkEvento()) return alert('Revise os campos')
        console.log('Evento a ser atualizado:', eventoToUpdate)
    // setIsSavingLoading(true)
    // abortControllerRef.current?.abort
    // abortControllerRef.current = new AbortController
    // updateEvento(eventoToUpdate, abortControllerRef.current)
    // .then((response)=>{
    //   alert('Evento: ' + response.nome + ' criado com sucesso')
    //   closeModal()
    // })
    // .catch((response)=>{
    //   alert('falha na criação do Evento. \n Code error: ' + response.message)
    //   setSaveError(response.message)
    // })
    // .finally(()=>{
    //   setIsSavingLoading(false)
    // })

  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, //desatualizado ImagePicker.MediaTypeOptions.All (VERIFICAR NA DOCUMENTAÇÃO UM MÉTODO MAIS RECENTE)
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setEventoToUpdate(prev => ({
        ...prev,
        image: result.assets[0].uri
      }));
    }
  };


  const updateCampoNovoEvento = (campo: string, valor: string | NivelHabilidade | number | TipoEvento | boolean) => {
    setEventoToUpdate(prev => ({
      ...prev,
      [campo]: valor
    }))
  }


  const updateCampoNovoEventoEndereco = (campo: string, valor: number | string) => {
    setEventoToUpdate(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        [campo]: valor
      }
    }))
  }


  const updateCampoNovoEventoTipoEvento = (campo: string, valor: TipoEvento) => {
    setEventoToUpdate(prev => ({
      ...prev,
      tipoEvento: valor
    }))
  }




  return (
    <>

    <Modal visible={evento!=null} animationType="slide" transparent={true} onRequestClose={closeModal}>
      <View className='flex-row bg-[rgba(0,0,0,0.5)] justify-center'>
        <ScrollView>
          <View className='bg-white flex-[1] rounded-[10px] p-[20px] m-[20px]'>
            <Animated.View style={{ opacity: fadeAnim }}>


               <View  className='mb-[2px]'>
                 {isEditing?( 
                 
                 <MapView
                    style={{ height: 200, width: '100%', marginBottom: 20 }}
                    className='h-[200px] w-full mb-[20px]'
                    region={mapRegion}
                    onRegionChangeComplete={setMapRegion}
                    // onPress={handleMapPress}
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
                
            ) : (
                 <MapModalView 
                    prop={eventoToUpdate.endereco}
                    raio={eventoToUpdate.faixaKm*100}
                  />                
                )}
                </View>
                  {mapPlotError && (
                    <Text className='text-color_red_error  my-2'>{'*'+mapPlotError}</Text>
                  )}
                  <Text>Selecione o local do evento:</Text>
                  <Text>1. Clique no mapa para selecionar o local, ou</Text>
                  <Text>2. Digite o CEP abaixo:</Text>
               
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
                msg={cepError? cepError : eventoToUpdateError.endereco.cep}
                disableEdit={!isEditing}
              />
              
              <FormFieldModal
                placeholder="Rua"
                value={rua}
                handleChangeText={setRua}
                validantionCheck={e => {updateCampoNovoEventoEndereco('rua', e.nativeEvent.text)}}
                keyboardType='default'
                msg={eventoToUpdateError.endereco.rua}
                disableEdit={!isEditing}
              />

              <FormFieldModal
                placeholder="Número"
                value={numero}
                handleChangeText={setNumero}
                validantionCheck={e => {updateCampoNovoEventoEndereco('numero', parseInt(e.nativeEvent.text))}}
                keyboardType="numeric"
                msg={eventoToUpdateError.endereco.numero}
                disableEdit={!isEditing}
              />

              
              <FormFieldModal
                placeholder="Bairro"
                value={bairro}
                handleChangeText={setBairro}
                validantionCheck={e => {updateCampoNovoEventoEndereco('bairro', e.nativeEvent.text)}}
                keyboardType='default'
                msg={eventoToUpdateError.endereco.bairro}
                disableEdit={!isEditing}
              />
              
              
              <FormFieldModal
                placeholder="Cidade"
                value={cidade}
                handleChangeText={setCidade}
                validantionCheck={e => {updateCampoNovoEventoEndereco('cidade', e.nativeEvent.text)}}
                keyboardType='default'
                msg={eventoToUpdateError.endereco.cidade}
                disableEdit={!isEditing}
              />

              <FormFieldModal
                value={estado}
                handleChangeText={setEstado}
                validantionCheck={ e=> updateCampoNovoEventoEndereco('estado', e.nativeEvent.text)}
                placeholder='Estado'
                msg={eventoToUpdateError.endereco.estado}
                disableEdit={!isEditing}
              />
              
                
              <FormFieldModal
                title='Nome'
                value={nome}
                handleChangeText={setNome}
                validantionCheck={ e=> updateCampoNovoEvento('nome', e.nativeEvent.text)}
                placeholder='Digite o nome do evento'
                msg={eventoToUpdateError.nome}
                disableEdit={!isEditing}
              />


              
              <FormFieldModal
                title='Descrição'
                value={descricao}
                handleChangeText={setDescricao}
                validantionCheck={e => updateCampoNovoEvento('descricao', e.nativeEvent.text)}
                placeholder='Descrição do Evento...'
                multiline={true}
                msg={eventoToUpdateError.descricao}
                disableEdit={!isEditing}
              />


              <FormFieldDropdownSelectList
                title='Tipos de Eventos'
                selectedValue={eventoToUpdate.tipoEvento}
                options={listTipoEvento}
                handleChange={(value) => updateCampoNovoEventoTipoEvento('tipoEvento', value)}  
                disableEdit={!isEditing}   
              />

            
              
             
              <FormFieldModal
                title="Tamanho do Percurso"
                placeholder="Tamanho do Percurso (km)"
                value={faixaKm}
                handleChangeText={setfaixaKm}
                validantionCheck={e => (updateCampoNovoEvento('faixaKm', parseInt(e.nativeEvent.text))) }
                msg={eventoToUpdateError.faixaKm}
                keyboardType="numeric"
                disableEdit={!isEditing}
              />



              <FormSelectFieldModal
                handleChangeValue={(value) => updateCampoNovoEvento('gratuito', value)}
                value={eventoToUpdate.gratuito}
                title='O evento é gratuito ou pago?'
                option_1='Gratuito'
                option_2='Pago'
                disableEdit={!isEditing}
              />

        


              <FormFieldCalendarSelectModal
                value={eventoToUpdate.data}
                handleChangeValue={(e) => updateCampoNovoEvento('data', e)}
                disabled={!isEditing}
              />

              
              <View className='mb-[20px]'>
                <Text className='mt-[10px] text-[14px] text-[#666]' >Localização Selecionada:</Text>
                <Text>
                  {selectedLocation
                    ? `Latitude: ${selectedLocation.latitude}, Longitude: ${selectedLocation.longitude}`
                    : 'Nenhuma localização selecionada'}
                </Text>
              </View>

                  
              
              {saveError && (
                <Text className='text-color_red_error  my-2'>{'*'+saveError}</Text>
              )}




              {isEditing?(
                <View className='flex-row justify-between mt-[20px]'>
            
                <ButtonModal
                  title='Cancelar'
                  handlePress={closeModal}
                  customStyles='bg-[#FF0000]'
                />

                <ButtonModal
                  title='Salvar Evento'
                  handlePress={handleSaveEvento}
                  disabled={!selectedLocation || !eventoToUpdate.nome || !eventoToUpdate.descricao || !eventoToUpdate.data}
                />
                  
              </View>
              ) : (

              <View className='flex-row justify-between mt-[20px]'>
            
                <ButtonModal
                  title='Editar'
                  handlePress={() => setIsEditing(true)}
                />

                <ButtonModal
                  title='Fechar'
                  handlePress={closeModal}
                  customColor='bg-[#FF0000]'
                />

              </View>


              )
              
                  
              
              }

        

                        

                        
            </Animated.View>
          </View>


        </ScrollView>
      </View>
    </Modal>

    {isSavingLoading && (
      <LoadingActivity />
    )}
    
    </>
  );
};



export default EventView;