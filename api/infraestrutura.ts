import api from ".";
import { InfraestruturaGeoJson, RequestInfraestruturaByRadius } from "../types";
import ENDPOINTS from "./endpoints";



export const getInfraestrutura = async (request: RequestInfraestruturaByRadius, abortSignal: AbortController) => {
    const response = await api.get<InfraestruturaGeoJson>(ENDPOINTS.INFRAESTRUTURA_GET, {
        params: {
            latitude: request.latitude,
            longitude: request.longitude,
            raio: request.raio
        },
        signal: abortSignal.signal
    })
    return response.data
}