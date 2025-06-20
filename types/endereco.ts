export interface Endereco {
    cep: string
    state: string
    city: string
    neighborhood: string
    street: string
    location: {
        type: string,
        coordinates: {
            longitude: number
            latitude: number
        }   
    }
}



export interface EventoEndereco {
    cep: string
    estado: string
    cidade: string
    bairro: string
    rua: string
    numero: number
    latitude: number
    longitude: number
}



export interface CepInfo {
    cep: string
    logradouro: string
    complemento: string
    unidade: string
    bairro: string
    localidade: string
    uf: string
    estado: string
    regiao: string
    ibge: string
    gia: string
    ddd: string
    siafi: string
}


export interface ResponseGetCepByLatAndLon {
    cep : string
}

export interface RequestSearchBarAddress {
    search : string
}

export interface ResponseSearchBarAddress {
    place_id: number
    display_name : string
    lat: string
    lon: string
    nome: string
    addresstype?: string
    boundingbox?: string[]
    class?: string
    importance?: number
    type?: string
    osm_id?: number
    osm_type?: string
    licence?: string
}