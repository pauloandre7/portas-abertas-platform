export class AdminCreateRequest {
    constructor(
        public nome: string,
        public cpf: string,
        public email: string,
        public senhaHash: string, // we name it this or just senha from frontend, backend maps to senhaHash
        public status: string,
        public role: string
    ) {}
}
