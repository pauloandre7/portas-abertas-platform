export class UuidProvider {

    constructor(){}
    
    static gerarUuid(): string {

        return crypto.randomUUID();
    }
}