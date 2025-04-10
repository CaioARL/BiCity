import api from ".";
import ENDPOINTS from "./endpoints";
import { Problema, RequestCreateProblema, RequestProblemaByRadius } from "../types";


export const getProblemaByRadius = async (request: RequestProblemaByRadius, abortSignal: AbortController | null): Promise<Problema[]> => {
    const response = await api.get<Problema[]>(ENDPOINTS.PROBLEMA_GET_BY_RADIUS, { params: request, signal: abortSignal?.signal })
    return response.data
}


export const createProblema = async (request: RequestCreateProblema, abortSignal: AbortController | null)  => {
    const response = await api.post<RequestCreateProblema, Problema>(ENDPOINTS.PROBLEMA_POST, request, { signal: abortSignal?.signal })
    return response
}