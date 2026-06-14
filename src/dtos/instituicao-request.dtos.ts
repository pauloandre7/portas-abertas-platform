import type { ContatoDto } from "./contato.dtos.js";
import type { EnderecoDto } from "./endereco.dtos.js";

export class InstituicaoRequest {

    constructor(
        public uuid: string,
        public nome: string,
        public cnpj: string,
        public descricao: string,
        public servicos: string[],
        public contato: ContatoDto,
        public endereco: EnderecoDto
    ){}
}