import type { Router } from "express";
import type { InstituicaoHandler } from "../handlers/instituicao.handlers.js";

export class InstituicaoRoutes {


    constructor(
        public router: Router,
        public handler: InstituicaoHandler
    ){

        this.initializeRoutes();
    }
    
    
        private initializeRoutes(): void{

            // Por enquanto só tem essa rota válida
            this.router.put(
                '/instituicao',
                
                (req, res) => this.handler.modificar(req, res)
            );
        }
}