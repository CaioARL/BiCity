import React, { useEffect, useRef, useState } from 'react'
import { Text, View , FlatList, Image, ScrollView} from 'react-native'
import { Avaliacao, PageAvaliacao, RequestPageAvaliacao } from '../types'
import CustomButton from './CustomButton'
import { Ionicons } from '@expo/vector-icons'

/*
    VirtualizedList: You have a large list that is slow to update - make sure your renderItem function renders components that follow React performance best practices like PureComponent, shouldComponentUpdate, etc. {"contentLength": 6207.2890625, "dt": 8296, "prevDt": 3133}
*/




interface AvaliacaoViewProps {
    pageAvaliacao : PageAvaliacao
    requestPage: RequestPageAvaliacao
    setRequestPage: (requestPageAvaliacao: RequestPageAvaliacao) => void
    isContentLoading: boolean
    onClose: () => void
}


interface Ratings {
    ratings: number[]
    total: number
    average: number
    counts: number[]
}



export default function AvaliacaoView({ pageAvaliacao, onClose, requestPage, isContentLoading , setRequestPage}: AvaliacaoViewProps) {

    const currentPageRef = useRef<number>(1)
    const [avaliacoes, setAvaliacoes] = useState<Avaliacao[] | null>()

    const [ratings, setRatings] = useState<Ratings>({ ratings: [], total: 0, average: 0, counts: [] })






    useEffect(()=>{        
        currentPageRef.current = requestPage.pagina || 1
        avaliacoes ? (
            setAvaliacoes([...avaliacoes, ...pageAvaliacao.avaliacoes])
        )   
        :
        setAvaliacoes(pageAvaliacao.avaliacoes)
    },[pageAvaliacao])
    


    const onRefresh =()=>{
        setAvaliacoes(null)
        currentPageRef.current=1
        setRequestPage({...requestPage, nota:null, pagina:1 })
    }



    const loadMorePage =() =>{
        if(currentPageRef.current >= pageAvaliacao.totalPaginas) return //alert removed
        setRequestPage({...requestPage, pagina: currentPageRef.current + 1})
        currentPageRef.current = currentPageRef.current+1 
    }




    useEffect(()=>{
        const todasAvaliacoes = pageAvaliacao.avaliacoes
        if(!todasAvaliacoes) return
        setRatings({
            ratings: todasAvaliacoes.map((item) => item.nota),
            total: todasAvaliacoes.length,
            average: todasAvaliacoes.reduce((a, b) => a + b.nota, 0) / todasAvaliacoes.length || 0,
            counts: [1, 2, 3, 4, 5].map(star =>
                todasAvaliacoes.filter(r => r.nota === star).length
            )
        })
    }, [])









  return (
    <View className="p-[30px] obsolute bg-white rounded-lg shadow-md  h-[80%] w-[94%] top-[3%] left-[3%] absolute justify-center"> 
    <FlatList
        className='relative'
        ListHeaderComponent={
        <View className=' justify-center align-center mb-[48px]'>
            <Text className=' flex-col text-lg font-bold text-center mb-10'>Resumo das avaliações</Text>
            <View className='flex-row w-full justify-center items-center'>
                <View className='flex-1 flex-col flex-wrap mr-4 w-[70%]'>
                    <View className='flex-row flex-wrap'>
                    {ratings.counts.map((count, index) => (
                        <View className='w-1/2 mb-5' key={index}> 
                        <View className='flex-row items-center '>
                            <Text className='text-sm '>{index + 1}</Text>
                            <View className='flex-1 mr-2 h-2 bg-color_light_gray rounded-[5px] ml-2'>
                            <View
                                className='h-2 bg-[#FFD700] rounded-[5px]'
                                style={{ width: `${(count / Math.max(...ratings.counts,1)) * 100}%` }}
                            />
                            </View>
                        </View>
                        </View>
                    ))}
                    </View>
                </View>

                <View className='items-center justify-center w-[30%]'>
                    <Text className='font-bold text-[45px]'>
                    {ratings.average.toFixed(1).replace('.', ',')}
                    </Text>
                        <View className='flex-row my-1 gap-x-1'>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Ionicons key={i} name="star" size={13} color={i < Math.round(ratings.average) ? '#FFD700' : '#ddd'} />
                        ))}
                        </View>
                        <Text className='text-[13px] text-matte_gray text-center'>{ratings.total}{'\n'} Avaliações</Text>
                </View>
            </View>
        </View>
        }
        data={avaliacoes}
        refreshing={isContentLoading}
        onRefresh={onRefresh}
        onEndReached={loadMorePage}
        onEndReachedThreshold={null}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false} 
        renderItem={({item}) => {
        return (
                <View key={item.id} className="flex-row border-b-hairline border-color__lightGray der-gray-200 rounded-[10px]">

                    <View className="flex-col flex-grow-[1px] justify-center items-center my-4 mr-[40px]">
                        <Image
                            source={{ uri: item.usuario.s3Url }}
                            // source = { require("../../assets/img/profile.jpg")}
                            className="w-20 h-20 rounded-full"
                        />
                        <Text className='text-[12px] text-matte_gray mb-[5px]'>{item.usuario.nome}</Text>
                    </View>

                    <View className='flex-col flex-grow-[2px] w-[60%] justify-between items-start text-left my-4'>
                        <Text className='text-[12px] text-matte_gray mb-[5px]'>{item.dtCriacao}</Text>
                        <View className='max-w-min'>
                            <Text className='text-[12px] text-matte_gray mb-[5px]'>{item.comentario}</Text> 
                        </View>

                        <View className='flex-row justify-between items-center'>
                        <Text className='text-[12px] text-matte_gray mr-2'>Nota: {item.nota}</Text>
                        
                        <View className='flex-row'>
                            {[1, 2, 3, 4, 5].map((star) => (
                           <Text key={star} className='text-[13px] ml-1' style={{ color: star <= item.nota ? '#FFD700' : '#CCC', lineHeight: 13 }} > ★ </Text>
                            ))}
                        </View>
                        </View>
                    </View>
                </View>
                )
            }
        
        }   
    />

    <View className="px-4 py-2">
        <Text className="text-gray-500">{"Comentários: "+pageAvaliacao.totalRegistros}</Text>
        <CustomButton
            title="Fechar"
            handlePress={()=>onClose()}
            containerStyles="mt-4 mb-4"
        />
    </View>   
    </View>
  )
}
