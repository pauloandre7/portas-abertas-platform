import type { Router } from 'express';
import { AdminHandler } from '../handlers/admin.handlers.js';
import { authMiddleware } from '../middleware/auth-middleware.js';

export class AdminRoutes {
    
    constructor(
        public router: Router,
        public handler: AdminHandler
    ){
        this.initializeRoutes();
    }

    private initializeRoutes(): void{
        // Rota protegida para listar todos os usuários (administradores)
        this.router.get(
            '/admin/usuarios',
            authMiddleware,
            (req, res) => this.handler.listarTodos(req, res)
        );

        this.router.post(
            '/admin/usuarios',
            authMiddleware,
            (req, res) => this.handler.cadastrar(req, res)
        );

        this.router.put(
            '/admin/usuarios',
            authMiddleware,
            (req, res) => this.handler.modificar(req, res)
        );

        this.router.delete(
            '/admin/usuarios/:uuid',
            authMiddleware,
            (req, res) => this.handler.excluir(req, res)
        );
    }
}
