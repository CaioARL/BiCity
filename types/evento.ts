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
    nome: string
    descricao: string
    data: string
    cidade: string
    estado: string
    faixaKm: number
    tipoEvento: TipoEvento
    nivelHabilidade: NivelHabilidade
    gratuito: boolean
}

export interface ResponsePageEvento {
    eventos: Evento[]
    totalRegistros: number
    totalPaginas: number
}