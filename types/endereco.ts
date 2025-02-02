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