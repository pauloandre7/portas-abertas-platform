import type { ContatoDto } from "./contato.dtos.js";
import type { EnderecoDto } from "./endereco.dtos.js";

export class InstituicaoCreateRequest {

    constructor(
        public nome: string,
        public cnpj: string,
        public descricao: string,
        public servicos: string[],
        public contato: ContatoDto,
        public endereco: EnderecoDto
    ){}
}