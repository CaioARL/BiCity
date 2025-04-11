import { TipoProblema } from '../types'
import api from '.'
import ENDPOINTS  from './endpoints'


export const getTipoProblema = async (): Promise<TipoProblema[]> => {
    const response = await api.get(ENDPOINTS.TIPO_PROBLEMA_GET)
    return response.data
}