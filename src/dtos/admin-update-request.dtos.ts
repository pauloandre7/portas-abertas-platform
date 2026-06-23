export class AdminUpdateRequest {
    constructor(
        public uuid: string,
        public nome?: string,
        public cpf?: string,
        public email?: string,
        public senhaHash?: string,
        public status?: string,
        public role?: string
    ) {}
}
