import api from ".";
import ENDPOINTS from "./endpoints";
import { Problema, RequestCreateProblema, RequestCreateProblemaImage, RequestProblemaByRadius, RequestProblemaReport } from "../types";


export const getProblemaByRadius = async (request: RequestProblemaByRadius, abortSignal: AbortController | null): Promise<Problema[]> => {
    const response = await api.get<Problema[]>(ENDPOINTS.PROBLEMA_GET_BY_RADIUS, { params: request, signal: abortSignal?.signal })
    return response.data
}


export const createProblema = async (request: RequestCreateProblema, abortSignal: AbortController | null)  => {
    const response = await api.post<Problema>(ENDPOINTS.PROBLEMA_POST, request, { signal: abortSignal?.signal })
    return response.data
}



export const createProblemaImage = async (problemaImage: RequestCreateProblemaImage, abortSignal: AbortController | null)  => {
    const response = await api.put<FormData, string>(ENDPOINTS.PROBLEMA_POST+problemaImage.id+"/foto", problemaImage.image, {
        signal: abortSignal?.signal,
        headers: {
            'Content-Type': 'multipart/form-data'
        }

    })
    return response
}

export const checkCreateViabilityProblema = async (latitude: number, longitude: number, abortSignal: AbortController | null)  => {
    const response = await api.get<boolean>(ENDPOINTS.PROBLEMA_CHECK, { params: { latitude, longitude }, signal: abortSignal?.signal })
    return response.data
}

export const reportProblema = async ( report : RequestProblemaReport  ,  abortSignal: AbortController | null)  => {
    const response = await api.post<string>(ENDPOINTS.PROBLEMA_POST + report.problemaId + ENDPOINTS.PROBLEMA_REPORT, {}, {
        params: { usuarioId: report.usuarioId, exists: report.exists },
        signal: abortSignal?.signal
        })
    return response.data
}