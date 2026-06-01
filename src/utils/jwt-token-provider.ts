import jwt from "jsonwebtoken";
import type {
    ITokenProvider,
    TokenPayload
} from "./itoken-provider.utils.js";

export class JwtTokenProvider implements ITokenProvider {

    private readonly SECRET =
        process.env.JWT_SECRET || "portas-abertas-secret";

    gerarToken(payload: TokenPayload): string {

        return jwt.sign(
            payload,
            this.SECRET,
            {
                expiresIn: "24h"
            }
        );
    }

    validarToker(token: string): TokenPayload {

        return jwt.verify(
            token,
            this.SECRET
        ) as TokenPayload;
    }
}