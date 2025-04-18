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