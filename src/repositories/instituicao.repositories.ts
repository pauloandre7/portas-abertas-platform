import { Repository } from "typeorm";
import { Instituicao } from "../models/instituicao.model.js";
import type { IInstituicaoRepository } from "./iinstituicao.repositories.js"
import { AppDataSource } from "../config/database.js";
import type { Long } from "typeorm/driver/mongodb/bson.typings.js";

export class InstituicaoRepository implements IInstituicaoRepository {
    
    private repository : Repository<Instituicao>;

    constructor () {
        
        this.repository = AppDataSource.getRepository(Instituicao);
    }

    async delete(uuid: string): Promise<boolean> {
        try{
            await this.repository.delete({uuid: uuid})    
            return true;
        } catch( error ){
            throw new Error("Não foi possível excluir Instituicao: "+ error);
        }
    }

    async create(instituicao: Instituicao): Promise<boolean> {
        
        try{
            await this.repository.save(instituicao);    
            return true;

        } catch( error ){
            throw new Error("Não foi possível salvar Instituicao: "+ error);
        }
    }
    
    async update(instituicao: Instituicao): Promise<boolean> {
        try{
            await this.repository.update({id: instituicao.id}, instituicao);
            return true;

        } catch ( error ){
            throw new Error("Não foi possível atualizar Instituicao: "+ error);
        }
    }

    async findById(id: bigint): Promise<Instituicao | null> {
        
        return await this.repository.findOneBy({id: id});
    }

    async findByUuid(uuid: string): Promise<Instituicao | null> {

        return await this.repository.findOneBy({uuid: uuid});
    }

    async findAll(): Promise<Instituicao[] | null> {
        
        return await this.repository.find();
    }

    async findByCidade(cidade: string): Promise<Instituicao[] | null> {

        return await this.repository.find({
            // Ficou essa estrutura porque Endereco é uma outra classe fora de Instituicao
            where: {
                endereco: {
                    cidade: cidade
                }
            }
        });
    }

    async findByServicos(servicos: string[]): Promise<Instituicao[] | null> {
        
        if(servicos == null){
            throw new Error("Não foram informados os serviços para filtragem");
        }

        let instituicoes : Instituicao[];
        instituicoes = new Array();

        // pega cada item de "servicos" e guarda em "servico", que será usado no método find
        for ( const servico of servicos){
            instituicoes.concat(await this.repository.findBy({ servicos: servico }));
        }

        if(instituicoes.length){
            
            return instituicoes;
        } else {
            throw new Error("");
        }
    }

    async limparTabela() : Promise<void> {
        
        await this.repository.clear();
    }

}