export class Contato{

    constructor(
        public telefone: string,
        public email: string,
        // abaixo, usei o ? ao final do atributo para definir a possibilidade de ser undefined
        public instagram?: string | undefined,
        public facebook?: string | undefined,
        public site?: string | undefined,
    ){}
}