export interface Usuario {
    id: string;
    nome: string;
    email: string;
    funcao: string;
}



export interface DadosUsuario {
    id: string;
    nome: string;
    email: string;
    senha: string;
    funcao: string;
}


export interface CriarUsuarioRequest {
    nome: string;
    email: string;
    senha: string;
    funcao: string;
}

export interface CriarUsuarioResponse {
    id: string;
    nome: string;
    email: string;
    funcao: string;
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