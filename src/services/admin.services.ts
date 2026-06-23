import { AdminResponse } from "../dtos/admin-response.dtos.js";
import { AdminCreateRequest } from "../dtos/admin-create-request.dtos.js";
import { AdminUpdateRequest } from "../dtos/admin-update-request.dtos.js";
import { Admin } from "../models/admin.models.js";
import type { IAdminRepository } from "../repositories/iadmin.repositories.js";
import type { IAdminService } from "./iadmin.services.js";
import { UuidProvider } from "../utils/uuid-provider.utils.js";

export class AdminService implements IAdminService {

    constructor(
        public repository: IAdminRepository
    ) {}

    async listarTodos(): Promise<AdminResponse[]> {
        const admins = await this.repository.findAll();

        if (!admins || admins.length === 0) {
            return [];
        }

        // Mapeia a Entity para o DTO de resposta (omitindo a senhaHash)
        return admins.map(a => new AdminResponse(
            a.nome!,
            a.cpf!,
            a.email!,
            a.uuid!,
            a.status ?? "ativo",
            a.role ?? "Editor",
            a.id,
            a.endereco
        ));
    }

    async cadastrar(request: AdminCreateRequest): Promise<AdminResponse> {
        const admin = new Admin(
            request.nome,
            request.cpf,
            request.email,
            request.senhaHash,
            undefined, // id
            UuidProvider.gerarUuid(),
            undefined // endereco
        );
        admin.status = request.status;
        admin.role = request.role;

        const salvou = await this.repository.create(admin);
        if (!salvou) {
            throw new Error("Não foi possível cadastrar o administrador.");
        }

        return new AdminResponse(
            admin.nome!,
            admin.cpf!,
            admin.email!,
            admin.uuid!,
            admin.status!,
            admin.role!,
            admin.id,
            admin.endereco
        );
    }

    async modificar(request: AdminUpdateRequest): Promise<AdminResponse> {
        if (!request.uuid) {
            throw new Error("UUID é obrigatório para modificar.");
        }

        const admins = await this.repository.findAll();
        const adminOriginal = admins.find(a => a.uuid === request.uuid);

        if (!adminOriginal) {
            throw new Error("Administrador não encontrado.");
        }

        adminOriginal.nome = request.nome ?? adminOriginal.nome;
        adminOriginal.cpf = request.cpf ?? adminOriginal.cpf;
        adminOriginal.email = request.email ?? adminOriginal.email;
        adminOriginal.status = request.status ?? adminOriginal.status;
        adminOriginal.role = request.role ?? adminOriginal.role;
        
        if (request.senhaHash && request.senhaHash.trim() !== "") {
            adminOriginal.senhaHash = request.senhaHash;
        }

        const atualizou = await this.repository.update(adminOriginal);
        if (!atualizou) {
            throw new Error("Falha ao salvar alterações do Administrador.");
        }

        return new AdminResponse(
            adminOriginal.nome!,
            adminOriginal.cpf!,
            adminOriginal.email!,
            adminOriginal.uuid!,
            adminOriginal.status ?? "ativo",
            adminOriginal.role ?? "Editor",
            adminOriginal.id,
            adminOriginal.endereco
        );
    }

    async excluir(uuid: string): Promise<boolean> {
        const admins = await this.repository.findAll();
        const admin = admins.find(a => a.uuid === uuid);

        if (!admin) {
            throw new Error("Administrador não encontrado.");
        }

        return await this.repository.delete(admin);
    }
}
