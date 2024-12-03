
import api from "./index";
import { brasilApiResponse } from "../types";
import ENDPOINTS from "./endpoints";



export const getCep = async (cep: string, abortSignal: AbortController): Promise<brasilApiResponse> => {
    const response = await api.get<brasilApiResponse>(ENDPOINTS.BRASIL_API,
        { 
            params: {
             cep: cep 
            }, 
            signal: abortSignal.signal
        } 
    ) 

    return response.data;
}