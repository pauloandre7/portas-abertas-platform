import { LoginRequest } from "../dtos/login-request.dtos.js";

export interface ITokenProvider {
    
    gerarToken(payload: LoginRequest): string;

    // Esse Dto Request seria o Payload do token, que será aberto aqui
    // nesse método para extrair as claims.
    validarToker(token : string): LoginRequest;
}