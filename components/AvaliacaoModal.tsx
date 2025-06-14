import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import ButtonModal from './ButtonModal'
import FormFieldModal from './FormFieldModal'
import { RequestCreateAvaliacao } from '../types'
import { useAuthProvider } from '../app/context/AuthProvider'
import { createAvaliacaoSchema } from 'util/validationSchemas'

interface AvalicaoModalProps {
    idInfraestruturaCicloviaria: number 
    visible?: boolean
    closeModal: (requestCreateAvaliacao: RequestCreateAvaliacao | null ) => void
}



export default function AvaliacaoModal({ visible, closeModal, idInfraestruturaCicloviaria}: AvalicaoModalProps) {
  const { authState } = useAuthProvider()

  const [requestCreateAvaliacao, setRequestCreateAvaliacao] = useState({
    idUsuario: authState?.user?.id || 0,
    idInfraestruturaCicloviaria: idInfraestruturaCicloviaria,
    nota: 0,
    comentario: '',
    })

  const [requestCreateAvaliacaoError, setRequestCreateAvaliacaoError] = useState({	
    nota: '',
    comentario: ''
  })

  // useEffect(() => {
  //   if (visible) {
  //     Animated.timing(fadeAnim, {
  //       toValue: 1,
  //       duration: 800,
  //       useNativeDriver: true,
  //     }).start()
  //   } else {
  //     Animated.timing(fadeAnim, {
  //       toValue: 0,
  //       duration: 300,
  //       useNativeDriver: true,
  //     }).start()
  //   }
  // }, [visible, fadeAnim])

  // useEffect(() => {
  //   setRequestCreateAvaliacao((prev) => ({
  //     ...prev,
  //     comentario,
  //     nota: nota
  //   }))
  // }, [comentario, nota])

  const validateRequest = () => {
    setRequestCreateAvaliacaoError({ nota: '', comentario: '' })
    const validateResult = createAvaliacaoSchema.safeParse(requestCreateAvaliacao)
    if (!validateResult.success) {
      validateResult.error.issues.forEach(issue => {
        setRequestCreateAvaliacaoError(prev => ({ ...prev, 
          [issue.path[0]]: issue.message 
        }))
      })
      return
    }
    closeModal(requestCreateAvaliacao)
  }

  const renderStars = () => {
    const stars = [1, 2, 3, 4, 5]
    return (
      <View className="flex-row justify-center mb-4">
        {stars.map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => updateCampoAvaliacao("nota",star)}
            className="mx-1"
          >
            <Text
              className={`text-3xl color-black}`}
              style={{ color: star <= requestCreateAvaliacao.nota ? '#FFD700' :  '#CCC' }}
            >
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  }



  const updateCampoAvaliacao = (campo: string, value: string | number) => {
    setRequestCreateAvaliacao((prev)=>{
      return { 
        ...prev,
        [campo]: value
      }      
    })
  }


  return (
    <Modal animationType="slide" transparent={true}>
      {/* <Animated.View style={{ opacity: fadeAnim }}> */}
        <View className="flex-row bg-[rgba(0,0,0,0.5)] justify-center h-[100%] w-[100%] items-center">
          <View className='rounded-[10px] p-[20px] m-[20px] w-[90%] h-auto bg-white'>
            <Text className='flex-col text-lg font-bold text-center mb-10' >
              Avaliar Ciclovia
            </Text>

            <View className="mb-4">
              <Text className='text-[16px] text-matte_gray mb-[5px]' >
                Qualidade da Ciclovia:
              </Text> 
              <Text className="text-xs text-gray-400 text-center py-2">1 ★ = Insatisfatório ||
                 5 ★ = Muito satisfatório</Text>
              {renderStars()}
            </View>
            <Text className='text-color_red_error text-'>{requestCreateAvaliacaoError.nota}</Text>

            <FormFieldModal
              title="Comentário (opcional)"
              placeholder="Deixe seu comentário sobre a ciclovia"
              multiline={true}
              maxLength={200}
              handleChangeText={e=> updateCampoAvaliacao("comentario",e)}
              value={requestCreateAvaliacao.comentario}
              msg={requestCreateAvaliacaoError.comentario}
              endEditing={() => {}}
            />

            <View className="flex-row justify-between mt-4">
              <ButtonModal
                title="Cancelar"
                handlePress={() => closeModal(null)}
                textStyles='text-center color-black'
              />
              <ButtonModal
                title="Enviar Avaliação"
                handlePress={() => validateRequest()}
                customStyles='py-[10px] rounded-[8px] bg-green-500 border-[1px] border-green-300'
                disabled={requestCreateAvaliacao.nota===0}
                textStyles='text-center color-black'
              />
            </View>
          </View>
        </View>
      {/* </Animated.View> */}
    </Modal>
  )
}