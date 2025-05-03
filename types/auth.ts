
export interface LoginRequest {
    nomeUsuario: string | null
    email: string | null
    cpf: string | null
    cnpj: string | null
    senha: string | null
}

export interface LoginErrorRequest {
    nomeUsuario: string 
    email: string 
    cpf: string 
    cnpj: string 
    senha: string 
}