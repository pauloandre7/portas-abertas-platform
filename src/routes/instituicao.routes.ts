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
        
        this.router.get(
            '/admin/instituicoes',
            authMiddleware,
            (req, res) => this.handler.listar(req, res, false)
        );

        this.router.get(
            '/admin/instituicao/uuid/:uuid',
            authMiddleware,
            (req, res) => this.handler.instituicaoPorUuid(req, res, false)
        )

        this.router.get(
            '/admin/instituicoes/nome/:nome',
            authMiddleware,
            (req, res) => this.handler.instituicaoPorNome(req, res, false)
        )

        this.router.get(
            '/admin/instituicoes/cidade/:cidade',
            authMiddleware,
            (req, res) => this.handler.listarPorCidade(req, res, false)
        );

        this.router.get(
            '/admin/instituicoes/filtro',
            authMiddleware,
            (req, res) => this.handler.listarPorCidadeEServico(req, res, false)
        );

        // Métodos públicos não passam pelo authMiddleware
        this.router.get(
            '/instituicoes',
            (req, res) => this.handler.listar(req, res, true)
        );

        this.router.get(
            '/instituicao/uuid/:uuid',
            (req, res) => this.handler.instituicaoPorUuid(req, res, true)
        )

        this.router.get(
            '/instituicoes/nome/:nome',
            (req, res) => this.handler.instituicaoPorNome(req, res, true)
        )

        this.router.get(
            '/instituicoes/cidade/:cidade',
            (req, res) => this.handler.listarPorCidade(req, res, true)
        );

        this.router.get(
            '/instituicoes/filtro',
            (req, res) => this.handler.listarPorCidadeEServico(req, res, true)
        );
    } 
}