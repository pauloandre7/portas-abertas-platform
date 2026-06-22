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
    }

}