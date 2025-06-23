import React, { useEffect } from 'react'
import { Problema, RequestProblemaReport } from '../types'
import { Text, View, Image, TouchableOpacity, ScrollView, Appearance } from 'react-native'
import { Ionicons } from "@expo/vector-icons";
import { useState } from 'react'
import { useAuthProvider } from 'app/context/AuthProvider';
import { reportProblema } from 'api/problema';

interface ProblemaViewProps {
    problema: Problema
    onClose: () => void
}

export default function ProblemaView( { problema , onClose} : ProblemaViewProps) {
    const theme = Appearance.getColorScheme()
    const [requestProblemaReport,setRequestProblemaReport] = useState<RequestProblemaReport | null >(null)
    const [erroMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [loading, setLoading] = useState(false)
    
    const { authState } = useAuthProvider()

    useEffect(() => {
    if (!requestProblemaReport) return
        setLoading(true) 
        reportProblema(requestProblemaReport, null)
        .then(() => {
            setSuccessMessage("Problema reportado com sucesso")
            setLoading(false)
        }).catch((error) => {
            error.response.status === 400 ? (
                setErrorMessage("Você já reportou esse problema")
            ) 
            : (
                setErrorMessage("Erro ao reportar problema")
            )
            setLoading(false)
        }).finally(() => {
            setRequestProblemaReport(null)
            setLoading(false)
        })
    }, [requestProblemaReport])

  return (
    <View className=" absolute top-0 left-0 z-10 flex-col justify-center items-center w-full h-full py-[20%]">
        <TouchableOpacity className="w-full h-full" onPress={onClose} />
 
     <View className={`p-[30px] rounded-lg shadow-md h-fit w-[94%] justify-start ${theme==='light'?'bg-white':'bg-secondary_black'}`}>
        <View className='flex-row justify-between items-center mb-[8px]'>
   
            <View style={{width: 24}} />
            <Text className={`text-lg font-bold ${theme==='light'?'text-black':'text-white'}`}>Problema da Ciclovia</Text>
        
        
            <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color={theme==='light'?'#555':'white'} />
            </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
        
        <View key={problema.id} className="flex-row items-start">
            <View className="flex-col flex-grow-[1px] justify-center items-center my-4 pr-[10px]">
                <Image
                    source={
                        problema.tipoProblema.id === 1?( require('../assets/problema/problema_tipo_1.png')) 
                        :
                        problema.tipoProblema.id === 2?( require('../assets/problema/problema_tipo_2.png') )
                        : 
                        problema.tipoProblema.id === 3?( require('../assets/problema/problema_tipo_3.png') )
                        :
                        problema.tipoProblema.id === 4?( require('../assets/problema/problema_tipo_4.png') ) 
                        :
                        problema.tipoProblema.id === 5?( require('../assets/problema/problema_tipo_5.png') )   
                        :
                        problema.tipoProblema.id === 6?( require('../assets/problema/problema_tipo_6.png') )   
                        :
                        problema.tipoProblema.id === 7?( require('../assets/problema/problema_tipo_7.png') )   
                        :  
                        problema.tipoProblema.id === 8?( require('../assets/problema/problema_tipo_8.png') )   
                        :  
                          require('../assets/problema/problema_tipo_1.png')}
                    className="w-20 h-20 rounded-full border-color_light_gray"
                    style={{ width: 65, height: 65, borderRadius: 50, borderWidth: 1,  marginRight: 10 }}
                />
                {/* <Text className='text-[12px] text-matte_gray '>Nome do Usuario</Text> */}
            </View>

            <View className='flex-col flex-grow-[2px] w-[60%] p-[10px] justify-between text-left my-4 border-color_light_gray rounded-[10px]' style={{ borderWidth: 1, borderRadius: 10 }}>
            <Text className={`text-[12px] mb-[5px] font-bold capitalize ${theme==='light'?'text-matte_gray':'text-white'}`}>{problema.tipoProblema.descricao}</Text>

            <Text className={`text-[12px] text-matte_gray mb-[5px] ${theme==='light'?'text-matte_gray':'text-color_lightGray'}`}>{problema.descricao}</Text>
            
                <View className="w-full flex-row justify-end">
                    <Text className={`text-[12px] ${theme==='light'?'text-matte_gray':'text-color_lightGray'}`}>
                    {problema.dtCriacao}
                    </Text>
                </View>
            </View>
        </View>


      {problema.s3Url ? 
        (<View className='flex-col flex-grow-[2px] w-full h-fit p-[10px] justify-between text-left my-4 border-color_light_gray rounded-[10px]' style={{ borderWidth: 1, borderRadius: 10 }}>
            {problema.s3Url && <Image className="w-full h-[125px] rounded-[10px]" src={problema.s3Url}/>}
           
        </View>)
        :
        (<View className='flex-row w-full h-fit p-[10px] justify-center items-center my-4 rounded-[10px]'
            style={{borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10}}>
            <Ionicons name="image-outline" size={24} color={theme==='light'?'#555':'white'}style={{ marginLeft: 5 }} />
        </View>)
        } 

        <View className="mt-4 mb-2 flex-row justify-between items-center">
            {erroMessage || successMessage ? (
                <Text className={`text-[12px] ${erroMessage? 'color-color_red_error' : 'color-color_green_success'} font-semibold`}>{erroMessage || successMessage}</Text>
            ) 
            : 
            (<>
                <TouchableOpacity 
                className='flex-row items-center'
                disabled={loading}
                onPress={()=> authState?.user ? setRequestProblemaReport({problemaId: problema.id, usuarioId: authState.user.id, exists: true}) : setErrorMessage('Você precisa estar logado para reportar um problema')}
                >
                    {/* <Image style={{ width: 30, height: 30, objectFit: 'cover' }} source={require('../assets/img/ativo.png')} /> */}
                    <Ionicons name='thumbs-up-outline' size={20} className={`border-[1px] p-[5px] rounded-full border-color_green_success ${theme==='light'?'text-matte_gray':'text-white'}`} color={theme==='light'?'black':'white'}/>
                    <Text className={`ml-2 text-[12px] font-semibold ${theme==='light'?'text-matte_gray':'text-white'}`}>Sim, ainda ativo</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                className='flex-row items-center'
                disabled={loading}
                onPress={()=> authState?.user ? setRequestProblemaReport({problemaId: problema.id, usuarioId: authState.user.id, exists: false}) : setErrorMessage('Você precisa estar logado para reportar um problema')}
                >
                    {/* <Image style={{ width: 30, height: 30, objectFit: 'cover'}} source={require('../assets/img/desativo.png')} /> */}
                    <Ionicons name='thumbs-down-outline' size={20} className={`border-[1px] p-[5px] rounded-full border-color_red_error ${theme==='light'?'text-matte_gray':'text-white'}`} color={theme==='light'?'black':'white'}/>
                    <Text className={`ml-2 text-[12px] font-semibold ${theme==='light'?'text-matte_gray':'text-white'}`}>Não, já foi resolvido</Text>
                </TouchableOpacity>
            </>)
            }
        </View>


        {/* <View className="mt-4 mb-2 flex-row justify-between">
            <ButtonModal
                title="Fechar"
                handlePress={onClose}
                textStyles="text-color-err"
            />
            
            <ButtonModal
                title="Excluir ?"
                handlePress={onClose}
                // handlePress={limparFiltro}
                // disabled={!filtroAtivo}
                textStyles="text-black"
            />
            <Ionicons name="trash-outline" size={12} color="#555" style={{ marginLeft: 5 }} />
          
        </View> */}
        </ScrollView>
    </View>
    <TouchableOpacity className="w-full h-full" onPress={onClose} />

    </View>
    
  )
}
