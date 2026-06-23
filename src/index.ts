import "reflect-metadata"
import express from 'express';
import cors from 'cors';
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
import { InstituicaoService } from "./services/instituicao.services.js";
import { InstituicaoRepository } from "./repositories/instituicao.repositories.js";
import { InstituicaoHandler } from "./handlers/instituicao.handlers.js";
import { InstituicaoRoutes } from "./routes/instituicao.routes.js";
import { AdminService } from "./services/admin.services.js";
import { AdminHandler } from "./handlers/admin.handlers.js";
import { AdminRoutes } from "./routes/admin.routes.js";

async function startServer() {
    try {
        // pausa nessa linha pra tentar conectar com o banco
        await AppDataSource.initialize();
        console.log("Banco de dados conectado via .env!");

        // Inicializa a estrutura do Express
        const app = express();
        app.use(cors({ origin: '*', allowedHeaders: ['Content-Type', 'Authorization'] }));
        app.use(express.json());

        
        // Instanciação e injeção de dependências
        const tokenProvider         = new JwtTokenProvider();
        const adminRepository       = new AdminRepository();
        const instituicaoRepository = new InstituicaoRepository();
        const authService           = new AuthService(adminRepository, tokenProvider);
        const instituicaoService    = new InstituicaoService(instituicaoRepository);
        const instituicaoHandler    = new InstituicaoHandler(instituicaoService);
        const authHandler           = new AuthHandler(authService);
        
        const adminService          = new AdminService(adminRepository);
        const adminHandler          = new AdminHandler(adminService);

        // inicializa as rotas injetando os handlers no framework
        const authRouter            = express.Router();
        const instituicaoRouter     = express.Router();
        const adminRouter           = express.Router();

        new AuthRoutes(authRouter, authHandler);
        app.use('/auth', authRouter);
        
        new InstituicaoRoutes(instituicaoRouter, instituicaoHandler);
        app.use('/', instituicaoRouter); // endpoint principal pro roteador de instituicao

        new AdminRoutes(adminRouter, adminHandler);
        app.use('/', adminRouter);

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