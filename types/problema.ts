import { TipoProblema } from "./tipo-problema"

export interface RequestCreateProblema {
    descricao: string
    ativo: boolean
    latitude: number
    longitude: number
    idTipoProblema: number
}


export interface Problema {
    id: number
    descricao: string
    latitude: number
    longitude: number
    dtCriacao: string
    ativo: boolean
    reportCount: number
    s3Url: string
    tipoProblema: TipoProblema
}



export interface RequestProblemaByRadius {
    latitude: number
    longitude: number
    raio: number
}



export interface RequestCreateProblemaImage {
    id: number
    image: FormData
}


