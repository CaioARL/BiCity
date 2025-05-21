import api from "."
import {RequestPageEvento, PageEvento, RequestCreateEvento, Evento, RequestEventoByRadius, RequestUpdateEvento, RequestCreateEventoImage } from "../types"
import ENDPOINTS from "./endpoints"


export const createEvento = async (evento: RequestCreateEvento, abortSignal: AbortController) : Promise<Evento> => {
    const response = await api.post<Evento>(ENDPOINTS.EVENTO_POST, 
        {
            nome: evento.nome,
            descricao: evento.descricao,
            data: evento.data.data + "T" + evento.data.horario + ".000",
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
            urlSite: evento.urlSite,
            idTipoEvento: evento.tipoEvento.id,
            idUsuario: evento.idUsuario,
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
            gratuito: requestPageEvento.gratuito,
            aprovado: requestPageEvento.aprovado
        }, 
        signal: abortSignal.signal
    })
    return response.data
}



export const getEventoByRadius = async (requestEventoByRadius : RequestEventoByRadius, abortSignal: AbortController | null) : Promise<Evento[]> => {
    const response = await api.get<Evento[]>(ENDPOINTS.EVENTO_GET_BY_RADIUS, {
        params: {
            latitude: requestEventoByRadius.latitude,
            longitude: requestEventoByRadius.longitude,
            raio: requestEventoByRadius.raio,
        }, 
        signal: abortSignal?.signal
    })
    return response.data
}

export const updateEvento = async (evento: RequestUpdateEvento, abortSignal: AbortController) : Promise<Evento> => {
    const response = await api.put<Evento>(ENDPOINTS.EVENTO_PUT+ evento.id,
        {
            nome: evento.nome,
            descricao: evento.descricao,
            data: evento.data.data + "T" + evento.data.horario + ".000",
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
            urlSite: evento.urlSite,
            idTipoEvento: evento.tipoEvento.id,
            idUsuario: evento.idUsuario,
        },
        { 
            signal: abortSignal.signal 
        })
    return response.data
}



export const getEventoById = async (id: number | string, abortSignal: AbortController | null) : Promise<Evento> => {
    const response = await api.get<Evento>(ENDPOINTS.EVENTO_GET_BY_ID + id, { 
        signal: abortSignal?.signal
    })
    return response.data
}




export const createEventoImage = async (eventoImage: RequestCreateEventoImage, abortSignal: AbortController | null)  => {
    const response = await api.put<FormData, string>(ENDPOINTS.EVENTO_PUT+eventoImage.id+"/foto", eventoImage.image, {
        signal: abortSignal?.signal,
        headers: {
            'Content-Type': 'multipart/form-data'
        }

    })
    return response
}



export const getEventoByUsuario = async (pageEvento: RequestPageEvento, idUsuario: number, abortSignal: AbortController) => {
    const response = await api.get<PageEvento>(ENDPOINTS.EVENTO_GET_BY_USUARIO , 
        { 
            params: {
            pagina: pageEvento.page,
            nome: pageEvento.nome,
            descricao: pageEvento.descricao,
            data: pageEvento.data,
            cidade: pageEvento.cidade,
            estado: pageEvento.estado,
            faixaKm: pageEvento.faixaKm,
            tipoEvento: pageEvento.tipoEvento?.id,
            nivelHabilidade: pageEvento.nivelHabilidade?.id,
            gratuito: pageEvento.gratuito
        }, 
        signal: abortSignal.signal
        }
    )
    return response.data
}