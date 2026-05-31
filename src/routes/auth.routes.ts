import type { Router } from 'express';
import { AuthHandler } from '../handlers/auth.handlers.js';

export class AuthRoutes {
    
    constructor(
        public router: Router,
        public authHandler: AuthHandler
    ){

        this.initializeRoutes();
    }


    private initializeRoutes(): void{
        this.router.post(
            '/login',
            // essa arrow function resume o function(req, res){}... Porque aqui precisa de uma function mesmo, então já passa com arrow que é resumido.
            (req, res) => this.authHandler.login(req, res)
        );
    }
}