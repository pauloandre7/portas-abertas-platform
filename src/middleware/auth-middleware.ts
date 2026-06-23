import type { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

// A interface abaixo identifica o que há no payload (definido na geração do token)
export interface CustomRequest extends Request {
    usuarioUuid: string;
    email: string;
}

export const authMiddleware: RequestHandler = (req, res, next) => {
    const customReq = req as CustomRequest;
    const authHeader = customReq.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ error: "Acesso negado. Token não fornecido." });
        return;
    }

    // O header vem com o texto: "Bearer [token]"
    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        res.status(401).json({ error: "Erro de formatação do Token." });
        return;
    }

    // A segunda parte da string separada é o token (é o esperado)
    const token = parts[1];

    // decodificação de fato do token
    try {
        const secret = process.env.JWT_SECRET || "portas-abertas-secret";
        
        if (!token) throw new Error("Erro ao validar token");
        
        // O verify dispara um erro automaticamente se o token for falso ou se estiver expirado
        // Decodificamos e forçamos a tipagem do que esperamos que tenha lá dentro
        const decodificado = jwt.verify(token, secret) as unknown as { usuarioUuid: string, email: string };

        // Injeta o ID do usuário na requisição
        customReq.usuarioUuid = decodificado.usuarioUuid;
        customReq.email = decodificado.email;
        // Se for válido, avisa o express pra seguir
        return next();

    } catch (error) {
        // Cai aqui se o jwt.verify() falhar (assinatura inválida, expirou, etc)
        res.status(401).json({ error: "Token inválido ou expirado." });
        return;
    }
};