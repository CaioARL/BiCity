import { FeatureCollection, Geometry } from "geojson"
import { Problema } from "./problema"

export interface InfraestruturaGeoJson extends FeatureCollection<Geometry, {
    name: string
    id: string
    type: string
}> {}



export interface RequestInfraestruturaByRadius {
    latitude:number
    longitude: number
    raio: number
}


export interface Trecho {
    id: number
    latitude: number
    longitude: number
    problemas: Problema[]
}


export interface TipoInfraestruturaCicloviaria {
    id: number
    nome: string
    descricao: string
}

export interface InfraestruturaCicloviaria {
    id: number
    jsonId: string
    nome: string
    notaMedia: number
    geometria: string
    tipoInfraestruturaCicloviaria: TipoInfraestruturaCicloviaria
    trechos: Trecho[]
}