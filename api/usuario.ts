import api from ".";
import { CriarUsuarioRequest, CriarUsuarioResponse } from "../types";
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