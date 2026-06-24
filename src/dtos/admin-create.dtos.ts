import { EnderecoDto } from "./endereco.dtos.js";

export class AdminCreateRequest {
    constructor(
        public nome: string,
        public cpf: string,
        public email: string,
        public senha: string,
        public status: string,
        public role: string,
        public endereco: EnderecoDto
    ) {}
}