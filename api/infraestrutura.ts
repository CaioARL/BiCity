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