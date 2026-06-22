import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Endereco } from "./endereco.model.js";

export class Pessoa {
    
    @PrimaryGeneratedColumn("increment")
    public id?: bigint;

    @Column({type: "varchar", nullable: false, primary: true})
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
}
