import "reflect-metadata"
import express from 'express';
import { AuthHandler } from './handlers/auth.handlers.js';
import { AuthRoutes } from './routes/auth.routes.js';
import { AuthService } from './services/auth.services.js';
import type { IAdminRepository } from './repositories/iadmin.repositories.js';
import { JwtTokenProvider } from './utils/jwt-token-provider.js';
import { Admin } from './models/admin.models.js';

import { AppDataSource } from "./config/database.js";
import { AdminRepository } from "./repositories/admin.repositories.js";
import { BaseSeed } from "./seeds/iseedBase.seeds.js";
import { AdminSeed } from "./seeds/admin.seeds.js";

async function startServer() {
    try {
        // pausa nessa linha pra tentar conectar com o banco
        await AppDataSource.initialize();
        console.log("Banco de dados conectado via .env!");

        // Inicializa a estrutura do Express
        const app = express();
        app.use(express.json());

        
        // Instanciação e injeção de dependências
        const tokenProvider = new JwtTokenProvider();
        const adminRepository = new AdminRepository();
        const authService = new AuthService(adminRepository, tokenProvider);
        const authHandler = new AuthHandler(authService);
        const authRouter = express.Router();
        // Cria o seeder de admin
        const adminSeeder = new AdminSeed(adminRepository);

        // Popula o banco com o objeto definido no seeder
        adminSeeder.run(AppDataSource);

        new AuthRoutes(authRouter, authHandler);
        app.use('/auth', authRouter);

        // Endpoint pra ver se está no ar
        app.get('/respirando', (_req, res) => {
            res.status(200).json({ status: 'ok' });
        });

        // Liga o servidor na porta correspondente
        const port = Number(parseInt(process.env.PORT || '3000', 10));
        app.listen(port, () => {
            console.log(`Servidor rodando em http://localhost:${port}`);
        });

    } catch (error) {
        console.error("Erro crítico na inicialização do app:", error);
        process.exit(1); // Fecha a aplicação indicando que houve um erro grave
    }
}

// Sobe o sistema
startServer();