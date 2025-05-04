import api from ".";
import { CnpjValidationResponse, CpfValidationResponse, CreateUsuarioRequest, CriarUsuarioResponse, RequestUpdateUsuario, Usuario, RequestLogin, ValidateUsuarioRequest } from "../types";
import ENDPOINTS from "./endpoints";

export const createUser = async (data: CreateUsuarioRequest, abortSignal: AbortController | null): Promise<CriarUsuarioResponse> => {
    const response = await api.post<CriarUsuarioResponse>(ENDPOINTS.USUARIO_CADASTRO, data ,{
        signal: abortSignal?.signal
    })
    return response.data
}

export const validateCPF = async (cpf: string , abortSignal: AbortController | null) => {
    const response = await api.get<CpfValidationResponse>(ENDPOINTS.USUARIO_VALIDAR_CPF, {
        params: {
            cpf: cpf
        },
        signal: abortSignal?.signal
    })
    return response.data
}

export const validateCNPJAuthenticity = async (cnpj: string , abortSignal: AbortController | null ) => {
    const response = await api.get<boolean>(ENDPOINTS.USUARIO_VALIDAR_CNPJ_AUTHENTICITY, { //retorna true se o cnpj é existe na base da dados governamental
        params: {
            cnpj: cnpj
        },
        signal: abortSignal?.signal
    })
    return response.data
}

export const validateCNPJ = async (cnpj: string , abortSignal: AbortController | null) => {
    const response = await api.get<boolean>(ENDPOINTS.USUARIO_VALIDAR_CNPJ, {
        params: {
            cnpj: cnpj
        },
        signal: abortSignal?.signal
    })
    return response.data
}

export const validateUser = async (validateUsuario : ValidateUsuarioRequest  , abortSignal: AbortController | null) => {
    const response = await api.get<boolean>(ENDPOINTS.USUARIO_VALIDAR,{
        params: validateUsuario, 
        signal: abortSignal?.signal
    })
    return response.data
}

export const loginUser = async (usuarioLogin: RequestLogin, abortSignal: AbortController) => {
    const response = await api.post<Usuario>(ENDPOINTS.USUARIO_LOGIN, usuarioLogin, {
        signal: abortSignal.signal
    })
    return response.data
}

export const getUserById = async (id: number ) => {
    const response = await api.get<Usuario>(ENDPOINTS.USUARIO_GET + id, {
    })
    return response.data
}

export const updateUser = async (user: RequestUpdateUsuario, abortSignal: AbortController | null ) => {
    const response = await api.put<RequestUpdateUsuario, Usuario>(ENDPOINTS.USUARIO_PUT+ user.id , {
                nome: user.nome, 
                nomeUsuario: user.nomeUsuario,
                endereco: {
                    cep: user.endereco.cep,
                    estado: user.endereco.estado,
                    cidade: user.endereco.cidade,
                    bairro: user.endereco.bairro,
                    rua: user.endereco.rua,
                    numero: user.endereco.numero
                },
                email: user.email,
                nivelHabilidade: user.nivelHabilidade.id   
    },
    {
        signal: abortSignal?.signal
    }
    
)
    return response
}

export const updateImageUser = async (id: number, image: FormData, abortSignal: AbortController | null ) => {
    const response = await api.put<Usuario>(ENDPOINTS.USUARIO_PUT + id + '/foto', image, {
        signal: abortSignal?.signal,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data
}

export const getImageUser = async (id: number, s3Key: string) => {
    const response = await api.get<any, string >(ENDPOINTS.USUARIO_GET_IMAGE + '/' + id,{
        params: {
            s3Key: s3Key
        },
        responseType: 'blob'
    })
    return response
}