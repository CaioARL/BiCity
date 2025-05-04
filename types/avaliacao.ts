import { InfraestruturaCicloviaria } from "./infraestrutura"
import { Usuario } from "./usuario"

export interface Avaliacao {
    id: number
    usuario: Usuario
    infraestruturaCicloviaria: InfraestruturaCicloviaria
    nota: number
    comentario: string
    dtCriacao: string
}

export interface DetailsAvaliacao {
    total_avaliacoes: number
    total_avaliacoes_por_nota: {
        'Nota 1': number
        'Nota 2': number
        'Nota 3': number
        'Nota 4': number
        'Nota 5': number
    }
}

export interface RequestCreateAvaliacao {
    idUsuario: number
    idInfraestruturaCicloviaria: number
    nota: number
    comentario: string
}

export interface PageAvaliacao {
    avaliacoes: Avaliacao[]
    totalRegistros: number
    totalPaginas: number
}

export interface RequestPageAvaliacao {
    idInfraestruturaCicloviaria: number
    pagina: number | null
    nota: number | null
}