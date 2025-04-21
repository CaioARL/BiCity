import api from "./index"
import ENDPOINTS from "./endpoints"


export const checkToken = async (token: string, email: string, abortSignal: AbortController | null) => {
    const response = await api.get<boolean>(ENDPOINTS.TOKEN_CHECK, {
        params: {
            token: token,
            email: email
        },
        signal: abortSignal?.signal
    })

    return response.data
}


export const sendToken = async (email: string, abortSignal: AbortController | null) : Promise<string> => {
    const response = await api.post<string>(ENDPOINTS.TOKEN_VALIDAR, {} ,{
        params: {
            email: email
        },
        signal: abortSignal?.signal
    })

    return response.data
}