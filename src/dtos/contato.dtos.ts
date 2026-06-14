export class ContatoDto{

    constructor(
        public telefone: string,
        public email: string,
        public instagram?: string,
        public facebook?: string,
        public site?: string
    ){}
}