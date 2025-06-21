import api from ".";
import { InfraestruturaGeoJsonResponse, RequestInfraestruturaByRadius } from "../types";
import ENDPOINTS from "./endpoints";

export const getInfraestrutura = async (request: RequestInfraestruturaByRadius, abortSignal: AbortController | null) => {
    const response = await api.get<InfraestruturaGeoJsonResponse>(ENDPOINTS.INFRAESTRUTURA_GET, {
        params: {
            latitude: request.latitude,
            longitude: request.longitude,
            raio: request.raio
        },
        signal: abortSignal?.signal
    })
    return response.data
}

export const getInfraestruturaById = async (id: number, abortSignal: AbortController | null) => {
    const response = await api.get<InfraestruturaGeoJsonResponse>(ENDPOINTS.INFRAESTRUTURA_GET_BY_ID + id +'/geojson', {
        signal: abortSignal?.signal
    })
    return response.data
}

export const getPath = async (from : {lat: number, lon: number}, to: {lat: number, lon: number} , abortSignal: AbortController | null) => {
    console.log(from.lon+','+from.lat+';'+to.lon+','+to.lat)
    const response = await api.get<InfraestruturaGeoJsonResponse>(ENDPOINTS.INFRAESTRUTURA_ROTA_GET,{
        params:{
            coordenadas: from.lon+','+from.lat+';'+to.lon+','+to.lat
        },
        signal: abortSignal?.signal
    })
    return response.data
} 