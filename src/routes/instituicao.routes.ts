import type { Router } from "express";
import type { InstituicaoHandler } from "../handlers/instituicao.handlers.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

export class InstituicaoRoutes {


    constructor(
        public router: Router,
        public handler: InstituicaoHandler
    ){

        this.initializeRoutes();
    }
    
    
    private initializeRoutes(): void{
        this.router.post(
            '/instituicao',
            authMiddleware,
            (req, res) => this.handler.cadastrar(req, res)
        );

        this.router.put(
            '/instituicao',
            authMiddleware,
            (req, res) => this.handler.modificar(req, res)
        );

        this.router.delete(
            '/instituicao/:uuid',
            authMiddleware,
            (req, res) => this.handler.excluir(req, res)
        );

        // Métodos públicos não passam pelo authMiddleware
        this.router.get(
            '/instituicao/uuid/:uuid',
            (req, res) => this.handler.instituicaoPorUuid(req, res)
        )

        this.router.get(
            '/instituicoes/nome/:nome',
            (req, res) => this.handler.instituicaoPorNome(req, res)
        )
    }
}