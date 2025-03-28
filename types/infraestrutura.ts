import { FeatureCollection, Geometry } from "geojson"

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