import { NivelHabilidade } from "./nivel-habilidade"


export interface CriarUsuarioRequest {
    nome: string
    nomeUsuario: string
    endereco: {
        cep: string
        estado: string
        cidade: string
        bairro: string
        rua: string
        numero: number
    }
    email: string
    senha: string
    cpf: string
    cnpj: string
    nivelHabilidade: number
}


export interface Usuario {
    id: number
    nome: string
    nomeUsuario: string
    endereco: {
        cep: string
        estado: string
        cidade: string
        bairro: string
        rua: string
        numero: number
    }
    email: string
    role: string
    senha: string
    hash: string
    cpf: string
    cnpj: string
    dtCriacao: string
    nivelHabilidade: {
        id: number
        nome: string
        descricao: string
    }
    sessao: {
        id: number
        token: string
    }
    s3Url: string
}



export interface CriarUsuarioResponse {
    id: number
    nome: string
    nomeUsuario: string
    endereco: {
        cep: string
        estado: string
        cidade: string
        bairro: string
        rua: string
        numero: number
    }
    email: string
    role: string
    senha: string
    hash: string
    cpf: string
    cnpj: string
    dtCriacao: string
    nivelHabilidade: {
        id: number
        nome: string
        descricao: string
    }
    sessao: {
        id: number
        token: string
    }
    s3Url: string
}



export interface EnderecoUsuario {
    endereco: {
      rua: string,
      numero: number,
      complemento: string,
      bairro: string,
      cidade: string,
      estado: string,
      cep: string
    }
}


export interface UsuarioLoginRequest {
    nomeUsuario: string
    email: string
    cpf: string
    cnpj: string
    senha: string
}


export interface RequestUpdateUsuario {
    nome: string
    nomeUsuario: string
    endereco: {
        cep: string
        estado: string
        cidade: string
        bairro: string
        rua: string
        numero: number
    }
    email: string
    nivelHabilidade: NivelHabilidade
}