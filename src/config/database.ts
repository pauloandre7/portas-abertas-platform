import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// carrega as variáveis do env
dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// exportar uma const ao invés de uma class nos dá um comportamento singleton
export const AppDataSource = new DataSource({
    type: "postgres",
    // Tive que colocar várias opções secundárias de valor por causa da tipagem forte do TS
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5433,
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "meu_banco" ,
    synchronize: process.env.NODE_ENV === "development", // só sincroniza auto se estiver em dev
    logging: process.env.NODE_ENV === "development",

    // informa o local das entidades, que no caso são as models
    entities: [__dirname + "/../models/*.{ts,js}"],
    // as migrações fornecem uma migração segura de estrutura de banco de dados (abraço, prof. Feitosa).
    migrations: [__dirname + "/../migrations/*.{ts,js}"],
    subscribers: []
});