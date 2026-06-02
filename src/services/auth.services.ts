import { LoginResponse } from "../dtos/login-response.dtos.js";
import type { IAdminRepository } from "../repositories/iadmin.repositories.js";
import type { IAuthService } from "./iauth.services.js";
import type { ITokenProvider } from "../utils/itoken-provider.utils.js";

export class AuthService implements IAuthService {

    constructor(
        private adminRepository: IAdminRepository,
        private tokenProvider: ITokenProvider
    ) {}

    async login(
        email: string,
        senha: string
    ): Promise<LoginResponse> {

        const usuario =
            await this.adminRepository.findByEmail(email);

        if (!usuario) {
            throw new Error("Usuário não encontrado");
        }
        
        // Todo: Essa verificação aqui não vai funcionar. Do front vem string, do banco vem hash...
        // Tem que usar alguma lib para esse hash aqui.
        if (usuario.senhaHash !== senha) {
            throw new Error("Senha inválida");
        }

        const token = this.tokenProvider.gerarToken({
            usuarioUuid: usuario.uuid ?? (usuario.id !== undefined ? usuario.id.toString() : ""),
            email: usuario.email
        });

        return new LoginResponse(
            usuario.nome,
            usuario.cpf,
            usuario.email,
            token,
            usuario.id !== undefined ? usuario.id.toString() : undefined,
            usuario.uuid,
            usuario.endereco
        );
    }
}