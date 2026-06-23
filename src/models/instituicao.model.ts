import { Endereco } from './endereco.model.js';
import { Contato } from './contato.models.js';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Status, type StatusInstituicao } from './instituicao-status-enum.models.js';

@Entity()
export class Instituicao {   
    
    @PrimaryGeneratedColumn("increment")
    public readonly id?: bigint | undefined;

    @Column({type: "varchar", nullable: false, primary: true})
    public readonly uuid;
    
    @Column({type: "varchar"})
    public nome?: string;

    @Column({type: "varchar", array: true})
    public servicos?: string[];

    @Column({type: "varchar", nullable: true})
    public cnpj?: string | undefined;

    @Column({type: "text", nullable: true})
    public descricao?: string;

    @Column({type: "enum", enum: Object.values(Status), default: Status.PENDENTE, nullable: false})
    public status?:  StatusInstituicao;
    
    @Column(() => Contato)
    public contato?: Contato;

    @Column(() => Endereco)
    public endereco?: Endereco;

    constructor(
        nome?: string,
        servicos?: string[],
        contato?: Contato,
        endereco?: Endereco,
        cnpj?: string | undefined,
        descricao?: string | undefined,
        status?: StatusInstituicao,
        id?: bigint | undefined,
        uuid?: string | undefined        
    ){ 
        if(nome && servicos && contato && endereco && status){

            this.nome = nome;
            this.servicos = servicos;
            this.contato = contato;
            this.endereco = endereco;
            this.cnpj = cnpj;
            this.descricao = descricao;
            this.status = status;
            this.id = id;
            this.uuid = uuid;

        }
    }
}