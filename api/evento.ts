import api from "."
import {RequestPageEvento, ResponsePageEvento, RequestCreateEvento, Evento } from "../types"
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


const getEvento = async (requestPageEvento: RequestPageEvento, abortSignal: AbortController) : Promise<ResponsePageEvento[]> => {
    const response = await api.get<ResponsePageEvento[]>(ENDPOINTS.EVENTO_GET, {
        params: {
            page: requestPageEvento.page,
            nome: requestPageEvento.nome,
            descricao: requestPageEvento.descricao,
            data: requestPageEvento.data,
            cidade: requestPageEvento.cidade,
            estado: requestPageEvento.estado,
            faixaKm: requestPageEvento.faixaKm,
            tipoEvento: requestPageEvento.tipoEvento.id,
            nivelHabilidade: requestPageEvento.nivelHabilidade.id,
            gratuito: requestPageEvento.gratuito
        }, 
        signal: abortSignal.signal
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


