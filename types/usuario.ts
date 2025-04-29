import { NivelHabilidade } from "./nivel-habilidade"

export interface CreateUsuarioRequest {
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
    cpf: string | null
    cnpj: string | null
    nivelHabilidade: number
}

export interface CreateUsuarioForms {
    firstName: string 
    secondName: string 
    nomeUsuario: string 
    cep: string 
    estado: string 
    cidade: string  
    bairro: string 
    rua: string 
    numero: string 
    email: string 
    senha: string 
    confirmaSenha: string 
    cpf: string | null
    cnpj: string | null
    nivelHabilidade: NivelHabilidade
}

export interface ErrorCreateUsuarioForms {
    firstName : string
    secondName : string
    nomeUsuario: string
    cep: string
    estado: string
    cidade: string
    bairro: string
    rua: string
    numero: string
    email: string
    senha: string
    confirmaSenha: string 
    cpf: string
    cnpj: string
    nivelHabilidade: string
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
      rua: string,
      numero: number,
      bairro: string,
      cidade: string,
      estado: string,
      cep: string
}

export interface UsuarioLoginRequest {
    nomeUsuario: string
    email: string
    cpf: string
    cnpj: string
    senha: string
}

export interface RequestUpdateUsuario {
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
    nivelHabilidade: NivelHabilidade
}

export interface CpfValidationResponse {
    isValid: boolean
    message: string
}

export interface CnpjValidationResponse {
    isValid: boolean
    message: string
}

export interface ValidateUsuarioRequest {
    email: string | null
    nomeUsuario: string | null
}