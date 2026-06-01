import { Endereco } from "../models/endereco.model.js";

export class LoginResponse {

    constructor(
        public nome: string,
        public cpf: string,
        public email: string,
        public token: string,
        public id?: bigint,
        public uuid?: string,
        public endereco?: Endereco
    ){

    }

}