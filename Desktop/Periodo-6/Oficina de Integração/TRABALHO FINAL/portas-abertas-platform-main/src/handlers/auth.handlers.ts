import type { IAuthService } from "../services/iauth.services.js";
import type { LoginRequest } from "../dtos/login-request.dtos.js";
import type { LoginResponse } from "../dtos/login-response.dtos.js";

export class AuthHandler {

    constructor(
        public authService: IAuthService
    ){}

    public login(req: any, res: any): void {

        // Tipar com LoginRequest faz o compilador aceitar somente campos com o mesmo nome dessa classe.
        const { email, senha }: LoginRequest = req.body;
    
        if(!email || !senha){
            res.status(400).json({ error: "Email e Senha são obrigatórios"});
        } else {
            this.authService.login(email, senha)
                .then( (response : LoginResponse) => {
                    console.log(response.nome);
                    res.status(200).json(response);
                })
                .catch( err => {
                    res.status(401).json({ error: "Erro ao efetuar login"});
            });
        }
    }

}