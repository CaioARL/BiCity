export interface TipoProblema {
    id: number
    descricao: string
}


export interface ListTipoProblema {
    nome: string
    id: number
    value: TipoProblema
  }