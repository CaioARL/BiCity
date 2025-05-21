import React, { useEffect, useRef, useState } from 'react'
import { Text, View, FlatList, Image, TouchableOpacity } from 'react-native'
import { Avaliacao, DefaultErrorResponse, RequestPageAvaliacao } from '../types'
import ButtonModal from './ButtonModal'
import { Ionicons } from '@expo/vector-icons'
import { getAvaliacaoDetails, getAvaliacoesByInfraestrutura } from '../api/avaliacao'
import ShowAlert from './ShowAlert'
import { AxiosError } from 'axios'

interface AvaliacaoViewProps {
    requestPage: RequestPageAvaliacao
    onClose: () => void
}

interface Ratings {
    total: number
    average: number
    counts: number[]
}

export default function AvaliacaoView({ onClose, requestPage }: AvaliacaoViewProps) {
    const currentPageRef = useRef<number>(1)
    const totalPaginas = useRef<number>(0)
    const [requestPageAvaliacao, setRequestPageAvaliacao] = useState<RequestPageAvaliacao | null>(requestPage)
    const [requestDetailsAvaliacao] = useState<number>(requestPage.idInfraestruturaCicloviaria)
    const [isContentLoading, setIsContentLoading] = useState<boolean>(false)
    const [avaliacoes, setAvaliacoes] = useState<Avaliacao[] | null>()
    const [ratings, setRatings] = useState<Ratings>({ total: 0, average: 0, counts: [] })
    const [filtroAtivo, setFiltroAtivo] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | null>()
    const [loadPageButton, setLoadPageButton] = useState<boolean>(false)

    const onRefresh = () => {
        setAvaliacoes(null)
        currentPageRef.current = 1
        setRequestPageAvaliacao({ ...requestPage, nota: null, pagina: 1 })
        setFiltroAtivo(false)
        setLoadPageButton(true)
    }

    const loadMorePage = () => {
        if (currentPageRef.current >= totalPaginas.current) return setLoadPageButton(false)
        setRequestPageAvaliacao({ ...requestPage, pagina: currentPageRef.current + 1 })
        currentPageRef.current = currentPageRef.current + 1
    }
    
    const filterByRating = (rating: number) => {
        setAvaliacoes(null)
        currentPageRef.current = 1
        setRequestPageAvaliacao({ ...requestPage, nota: rating, pagina: 1 })
        setFiltroAtivo(true)
    }
    
    const limparFiltro = () => {
        setAvaliacoes(null)
        currentPageRef.current = 1
        setRequestPageAvaliacao({ ...requestPage, nota: null, pagina: 1 })
        setFiltroAtivo(false)
    }

    useEffect(()=> {
        if(!requestDetailsAvaliacao) return
        getAvaliacaoDetails(requestDetailsAvaliacao, null)
        .then(response => {
            const notas = [
                response.total_avaliacoes_por_nota['Nota 1'] |0,
                response.total_avaliacoes_por_nota['Nota 2'] |0,
                response.total_avaliacoes_por_nota['Nota 3'] |0,
                response.total_avaliacoes_por_nota['Nota 4'] |0,
                response.total_avaliacoes_por_nota['Nota 5'] |0,
            ]
            setRatings({
                average: ( notas.reduce((a,b, index) => a + b * (index+1)) / response.total_avaliacoes ),
                total: response.total_avaliacoes,
                counts: notas
            })
        })
        .catch((error: AxiosError<DefaultErrorResponse>) => {
            setErrorMessage("Erro buscando avaliações: " + (error.response?.data.message || error.message))
        })
    },[requestDetailsAvaliacao])

    useEffect(()=>{
          if(!requestPageAvaliacao) return
          setIsContentLoading(true)
          getAvaliacoesByInfraestrutura(requestPageAvaliacao, null)
          .then((response)=>{        
              setAvaliacoes(response.avaliacoes)
          })
          .catch((error: AxiosError<DefaultErrorResponse>)=>{
            setErrorMessage("Erro buscando avaliações: " + (error.response?.data.message || error.message))
          })
          .finally(()=>{
            setRequestPageAvaliacao(null)
            setIsContentLoading(false)
          })
        },[requestPageAvaliacao])

    return (
        <View className="p-[30px] obsolute z-10 bg-white rounded-lg shadow-md h-[80%] w-[94%] top-[3%] left-[3%] absolute justify-center">
            <FlatList
                className='relative'
                ListHeaderComponent={
                    <View className='justify-center align-center mb-[48px]'>
                        <Text className='flex-col text-lg font-bold text-center mb-10'>Resumo das avaliações</Text>
                        <View className='flex-row w-full justify-center items-center'>
                            <View className='flex-1 flex-col flex-wrap mr-4 w-[70%]'>
                                <View className='flex-row flex-wrap'>
                                    {ratings.counts.map((count, index) => (
                                        <TouchableOpacity
                                            className='w-1/2 mb-5'
                                            key={index}
                                            onPress={() => filterByRating(index + 1)}
                                            activeOpacity={0.7}
                                        >
                                            <View className='flex-row items-center'>
                                                <Text className='text-sm'>{index + 1}</Text>
                                                <View className='flex-1 mr-2 h-2 bg-color_light_gray rounded-[5px] ml-2'>
                                                    <View
                                                        className='h-2 bg-[#FFD700] rounded-[5px]'
                                                        style={{ width: `${(count / Math.max(...ratings.counts, 1)) * 100}%` }}
                                                    />
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View className='items-center justify-center w-[30%]'>
                                <Text className='font-bold text-[45px]'>
                                {ratings && typeof ratings.average === 'number' && !isNaN(ratings.average) ? (ratings.average.toFixed(1).replace('.', ',')) : (
                                    <Text className='text-xs'>Não há avaliação</Text>
                                )}
                                </Text>
                                <View className='flex-row my-1 gap-x-1'>
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Ionicons key={i} name="star" size={13} color={i < Math.round(ratings.average) ? '#FFD700' : '#ddd'} />
                                    ))}
                                </View>
                                <Text className='text-[13px] text-matte_gray text-center'>{ratings.total }{'\n'} Avaliações</Text>
                            </View>
                        </View>
                    </View>
                }
                data={avaliacoes}
                refreshing={isContentLoading}
                onRefresh={onRefresh}
                ListFooterComponent={
                    <TouchableOpacity className={`flex-col flex-nowrap my-5 items-center justify-center rounded-full ${loadPageButton? 'visible' : 'hidden'} `} onPress={loadMorePage}>
                        <Image source={require('../assets/loadMore.png')} style={{ width: 50, height: 50, tintColor: '#555' }} resizeMode="contain" />
                        <Text className='text-xs text-matte_gray text-center'>Carregar {'\n'} Mais</Text>
                    </TouchableOpacity>
                }
                onEndReachedThreshold={0.1}
                onEndReached={() => currentPageRef.current < totalPaginas.current && loadMorePage()}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => {
                    return (
                        <View key={item.id} className="flex-row border-b-hairline border-color__lightGray der-gray-200 rounded-[10px]">
                            <View className="flex-col flex-grow-[1px] justify-center items-center my-4 pr-[20px]">
                                {item.usuario.s3Url ?
                                    (<Image
                                        source={{ uri: item.usuario.s3Url }}
                                        className="w-20 h-20 rounded-full border-color_light_gray"
                                        style={{ width: 65, height: 65, borderRadius: 50, borderWidth: 1,  marginRight: 10 }}
                                    />)
                                :
                                <View className='w-20 h-20 rounded-full border-color_light_gray border-[1px] bg-color_light_gray justify-center items-center'>
                                    <Ionicons name="person" size={30} color="#555" />
                                </View>
                                }
                                <Text className='text-[12px] text-matte_gray '>{item.usuario.nome}</Text>
                                <Text className='text-[11px] text-matte_gray mb-[5px]'>{item.usuario.nivelHabilidade?.descricao}</Text>
                            </View>

                            <View className='flex-col flex-grow-[2px] w-[60%] justify-between items-start text-left my-4'>
                                <Text className='text-[12px] text-matte_gray mb-[5px]'>{item.dtCriacao}</Text>
                                <View className='max-w-min'>
                                    <Text className='text-[12px] text-matte_gray mb-[5px]'>{item.comentario || "Usuário optou por não comentar"}</Text>
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
                <Text className="text-gray-500">{"Avaliações: " + ratings.total}</Text>
                <View className="mt-4 mb-2 flex-row justify-between">
                    <ButtonModal
                        title="Fechar"
                        handlePress={onClose}
                        textStyles="text-black"
                    />
                    <ButtonModal
                        title="Limpar filtro"
                        handlePress={limparFiltro}
                        disabled={!filtroAtivo}
                        textStyles="text-black"
                    />
                </View>
            </View>
            {errorMessage && (
                <ShowAlert
                    message={errorMessage}
                    onClose={()=>setErrorMessage(null)}
                    type='error'
                />
            )}

        </View>
    )
}