import type { Router } from "express";

import { authMiddleware } from "../middleware/auth-middleware.js";
import type { AdminHandler } from "../handlers/admin.handlers.js";

export class AdminRoutes {


    constructor(
        public router: Router,
        public handler: AdminHandler
    ){

        this.initializeRoutes();
    }

    private initializeRoutes(): void{
        this.router.post(
            '/cadastrar',
            authMiddleware,
            (req, res) => this.handler.cadastrar(req, res)
        );

        this.router.put(
            '/:uuid',
            authMiddleware,
            (req, res) => this.handler.atualizar(req, res)
        );

        this.router.get(
            '/:uuid',
            authMiddleware,
            (req, res) => this.handler.buscarPorUuid(req, res)
        );

        this.router.delete(
            '/:uuid',
            authMiddleware,
            (req, res) => this.handler.deletar(req, res)
        );
        
        this.router.get('/',
            authMiddleware, 
            (req, res) => this.handler.listarTodos(req, res)
        );
        
    }

}