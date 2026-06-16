import { AdminSeed } from "./admin.seeds.js";
import { AdminRepository } from "../repositories/admin.repositories.js";
import { AppDataSource } from "../config/database.js";
import { InstituicaoSeeder } from "./instituicao.seeds.js";
import { InstituicaoRepository } from "../repositories/instituicao.repositories.js";

const adminSeeder = new AdminSeed(new AdminRepository());
const instituicaoSeeder = new InstituicaoSeeder(new InstituicaoRepository());
console.log(">> Repositories adicionados aos Seeders.");

async function runSeeder(): Promise<void> {
    try {
        console.log("\n>> Iniciando os seeders.");

        await AppDataSource.initialize();
        await adminSeeder.run(AppDataSource);
        console.log("\n-------------------------------");
        await instituicaoSeeder.run(AppDataSource);

        console.log("\n>> Seeders finalizado com êxito.");
    } catch (error) {

        console.log("\n>> Não foi possível popular o Banco de Dados: " + error);
    } finally {
        if (AppDataSource.isInitialized) {
            
            await AppDataSource.destroy();
        }
    }
}

await runSeeder();
