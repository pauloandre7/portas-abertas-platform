import { Column } from "typeorm";

export class Endereco { 

    @Column({type: "varchar", nullable: true})
    public logradouro: string;

    @Column({type: "varchar", nullable: true})
    public bairro: string;

    @Column({type: "int", nullable: true})
    public numero: bigint;

    @Column({type: "varchar", nullable: true})
    public cep: string;

    @Column({type: "varchar", nullable: true})
    public cidade: string;

    @Column({type: "varchar", length: 2, nullable: true})
    public estado: string;

    @Column({type: "varchar", nullable: true})
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