import { PageAvaliacao, RequestCreateAvaliacao, RequestPageAvaliacao } from '../types';
import api from './';
import ENDPOINTS from './endpoints';

export const createAvaliacao = async (avaliacao: RequestCreateAvaliacao, abortSignal :AbortController|null) => {
    const response = await api.post<string>(ENDPOINTS.AVALIACAO_POST, avaliacao,{ signal: abortSignal?.signal });
    return response.data
}




export const getAvaliacoesByInfraestrutura = async (requestPageAvaliacao: RequestPageAvaliacao, abortSignal: AbortController | null) => {
    const response = await api.get<PageAvaliacao>(ENDPOINTS.AVALIACAO_INFRAESTRUTURA + requestPageAvaliacao.idInfraestruturaCicloviaria + ENDPOINTS.AVALIACAO_GET, {
        params: {
            pagina: requestPageAvaliacao.pagina,
            nota: requestPageAvaliacao.nota
        },
        signal: abortSignal?.signal
    })

    return response.data
} 