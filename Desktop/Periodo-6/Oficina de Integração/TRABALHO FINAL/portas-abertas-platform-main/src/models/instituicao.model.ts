import type { Endereco } from './endereco.model.js';
import type { Contato } from './contato.models.js';

// funcinoa como um enum. O "as const" impede alterações
const Status = {
    ATIVO: "ativo",
    INATIVO: "inativo",
    PENDENTE: "pendente"
} as const;

export class Instituicao {   
    
    constructor(
        public nome: string,
        public servicos: string[],
        public contato: Contato,
        public endereco: Endereco,
        public cnpj?: string | undefined,
        public readonly id?: bigint | undefined,
        public readonly uuid?: string | undefined        
    ){ 

        if(!(this.cnpj === undefined)) this.validaCnpj(this.cnpj);
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