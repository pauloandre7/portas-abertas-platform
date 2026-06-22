import { ArrayContains, ArrayOverlap, ILike, Repository } from "typeorm";
import { Instituicao } from "../models/instituicao.model.js";
import type { IInstituicaoRepository } from "./iinstituicao.repositories.js"
import { AppDataSource } from "../config/database.js";
import { threadCpuUsage } from "node:process";

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

    async findByNome(nome: string): Promise<Instituicao[] | null> {

        // O decorator ILike permite realizar uma busca personalizada
        // utilizando operadores do SQL. O % tá sendo usado pra pegar
        // tudo que COMEÇA com nome. Além disso, é sem case sensitive
        return await this.repository.findBy({nome: ILike(`${nome}%`)});
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

    async findByCidadeEServico(cidade: string, servico: string): Promise<Instituicao[] | null> {    
        const instituicoes =
            await this.repository.find({
                where: {
                    endereco: {
                        cidade: cidade
                    }
                }
            });

        return instituicoes.filter(
            (instituicao: Instituicao) =>
                instituicao.servicos?.includes(servico)
        );
    }

    async findByServicos(servicos: string[]): Promise<Instituicao[] | null> {
        
        if(servicos == null){
            throw new Error("Não foram informados os serviços para filtragem");
        }

        // O TypeORM monta uma Query que busca todos que tiverem os elementos do array
        const instituicoes = await this.repository.findBy({
            servicos: ArrayContains(servicos)
        });

        if(instituicoes.length > 0){
            
            return instituicoes;
        } else {
            throw new Error("Nenhuma instituição foi encontrada.");
        }
    }

    async limparTabela() : Promise<void> {
        
        await this.repository.clear();
    }

}