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

    delete(id: number): Promise<boolean> {
        throw new Error("Método a ser implementado em sprints futuras.");
    }

    update(admin: Admin): Promise<boolean> {
        throw new Error("Método a ser implementado em sprints futuras.");
    }

    findById(id: number): Promise<Admin> {
        throw new Error("Método a ser implementado em sprints futuras.");
    }

    findAll(): Promise<Admin[]> {
        throw new Error("Método a ser implementado em sprints futuras.");
    }


    async findByEmail(email: string): Promise<Admin | null> {
        // TODO: testar esse método após implementação da seed
        return await this.repository.findOneBy({email});
    }

    async limparTabela() : Promise<void> {
        await this.repository.clear();
    }
}