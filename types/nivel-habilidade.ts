export interface NivelHabilidade {
    id: number
    nome: string
    descricao: string
}
export interface ListNivelHabilidade {
  nome: string;
  id: number;
  value: NivelHabilidade;
}