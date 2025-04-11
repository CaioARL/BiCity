import { View, Text, Animated, Modal, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ButtonModal from './ButtonModal'
import FormFieldModal from './FormFieldModal'
import { ListTipoProblema, RequestCreateProblema, TipoProblema } from '../types'
import FormFieldDropdownSelectList from './FormFieldDropdownSelectList'
import { getTipoProblema } from '../api/tipo-problema'
import { set } from 'zod'
import CustomButton from './CustomButton'


interface ModalProps {
    visible: boolean
    closeModal: (problema: RequestCreateProblema|null) => void
    coords: {latitude: number, longitude: number}
}

        

export default function ProblemaModal( {visible, closeModal, coords}: ModalProps) {


    const [listTipoProblema, setListTipoProblema] = useState<ListTipoProblema[]>([])

    const [descricao, setDecricao] = useState<string>('')	

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
                        <View className='flex-row justify-between'>
                            {problema &&
                                <ButtonModal
                                title='Cancelar'
                                handlePress={() => closeModal(null)}
                                customStyles=''
                                textStyles='text-black'
                                />
                            }

                            <ButtonModal
                                title='Reportar !'
                                handlePress={() => closeModal(problema)}
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