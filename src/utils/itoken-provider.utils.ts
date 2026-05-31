export interface TokenPayload {
    usuarioUuid: number;
    email: string;
}

export interface ITokenProvider {
    
    gerarToken(payload: TokenPayload): string;

    validarToker(token : string): TokenPayload;
}