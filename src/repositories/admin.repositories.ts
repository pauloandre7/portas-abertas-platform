import { Repository } from "typeorm";
import { AppDataSource } from "../config/database.js";
import { Admin } from "../models/admin.models.js";
import type{ IAdminRepository } from "./iadmin.repositories.js";
import type { promises } from "node:dns";

export class AdminRepository implements IAdminRepository{
    
    // O repository é uma classe do typeORM. Eu passo o tipo Admin para que ele usar 
    // aquele mapeamento feito na model e gerenciar meu acesso à entidade do banco
    // Além disso, a própria classe já gera métodos de create, delete, find e save.
    private repository : Repository<Admin>;

    constructor() {
        this.repository = AppDataSource.getRepository(Admin);
    }

    async create(admin: Admin): Promise<boolean> {
        
        try {
            // o save realiza a query de create no banco de dados
            await this.repository.save(admin);
            return true;
            
        } catch (error) {
            
            console.error("Erro ao salvar o Admin no banco de dados:", error);
            return false;
        }

    }

    async delete(uuid : string): Promise<boolean> {
        
        try{
            await this.repository.delete({uuid: uuid});
            return true;
        } catch (error) {
            throw new Error("Não foi possível excluir o admin: "+ error);
        }
    }

    async update(admin: Admin): Promise<boolean> {
        
        try{
            await this.repository.update({id: admin.id}, admin);
            return true;

        } catch ( error ){
            throw new Error("Não foi possível atualizar o admin: "+ error);
        }
    }

    async findByUuid(uuid: string): Promise<Admin | null> {
        
        return await this.repository.findOneBy({uuid: uuid});
    }

    async findAll(): Promise<Admin[]> {
        
        return await this.repository.find();
    }


    async findByEmail(email: string): Promise<Admin | null> {

        return await this.repository.findOneBy({email});
    }

    async limparTabela() : Promise<void> {
        await this.repository.clear();
    }
}