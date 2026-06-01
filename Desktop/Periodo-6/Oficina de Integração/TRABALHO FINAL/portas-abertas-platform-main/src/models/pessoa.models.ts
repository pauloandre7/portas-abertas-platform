import { Endereco } from "./endereco.model.js";

export class Pessoa {
    
    constructor(
        public nome: string,
        public cpf: string,
        public email: string,
        public senhaHash: string,
        public id?: bigint,
        public uuid?: string,
        public endereco?: Endereco
    ){ 
        if (!this.validaCpf(this.cpf)) throw new Error("Não é possível criar Pessoa: CPF inválido");
        if (!this.email.includes("@")) throw new Error("Não é possível criar Pessoa: Email inválido");
        if (this.senhaHash.trim().length === 0) throw new Error("Não é possível criar Pessoa: Senha vazia");
    }

    private validaCpf(cpf: string): boolean {
        let cpfTratado = cpf.trim().replaceAll(".", "").replaceAll("-","");
        
        // garantir tamanho
        if (!(cpfTratado.length === 11)) return false;

        // garantir que só tem números
        for(let i: number = 1; 1 < cpfTratado.length; i++){
            
            let cpfNumber : number = parseInt(cpfTratado.substring(i-1, i));

            if (!Number.isInteger(cpfNumber)) return false;
        }

        // Garante os dígitos verificadores
        return this.algoritmoDigitoCpf(cpfTratado);
        
    }

    private algoritmoDigitoCpf(cpf: string): boolean{

        let soma : number = 0;
        let resto : number = 0;
        let verificadorDezena : number = 0;
        let verificadorUnidade : number = 0;

        // vai até os primeiros 9 digitos
        for (let i: number = 1; i <= 9; i++){
            // passa a substring pra 
            soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
        }

        resto = soma%11;
        // se o resto for menor que 2, continuar sendo zero mesmo;
        if(resto >= 2 ) verificadorDezena = 11 - resto;

        // pega o dígito da posição 9
        if(!(parseInt(cpf.substring(9, 10)) === verificadorDezena)) return false;


        // --------------- SEGUNDO DÍGITO
        soma = 0;
        resto = 0;
        for (let i: number = 1; i <= 10; i++){
            // passa a substring pra 
            soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
        }

        resto = soma%11;
        // se o resto for menor que 2, continuar sendo zero mesmo;
        if(resto >= 2 ) verificadorUnidade = 11 - resto;

        return (parseInt(cpf.substring(10, 11)) === verificadorUnidade)

    }
}
