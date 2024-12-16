
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

    return response.data;
}