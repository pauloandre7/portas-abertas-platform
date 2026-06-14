import { Column } from "typeorm";

export class Endereco { 

    @Column({type: "varchar"})
    public logradouro: string;

    @Column({type: "varchar"})
    public bairro: string;

    @Column({type: "int"})
    public numero: bigint;

    @Column({type: "varchar"})
    public cep: string;

    @Column({type: "varchar"})
    public cidade: string;

    @Column({type: "varchar", length: 2})
    public estado: string;

    @Column({type: "varchar"})
    public pais: string;

    constructor(
        logradouro: string,
        bairro: string,
        numero: bigint,
        cep: string,
        cidade: string,
        estado: string,
        pais: string,
    ){

        this.logradouro = logradouro;
        this.bairro =  bairro;
        this.numero =  numero;
        this.cep =  cep;
        this.cidade = cidade;
        this.estado =  estado;
        this.pais =  pais;

    }
}