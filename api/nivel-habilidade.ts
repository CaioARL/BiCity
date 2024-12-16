import api from "."
import { NivelHabilidade } from "../types/nivel-habilidade"
import ENDPOINTS from "./endpoints"




export const getNivelHabilidade = async (): Promise<NivelHabilidade[]> => {
    const response = await api.get<NivelHabilidade[]>(ENDPOINTS.NIVEL_GET)
    return response.data
}