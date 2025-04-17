import { View, Text, Animated, Modal, ScrollView , Image} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ButtonModal from './ButtonModal'
import FormFieldModal from './FormFieldModal'
import * as ImagePicker from 'expo-image-picker'
import { ListTipoProblema, RequestCreateProblema, TipoProblema } from '../types'
import FormFieldDropdownSelectList from './FormFieldDropdownSelectList'
import { getTipoProblema } from '../api/tipo-problema'
import { set } from 'zod'
import CustomButton from './CustomButton'



interface ModalProps {
    visible: boolean
    closeModal: (problema: RequestCreateProblema|null, image : string | null) => void
    coords: {latitude: number, longitude: number}
}

        

export default function ProblemaModal( {visible, closeModal, coords}: ModalProps) {


    const [listTipoProblema, setListTipoProblema] = useState<ListTipoProblema[]>([])

    const [descricao, setDecricao] = useState<string>('')	

    const [image, setImage] = useState<string | null>(null)

    const fadeAnim = useRef(new Animated.Value(0)).current
    const [problema, setProblema] = useState<RequestCreateProblema>({
        descricao: '',
        ativo: true,
        latitude: coords.latitude,
        longitude: coords.longitude,
        idTipoProblema: 1
    })




    useEffect(() => {
        if (visible) {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start()

        
        } else {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start()
        }
    }, [visible, fadeAnim])


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


    useEffect(()=>{
        getTipoProblema()
        .then((response) => {
           setListTipoProblema([]) 
           response.map((tipoProblema) => {
                setListTipoProblema((prevState) => {
                    return [
                        ...prevState,
                        {
                            nome: tipoProblema.descricao,
                            id: tipoProblema.id,
                            value: tipoProblema
                        } 
                    ]
                })
            })
            
            
        })
        .catch((error) => {
            console.log('Error fetching tipo problema:', error)
        })


    },[])





    const updateCampoProblema = (campo: string, value: string) => {
        setProblema((prevState) => {
            return {
                ...prevState,
                [campo]: value
            } as RequestCreateProblema
        })
    }



  return (
    <>
    <Modal visible={visible} animationType='slide' transparent={true}>
        
        <Animated.View style={{opacity: fadeAnim}}>
            <View className='flex-row bg-[rgba(0,0,0,0.5)] justify-center h-[100%] w-[100%] items-center'>
                    <ScrollView className={"rounded-[10px] p-[20px] m-[20px] bg-white w-[90%] h-auto"}>
                        <FormFieldModal
                            title='Descrição do problema'
                            placeholder='Descreva o problema'
                            multiline={true}
                            maxLength={100}
                            handleChangeText={setDecricao}
                            value={descricao}
                            validantionCheck={e => {updateCampoProblema('descricao', e.nativeEvent.text )}}
                            />
                        <FormFieldDropdownSelectList
                            title='Tipo de Problema'
                            selectedValue={listTipoProblema.find((item) => item.id === problema.idTipoProblema)}
                            options={listTipoProblema}
                            handleChange={e => {updateCampoProblema('idTipoProblema', e.id)}}
                            isLoading={false}
                            dropDownSize={'100%'}            

                            />
                        {image ?
                            (<View>
                                <Image className='h-[120px] w-[100%] rounded-[10px] mb-1 border-[1px] border-color__lightGray' src={image}></Image>
                            </View>)
                            :
                            (<View className='h-[120px] w-[100%] mb-1 bg-[#f0f0f0] rounded-[10px] items-center justify-center'>
                                <Text>Nenhuma Imagem selecionada</Text>
                            </View>)
                        }
                        <View className='mb-16 mt-[-40px]'>
                            <CustomButton
                                title='Selecionar Imagem'
                                handlePress={pickImage}
                                containerStyles='w-[100%] h-fit rounded-[10px]'
                                textStyles='text-black'
                            />
                        </View>

                        <View className='flex-row justify-between'>
                            {problema &&
                                <ButtonModal
                                title='Cancelar'
                                handlePress={() => closeModal(null, null)}
                                customStyles=''
                                textStyles='text-black'
                                />
                            }

                            <ButtonModal
                                title='Reportar !'
                                handlePress={() => closeModal(problema, image)}
                                customStyles='bg-[#ffcc00]'
                                textStyles='text-black'
                            />
                        </View>
                    </ScrollView>    

                
            </View>
        </Animated.View>
    </Modal>
    </>
  )
}