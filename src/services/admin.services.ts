import bcrypt  from "bcrypt";
import type { IAdminService } from "./iadmin.services.js";
import type { IAdminRepository } from "../repositories/iadmin.repositories.js";
import { AdminRequest } from "../dtos/admin-request.dtos.js";
import { Admin } from "../models/admin.models.js";
import { UuidProvider } from "../utils/uuid-provider.utils.js";
import type { AdminCreateRequest } from "../dtos/admin-create.dtos.js";

export class AdminService implements IAdminService {

    constructor(
        private readonly adminRepository: IAdminRepository
    ) {}

    async create(cadastrarRequest: AdminCreateRequest): Promise<AdminRequest> {
        
        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

        const senhaHash = await bcrypt.hash(cadastrarRequest.senha, saltRounds); 

        const admin = new Admin(
            cadastrarRequest.nome,
            cadastrarRequest.cpf,
            cadastrarRequest.email,
            senhaHash,
            undefined, // id undefined para o banco de dados autogerar via incremento
            UuidProvider.gerarUuid(),
            cadastrarRequest.endereco as any
        );

        const salvou = await this.adminRepository.create(admin);

        if (!salvou) {
            throw new Error("Não foi possível cadastrar o administrador.");
        }

        return new AdminRequest(
            admin.uuid!,
            admin.nome!,
            admin.cpf!,
            admin.email!,
            admin.endereco! as any
        );
    }

    async delete(uuid: string): Promise<boolean> {
        throw new Error("Esse método será implementado em outra atualização");
    }

    async update(updateRequest: AdminRequest): Promise<AdminRequest> {
        throw new Error("Esse método será implementado em outra atualização");
    }

    async buscarPorUuid(uuid: string): Promise<AdminRequest> {
        throw new Error("Esse método será implementado em outra atualização");
    }

    async listarTodos(): Promise<AdminRequest[]> {
        throw new Error("Esse método será implementado em outra atualização");
    }

    async listarPorNome(nome: string): Promise<AdminRequest[]> {
        throw new Error("Esse método será implementado em outra atualização");
    }

    async buscarPorEmail(email: string): Promise<AdminRequest> {
        throw new Error("Esse método será implementado em outra atualização");
    }
}