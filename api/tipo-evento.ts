import api from ".";
import { TipoEvento } from "../types";
import ENDPOINTS from "./endpoints";


export const getTipoEvento = async (): Promise<TipoEvento[]> => {
    const response = await api.get(ENDPOINTS.TIPO_EVENTO_GET)
    return response.data
}