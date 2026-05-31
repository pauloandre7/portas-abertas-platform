import { LoginResponse } from "../dtos/login-response.dtos.js";

export interface IAuthService {

    login(email: string, senha: string): Promise<LoginResponse>;
}