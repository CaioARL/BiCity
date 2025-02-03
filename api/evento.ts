import api from "."
import {RequestPageEvento, PageEvento, RequestCreateEvento, Evento, RequestEventoByRadius, RequestUpdateEvento } from "../types"
import ENDPOINTS from "./endpoints"


export const createEvento = async (evento: RequestCreateEvento, abortSignal: AbortController) : Promise<Evento> => {
    const response = await api.post<Evento>(ENDPOINTS.EVENTO_POST, 
        {
            nome: evento.nome,
            descricao: evento.descricao,
            data: evento.data,
            endereco: {
                cep: evento.endereco.cep,
                estado: evento.endereco.estado,
                cidade: evento.endereco.cidade,
                bairro: evento.endereco.bairro,
                rua: evento.endereco.rua,
                numero: evento.endereco.numero,
            },
            faixaKm: evento.faixaKm,
            gratuito: evento.gratuito,
            idTipoEvento: evento.tipoEvento.id,
        }
        , {signal: abortSignal.signal })
    return response.data
}


export const getEvento = async (requestPageEvento: RequestPageEvento, abortSignal: AbortController) : Promise<PageEvento> => {
    const response = await api.get<PageEvento>(ENDPOINTS.EVENTO_GET, {
        params: {
            pagina: requestPageEvento.page,
            nome: requestPageEvento.nome,
            descricao: requestPageEvento.descricao,
            data: requestPageEvento.data,
            cidade: requestPageEvento.cidade,
            estado: requestPageEvento.estado,
            faixaKm: requestPageEvento.faixaKm,
            tipoEvento: requestPageEvento.tipoEvento?.id,
            nivelHabilidade: requestPageEvento.nivelHabilidade?.id,
            gratuito: requestPageEvento.gratuito
        }, 
        signal: abortSignal.signal
    })
    return response.data
}



export const getEventoByRadius = async (requestEventoByRadius : RequestEventoByRadius, abortSignal: AbortController) : Promise<Evento[]> => {
    const response = await api.get<Evento[]>(ENDPOINTS.EVENTO_GET_BY_RADIUS, {
        params: {
            latitude: requestEventoByRadius.latitude,
            longitude: requestEventoByRadius.longitude,
            raio: requestEventoByRadius.raio,
        }, 
        signal: abortSignal.signal
    })
    return response.data
}

export const updateEvento = async (requestUpdateEvento: RequestUpdateEvento, abortSignal: AbortController) : Promise<Evento> => {
    const response = await api.put<Evento>(ENDPOINTS.EVENTO_PUT,
        {
            nome: requestUpdateEvento.nome,
            descricao: requestUpdateEvento.descricao,
            data: requestUpdateEvento.data,
            endereco: {
                cep: requestUpdateEvento.endereco.cep,
                estado: requestUpdateEvento.endereco.estado,
                cidade: requestUpdateEvento.endereco.cidade,
                bairro: requestUpdateEvento.endereco.bairro,
                rua: requestUpdateEvento.endereco.rua,
                numero: requestUpdateEvento.endereco.numero,
            },
            faixaKm: requestUpdateEvento.faixaKm,
            gratuito: requestUpdateEvento.gratuito,
            idTipoEvento: requestUpdateEvento.tipoEvento.id,
        }
    ,{ 
        params:{
            id: requestUpdateEvento.id
        }
        , signal: abortSignal.signal 
    })
    return response.data
}



const getEventoById = async (id: number, abortSignal: AbortController) : Promise<Evento> => {
    const response = await api.get<Evento>(ENDPOINTS.EVENTO_GET_BY_ID, {
        params: {
            id: id
        }, 
        signal: abortSignal.signal
    })
    return response.data
}


