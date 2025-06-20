
import api, { nominatimApi, viaCepApi } from "./index";
import { CepInfo, Endereco, RequestSearchBarAddress, ResponseGetCepByLatAndLon, ResponseSearchBarAddress } from "../types";
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


export const getCepByLatAndLong = async (latitude: number, longitude: number, abortSignal: AbortController): Promise<ResponseGetCepByLatAndLon> => {
    const response = await api.get<ResponseGetCepByLatAndLon>(ENDPOINTS.ENDERECO_CEP_BY_LAT_LONG_GET,
        { 
            params: {
                latitude: latitude.toString(),
                longitude: longitude.toString()
            }, 
            signal: abortSignal.signal
        } 
    ) 

    return response.data
}



export const getViaCep = async (cep : string ,abortSignal : AbortController) : Promise<CepInfo> => {
    const response = await viaCepApi.get<CepInfo>(ENDPOINTS.ENDERECO_VIACEP_GET+ cep + '/json',{
        headers: {
            'Content-Type':'application/json'
        },
        signal: abortSignal.signal,
    })

    return response.data
}


export const getLatLongByStreetName = async (request : RequestSearchBarAddress, abortSignal: AbortController ): Promise<ResponseSearchBarAddress[]> => {
    const response = await nominatimApi.get<ResponseSearchBarAddress[]>('',{
        params:{
            q: request.search,
            format: 'json'
        },
        signal: abortSignal.signal
    })
    return response.data
}