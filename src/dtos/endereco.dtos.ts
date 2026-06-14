export class EnderecoDto {

    constructor(
        public logradouro: string,
        public bairro: string,
        public numero: bigint,
        public cep: string,
        public cidade: string,
        public estado: string,
        public pais: string
    ){ }

}