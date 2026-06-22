import { Endereco } from './endereco.model.js';
import { Contato } from './contato.models.js';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
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
            
            if(!(cnpj === undefined)) {

                if(this.validaCnpj(cnpj)) throw new Error("Não é possível criar Instituicao: CNPJ inválido");
            }

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

    private validaCnpj(cnpj: string): boolean {

        let cnpjTratado = cnpj.trim().replaceAll(".", "").replaceAll("-","");
        
        // garantir tamanho
        if (!(cnpjTratado.length === 14)) return false;

        // garantir que só tem números
        for(let i: number = 1; 1 < cnpjTratado.length; i++){
            
            let cnpjNumber : number = parseInt(cnpjTratado.substring(i-1, i));

            if (!Number.isInteger(cnpjNumber)) return false;
        }

        // Garante os dígitos verificadores
        return this.algoritmoDigitoCnpj(cnpjTratado);

    }

    private algoritmoDigitoCnpj(cnpj: string): boolean{
        let soma : number = 0;
        let resto : number = 0;
        let verificadorDezena : number = 0;
        let verificadorUnidade : number = 0;
        // mesma ordem para os dois digitos, mas o primeiro usa do 5 pra frente
        let pesosOrdem : number[] = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        
        // vai até os primeiros 12 digitos
        for (let i: number = 1; i <= 12; i++){
            
            // pra acalmar esse compilador ruim dos infernos
            const peso = pesosOrdem[i];
            if(peso === undefined){
                throw new Error("Erro intero: Sequência de pesos do CNPJ incompleta");
            }

            soma += parseInt(cnpj.substring(i-1, i)) * peso;
        }

        resto = soma%11;
        // se o resto for menor que 2, continuar sendo zero mesmo igual cpf;
        if(resto >= 2 ) verificadorDezena = 11 - resto;

        // pega o dígito da posição 12
        if(!(parseInt(cnpj.substring(12, 13)) === verificadorDezena)) return false;


        // --------------- SEGUNDO DÍGITO
        soma = 0;
        resto = 0;
        for (let i: number = 1; i <= 13; i++){
            
            const peso = pesosOrdem[i-1];
            if(peso === undefined){
                throw new Error("Erro intero: Sequência de pesos do CNPJ incompleta");
            }

            soma += parseInt(cnpj.substring(i-1, i)) * peso;
        }

        resto = soma%11;

        if(resto >= 2 ) verificadorUnidade = 11 - resto;

        return (parseInt(cnpj.substring(13, 14)) === verificadorUnidade);
    }
}