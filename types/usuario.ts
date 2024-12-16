export interface Usuario {
    id: string
    nome: string
    email: string
    funcao: string
}



export interface DadosUsuario {
    id: string
    nome: string
    email: string
    senha: string
    funcao: string
}


export interface CriarUsuarioRequest {
    nome: string
    nomeUsuario: string
    endereco: {
        cep: string
        estado: string
        cidade: string
        bairro: string
        rua: string
        numero: number
    }
    email: string
    senha: string
    cpf: string
    cnpj: string
    nivelHabilidade: number
}

export interface CriarUsuarioResponse {
    id: string
    nome: string
    email: string
    funcao: string
}



export interface UserEndereco {
    endereco: {
      rua: string,
      numero: number,
      complemento: string,
      bairro: string,
      cidade: string,
      estado: string,
      cep: string
    }
}