import { Endereco } from "../models/endereco.model.js";

export class AdminResponse {
    constructor(
        public nome: string,
        public cpf: string,
        public email: string,
        public uuid: string,
        public status: string,
        public role: string,
        public id?: bigint,
        public endereco?: Endereco
    ) {}
}
