import { NivelHabilidade } from "./nivel-habilidade";

export interface TipoEvento {
    id: number;
    nome: string;
    nivelHabilidade: NivelHabilidade;
}