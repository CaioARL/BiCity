import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { RequestCreateProblema, TipoProblema } from 'types'
import { ScrollView } from 'react-native'
import { getTipoProblema } from 'storage'
import { Image } from 'react-native'
import ButtonModal from './ButtonModal'

interface ProblemaModalNavigationProps {
    onClose: (requestCreateProblem: RequestCreateProblema | null) => void
    coords: { latitude: number; longitude: number }
}

export default function ProblemaModalNavigation({ onClose , coords } : ProblemaModalNavigationProps) {
    const [requestCreateProblema, setRequestCreateProblema] = useState<RequestCreateProblema | null>(null)
    const [ListTipoProblema, setListTipoProblema] = useState<TipoProblema[]>([])
    const [countDown, setCountDown] = useState<number>(10)

    useEffect(()=> {
        getTipoProblema().then((data) => {
            setListTipoProblema(data || [])
             
            const interval = setInterval(() => {
            setCountDown(prev => {
                if (prev > 1) {
                    return prev - 1
                } else {
                    clearInterval(interval)
                    onClose(null)
                    return 0
                }
            })
            }, 1000)
        }
        ).catch((error) => {
            console.error("Erro ao carregar tipos de problema:", error)
        })

    },[])

    useEffect(() => {   
        if (!requestCreateProblema) return
        onClose(requestCreateProblema)
    },[requestCreateProblema])

    

        return (
            <View className=" absolute top-0 left-0 z-10 flex-col justify-center items-center w-full h-full py-[20%]">
                        <TouchableOpacity className="w-full h-full" onPress={()=>onClose(null)} />
                <View className="px-[10px] bg-white rounded-lg shadow
                -md h-fit w-[94%] justify-start">
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {ListTipoProblema?.map((tipoProblema) => (
                            <TouchableOpacity
                                key={tipoProblema.id}
                                className='flex-row items-center justify-start mb-4'
                                onPress={() => setRequestCreateProblema({
                                                    descricao: '',
                                                    ativo: true,
                                                    latitude: coords.latitude,
                                                    longitude: coords.longitude,
                                                    idTipoProblema: tipoProblema.id,
                                                }) }
                            >
                                <Image
                                    source={ tipoProblema.id === 1?( require('../assets/problema/problema_tipo_1.png')) 
                                    :
                                    tipoProblema.id === 2?( require('../assets/problema/problema_tipo_2.png') )
                                    : 
                                    tipoProblema.id === 3?( require('../assets/problema/problema_tipo_3.png') )
                                    :
                                    tipoProblema.id === 4?( require('../assets/problema/problema_tipo_4.png') ) 
                                    :
                                    tipoProblema.id === 5?( require('../assets/problema/problema_tipo_5.png') )   
                                    :
                                    tipoProblema.id === 6?( require('../assets/problema/problema_tipo_6.png') )   
                                    :
                                    tipoProblema.id === 7?( require('../assets/problema/problema_tipo_7.png') )   
                                    :  
                                    tipoProblema.id === 8?( require('../assets/problema/problema_tipo_8.png') )   
                                    :  
                                    require('../assets/problema/problema_tipo_1.png') }
                                    style={{ width: 75, height: 75, marginRight: 10}}
                                    resizeMode='contain'
                                />
                                <Text className='text-lg font-bold mb-4 max-w-[70%]'>{tipoProblema.descricao}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                     <View className='w-full flex-row justify-between items-center p-4'>
                        <ButtonModal
                            title='Cancelar'
                            textStyles='text-color_black text-lg font-bold'
                            handlePress={() => {
                                onClose(null)
                            }}
                        />
                        <View className='flex-row items-center justify-center bg-primary_green rounded-full h-[50px] w-[50px] p-2'>
                            <Text className='text-center text-lg font-bold text-color_black'>{countDown}</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity className="w-full h-full" onPress={()=>onClose(null)} />
            </View>
        )

}