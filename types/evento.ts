import { EventoEndereco } from "./endereco";
import { NivelHabilidade } from "./nivel-habilidade";
import { TipoEvento } from "./tipo-evento";

export interface Evento {
    id: number
    nome: string
    descricao: string
    data: string
    dtAtualizacao: string
    endereco: EventoEndereco
    faixaKm: number
    gratuito: boolean
    tipoEvento: TipoEvento
}



export interface RequestCreateEvento {
    
    nome: string
    descricao: string
    data: string
    endereco: EventoEndereco
    faixaKm: number
    gratuito: boolean
    tipoEvento: TipoEvento
}

export interface RequestUpdateEvento {   
    id: number
    nome: string
    descricao: string
    data: string
    endereco: EventoEndereco
    faixaKm: number
    gratuito: boolean
    tipoEvento: TipoEvento
}





export interface RequestCreateEventoError {
    
    nome: string
    descricao: string
    data: string
    endereco: {
        cep: string
        estado: string
        cidade: string
        bairro: string
        rua: string
        numero: string
    }
    faixaKm: string
    gratuito: string
    tipoEvento: string
}


export interface RequestUpdateEventoError {
    
    nome: string
    descricao: string
    data: string
    endereco: {
        cep: string
        estado: string
        cidade: string
        bairro: string
        rua: string
        numero: string
    }
    faixaKm: string
    gratuito: string
    tipoEvento: string
}



export interface ResponseCreateEvento {
    id: number
    nome: string
    descricao: string
    data: string
    dtAtualizacao: string
    endereco: EventoEndereco
    faixaKm: number
    gratuito: boolean
    tipoEvento: TipoEvento
}


export interface RequestPageEvento {
    page: number
    nome: string | null
    descricao: string | null
    data: string | null
    cidade: string | null
    estado: string | null
    faixaKm: number | null
    tipoEvento: TipoEvento | null
    nivelHabilidade: NivelHabilidade | null
    gratuito: boolean | null
}

export interface PageEvento {
    eventos: Evento[]
    totalRegistros: number
    totalPaginas: number
}



export interface RequestEventoByRadius {
    latitude: number
    longitude: number
    raio: number
}