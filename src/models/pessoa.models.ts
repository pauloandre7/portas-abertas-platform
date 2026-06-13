import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Endereco } from "./endereco.model.js";

export class Pessoa {
    
    @PrimaryGeneratedColumn("increment")
    public id?: bigint;

    @Column({type: "varchar", nullable: false})
    public uuid?: string;

    @Column({ type: "varchar", length: 255 })
    public nome?: string;

    @Column({ type: "varchar", length: 11 })
    public cpf?: string;

    @Column({ type: "varchar" })
    public email?: string;

    @Column({ type: "varchar"})
    public senhaHash?: string;

    // Essa expressão abaixo faz essa Entity aqui criar colunas usando o mapeamento de colunas da CLasse Endereco.
    // então a classe Pessoa faria colunas do tipo: EnderecoNumero, EndereroPais, etc...
    @Column(() => Endereco)
    public endereco?: Endereco;

    constructor(
        nome?: string,
        cpf?: string,
        email?: string,
        senhaHash?: string,
        id?: bigint,
        uuid?: string,
        endereco?: Endereco
    ){ 
        if(nome && cpf && email && senhaHash){
            if (!this.validaCpf(cpf)) throw new Error("Não é possível criar Pessoa: CPF inválido");
            if (!email.includes("@")) throw new Error("Não é possível criar Pessoa: Email inválido");
            if (senhaHash.trim().length === 0) throw new Error("Não é possível criar Pessoa: Senha vazia");
            
            this.nome = nome;
            this.cpf = cpf;
            this.email = email;
            this.senhaHash = senhaHash;
            
            this.id =  id;
            this.uuid =  uuid;
            this.endereco =  endereco;
        }

    }

    private validaCpf(cpf: string): boolean {
        let cpfTratado = cpf.trim().replaceAll(".", "").replaceAll("-","");
        
        // garantir tamanho
        if (!(cpfTratado.length === 11)) return false;

        // garantir que só tem números
        for(let i: number = 1; i < cpfTratado.length; i++){
            
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
