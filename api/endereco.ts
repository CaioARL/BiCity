
import api from "./index";
import { Endereco } from "../types";
import ENDPOINTS from "./endpoints";



export const getCep = async (cep: string, abortSignal: AbortController): Promise<Endereco> => {
    const response = await api.get<Endereco>(ENDPOINTS.ENDERECO_CEP_GET,
        { 
            params: {
             cep: cep 
            }, 
            signal: abortSignal.signal
        } 
    ) 

    return response.data
}




export const getLatLong = async (cep: string, numero: number, abortSignal: AbortController): Promise<Endereco> => {
    const response = await api.get<Endereco>(ENDPOINTS.ENDERECO_LAT_LONG_GET,
        { 
            params: {
                cep: cep,
                numero: numero
            }, 
            signal: abortSignal.signal
        } 
    ) 

    return response.data
}


export const getCepByLatAndLong = async (latitude: string, longitude: string, abortSignal: AbortController): Promise<Endereco> => {
    const response = await api.get<Endereco>(ENDPOINTS.ENDERECO_CEP_BY_LAT_LONG_GET,
        { 
            params: {
                latitude: latitude,
                longitude: longitude
            }, 
            signal: abortSignal.signal
        } 
    ) 

    return response.data
}
