import api from ".";
import { CriarUsuarioRequest, CriarUsuarioResponse } from "../types";
import ENDPOINTS from "./endpoints";



export const createUser = async (data: CriarUsuarioRequest): Promise<CriarUsuarioResponse> => {
    const response = await api.post<CriarUsuarioResponse>(ENDPOINTS.USUARIO_CADASTRO, data)
    return response.data
}