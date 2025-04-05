import api from ".";
import { CriarUsuarioRequest, CriarUsuarioResponse, RequestUpdateUsuario, Usuario, UsuarioLoginRequest } from "../types";
import ENDPOINTS from "./endpoints";



export const createUser = async (data: CriarUsuarioRequest, abortSignal: AbortController): Promise<CriarUsuarioResponse> => {
    const response = await api.post<CriarUsuarioResponse>(ENDPOINTS.USUARIO_CADASTRO, data ,{
        signal: abortSignal.signal
    })
    return response.data
}


export const validateCPF = async (cpf: string , abortSignal: AbortController) => {
    const response = await api.get<string>(ENDPOINTS.USUARIO_VALIDAR_CPF, {
        params: {
            cpf: cpf
        },
        signal: abortSignal.signal
    })
    return response.data
}


export const loginUser = async (usuarioLogin: UsuarioLoginRequest, abortSignal: AbortController) => {
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


export const updateUser = async (id: number, user: RequestUpdateUsuario, abortSignal: AbortController ) => {
    const response = await api.put<RequestUpdateUsuario, Usuario>(ENDPOINTS.USUARIO_PUT+ id , {
        
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
        signal: abortSignal.signal
    }
    
)
    return response
}


export const updateImageUser = async (id: number, image: FormData, abortSignal: AbortController ) => {
    const response = await api.put<Usuario>(ENDPOINTS.USUARIO_PUT + id + '/foto', image, {
        signal: abortSignal.signal,
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


