export class Endereco { 

    constructor(
        public logradouro: string,
        public bairro: string,
        public numero: number,
        public cep: string,
        public estado: string,
        public pais: string
    ){}
}