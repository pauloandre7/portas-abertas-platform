import { EnderecoDto } from "./endereco.dtos.js";

export class AdminRequest {
    constructor(
        public uuid: string,
        public nome: string,
        public cpf: string,
        public email: string,
        public status: string,
        public role: string,
        public endereco: EnderecoDto
    ) {}
}