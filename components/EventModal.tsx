import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, Animated, ScrollView, ActivityIndicator } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import { TipoEvento } from '../types/tipo-evento';
import { getTipoEvento } from '../api/tipo-evento';
import FormFieldDropdownSelectList from './FormFieldDropdownSelectList';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NivelHabilidade, RequestCreateEvento, RequestCreateEventoError } from '../types';
import * as ImagePicker from 'expo-image-picker';
import { set } from 'zod';
import { getCep } from '../api/endereco';
import { createEventSchema } from '../util/validationSchemas';
import { createEvento } from '../api/evento';
import FormFieldModal from './FormFieldModal';
import FormSelectFieldModal from './FormSelectFieldModal';
import FormFieldCalendarSelectModal from './FormFieldCalendarSelectModal';
import LoadingActivity from './LoadingActivity';




interface EventItem {
  eventName: string;
  description: string;
  date: string;
  isFree: boolean;
  address?: string;
  cep?: string;
  routeDistance?: string;
}

interface ListTipoEvento {
  nome: string
  id: number
  value: TipoEvento
}

interface EventModalProps {
  visible: boolean;
  onClose: () => void;
  mapRegion: any;
  setMapRegion: (region: any) => void;
  selectedLocation: { latitude: number; longitude: number } | null;
  handleSelectLocation: (e: any) => void;
  resetForm: () => void;
}

const EventModal: React.FC<EventModalProps> = ({
  visible,
  onClose,
  mapRegion,
  setMapRegion,
  selectedLocation,
  handleSelectLocation,
  resetForm,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showCalendar, setShowCalendar] = useState(false);

  const abortControllerRef = useRef(new AbortController())

  const [cep, setCep] = useState('')
  const [cepError, setCepError] = useState('')
  const [isCepLoading, setIsCepLoading] = useState(false)

  const [estado, setEstado] = useState('')
  const [cidade, setCidade] = useState('')
  const [bairro, setBairro] = useState('')
  const [rua, setRua] = useState('')
  const [numero, setNumero] = useState('')

  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [faixaKm, setfaixaKm] = useState('')


  const [isSavingLoading, setIsSavingLoading] = useState(false)
  const [saveError, setSaveError] = useState('')


  
  const [mapPlotError, setMapPlotError] = useState('')
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  


  const [novoEvento, setNovoEvento] = useState<RequestCreateEvento>({ nome: '', descricao: '', data: '', endereco: {cep: '', cidade: '', estado: '', bairro: '' , rua: '' ,  numero: 0 }, faixaKm: 0, gratuito: false, tipoEvento: {id: 0, nome: '', nivelHabilidade: {id: 0, descricao: '', nome: ''}}})
  const [novoEventoError, setNovoEventoError] = useState<RequestCreateEventoError>({ nome: '', descricao: '', data: '', endereco: {cep: '', cidade: '', estado: '', bairro: '' , rua: '' ,  numero: '' }, faixaKm: '', gratuito: '', tipoEvento: ''})


  const [listTipoEvento, setListTipoEvento] = useState<ListTipoEvento[]> ([])

  useEffect(() => {
    if (visible) {
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
  }, [visible, fadeAnim]);


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
          const location = response.location.coordinates;
          handleSelectLocation({
            nativeEvent: {
              coordinate: {
                latitude: location.latitude,
                longitude: location.longitude
              }
            }
          })
  
          setMapRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          })
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

  const handleDayPress = (day: any) => {
    updateCampoNovoEvento('data', day.dateString);
    setShowCalendar(false);
  };



  const checkEvento = () => {
     const result = createEventSchema.safeParse(novoEvento)
    //  console.log(result)
    if(!result.success){
      result.error.issues.map(issue => {
        setNovoEventoError({ nome: '', descricao: '', data: '', endereco: {cep: '', cidade: '', estado: '', bairro: '' , rua: '' ,  numero:'' }, faixaKm: '', gratuito: '', tipoEvento: ''})
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
      return false
    }else{
      setNovoEventoError({ nome: '', descricao: '', data: '', endereco: {cep: '', cidade: '', estado: '', bairro: '' , rua: '' ,  numero: '' }, faixaKm: '', gratuito: '', tipoEvento: ''})
      return true
    }

  }


  const handleSaveEvento = () => {
    if(!checkEvento()) return alert('Revise os campos')
    setIsSavingLoading(true)
    abortControllerRef.current?.abort
    abortControllerRef.current = new AbortController
    createEvento(novoEvento, abortControllerRef.current)
    .then((response)=>{
      alert('Evento: ' + response.nome + ' criado com sucesso')

    })
    .catch((response)=>{
      alert('falha na criação do Evento. \n Code error: ' + response.message)
      setSaveError(response.message)
    })
    .finally(()=>{
      setIsSavingLoading(false)
    })

  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setNovoEvento(prev => ({
        ...prev,
        image: result.assets[0].uri
      }));
    }
  };


  const updateCampoNovoEvento = (campo: string, valor: string | NivelHabilidade | number | TipoEvento | boolean) => {
    setNovoEvento(prev => ({
      ...prev,
      [campo]: valor
    }))
  }


  const updateCampoNovoEventoEndereco = (campo: string, valor: number | string) => {
    setNovoEvento(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        [campo]: valor
      }
    }))
  }


  const updateCampoNovoEventoTipoEvento = (campo: string, valor: TipoEvento) => {
    setNovoEvento(prev => ({
      ...prev,
      tipoEvento: valor
    }))
  }




  return (
    <SafeAreaView>

    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <ScrollView>
          <View style={styles.modalContainer}>
            <Animated.View style={{ opacity: fadeAnim }}>
               {/* Mapa do Evento */}
               <View style={{ marginBottom: 2 }}>
                  <MapView
                    style={{ height: 200, width: '100%', marginBottom: 20 }}
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
                msg={novoEventoError.endereco.cep}
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


              <FormFieldDropdownSelectList
                title='Tipos de Eventos'
                selectedValue={novoEvento.tipoEvento}
                options={listTipoEvento}
                handleChange={(value) => updateCampoNovoEventoTipoEvento('tipoEvento', value)}     
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
                value={novoEvento.gratuito}
                title='O evento é gratuito ou pago?'
                option_1='Gratuito'
                option_2='Pago'
              />

        


              <FormFieldCalendarSelectModal
                value={novoEvento.data}
                handleChangeValue={(e) => updateCampoNovoEvento('data', e)}
                showCalendar={showCalendar}
                setShowCalendar={setShowCalendar}
              />

              
              <View className='mb-[20px]'>
                <Text style={styles.locationText}>Localização Selecionada:</Text>
                <Text>
                  {selectedLocation
                    ? `Latitude: ${selectedLocation.latitude}, Longitude: ${selectedLocation.longitude}`
                    : 'Nenhuma localização selecionada'}
                </Text>
              </View>

                  
                
                {saveError && (
                  <Text className='text-color_red_error  my-2'>{'*'+saveError}</Text>
                )}

              {/* Botões Cancelar e Salvar */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={resetForm} style={styles.cancelButton}>
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSaveEvento}
                  disabled={!selectedLocation || !novoEvento.nome || !novoEvento.descricao || !novoEvento.data}
                  style={[
                    styles.saveButton,
                    {
                      backgroundColor:
                        !selectedLocation || !novoEvento.nome || !novoEvento.descricao || !novoEvento.data
                          ? '#CCC'
                          : '#C3FF00',
                    },
                  ]}
                >
                  <Text style={styles.buttonText}>Salvar Evento</Text>
                </TouchableOpacity>
              </View>



              
            </Animated.View>
          </View>
        </ScrollView>
      </View>
    </Modal>

    {isSavingLoading && (
      <LoadingActivity />
    )}
    
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16, 
    marginBottom: 5,
    color: '#555',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 20,
    padding: 20,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  datePicker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    marginLeft: 10,
    color: '#555',
  },
  calendarOverlay: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden'
  },
  priceTypeContainer: {},
  priceTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  priceTypeButtonActive: {},
  priceTypeButtonText: {
    fontSize: 16,
    marginLeft: 10,
  },
  locationText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
  saveButton: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default EventModal;