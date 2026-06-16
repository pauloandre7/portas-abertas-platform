import type { ContatoDto } from "./contato.dtos.js";
import type { EnderecoDto } from "./endereco.dtos.js";
import type { StatusInstituicao } from '../models/instituicao-status-enum.models.js';

export class InstituicaoCreateRequest {

    constructor(
        public nome: string,
        public cnpj: string,
        public descricao: string,
        public status: StatusInstituicao,
        public servicos: string[],
        public contato: ContatoDto,
        public endereco: EnderecoDto
    ){}
}