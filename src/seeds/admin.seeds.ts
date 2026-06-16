import type { DataSource } from "typeorm";
import { BaseSeed } from "./iseedBase.seeds.js";
import type { AdminRepository } from "../repositories/admin.repositories.js";
import { Admin } from "../models/admin.models.js";
import { Endereco } from "../models/endereco.model.js";

export class AdminSeed extends BaseSeed {
    
    constructor(private adminRepository: AdminRepository){
        super();
    }

    async run(dataSource: DataSource): Promise<void> {
        console.log(">> Seed de Administradores iniciada.")

        await this.adminRepository.limparTabela();

        
        const endereco: Endereco = new Endereco(
            "Avenida Principal",
            "Centro",
            BigInt(123),
            "86300000",
            "Cornélio",
            "PR",
            "Brasil"
        );

        // Cria o objeto admin para mandar ao banco
        const admin: Admin = new Admin(
            "Admin",
            "12345678909",
            "admin@sistema.com",
            "admin123",
            undefined,               // id undefined para o banco autogerar
            "uuid-padrao-0001",
            endereco
        );
        
        if( await this.adminRepository.create(admin) ) console.log("  >> Admin 1 criado com sucesso");

        console.log(">> Seed de Administradores finalizada");

    }

}