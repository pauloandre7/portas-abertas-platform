export interface TokenPayload {
    usuarioUuid: string;
    email: string;
}

export interface ITokenProvider {
    
    gerarToken(payload: TokenPayload): string;

    validarToker(token : string): TokenPayload;
}