import type { DataSource } from "typeorm";
import { BaseSeed } from "./iseedBase.seeds.js";
import type { AdminRepository } from "../repositories/admin.repositories.js";
import { Admin } from "../models/admin.models.js";
import { Endereco } from "../models/endereco.model.js";
import bcrypt from "bcrypt";
import { UuidProvider } from "../utils/uuid-provider.utils.js";

export class AdminSeed extends BaseSeed {
    
    constructor(private adminRepository: AdminRepository){
        super();
    }

    async run(dataSource: DataSource): Promise<void> {
        console.log(">> Seed de Administradores iniciada.")

        // Limpa os registros antigos antes de semear
        await this.adminRepository.limparTabela();

        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

        // Gera o hash seguro de forma assíncrona para as senhas
        const senha1Hash = await bcrypt.hash("master#2026", saltRounds);
        const senha2Hash = await bcrypt.hash("suporte@abertas", saltRounds);
        const senha3Hash = await bcrypt.hash("analista123", saltRounds);

        const enderecoPadrao: Endereco = new Endereco(
            "Avenida Principal",
            "Centro",
            BigInt(123),
            "86300000",
            "Cornélio Procópio",
            "PR",
            "Brasil"
        );

        const adminMaster = new Admin(
            "Admin",
            "53361427003",
            "admin@portas.com",
            senha1Hash,
            undefined,
            UuidProvider.gerarUuid(),
            enderecoPadrao
        );

        const adminSuporte = new Admin(
            "Paulo",
            "44390632007",
            "suporte@sistema.com",
            senha2Hash,
            undefined,
            UuidProvider.gerarUuid(),
            enderecoPadrao
        );

        const adminAnalista = new Admin(
            "Luana",
            "06864197022",
            "analista@sistema.com",
            senha3Hash,
            undefined,
            UuidProvider.gerarUuid(),
            enderecoPadrao
        );
        
        // Salvando os registros utilizando o repositório existente
        if (await this.adminRepository.create(adminMaster)) {
            console.log("  >> Admin Admin criado com sucesso (Senha: admin123)");
        }
        if (await this.adminRepository.create(adminSuporte)) {
            console.log("  >> Admin Paulo criado com sucesso (Senha: paulo777)");
        }
        if (await this.adminRepository.create(adminAnalista)) {
            console.log("  >> Admin Luana criado com sucesso (Senha: luana111)");
        }

        console.log(">> Seed de Administradores finalizada com êxito.");

    }

}