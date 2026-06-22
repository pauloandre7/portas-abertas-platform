import bcrypt  from "bcrypt";
import type { IAdminService } from "./iadmin.services.js";
import type { IAdminRepository } from "../repositories/iadmin.repositories.js";
import { AdminRequest } from "../dtos/admin-request.dtos.js";
import { Admin } from "../models/admin.models.js";
import { UuidProvider } from "../utils/uuid-provider.utils.js";
import type { AdminCreateRequest } from "../dtos/admin-create.dtos.js";

export class AdminService implements IAdminService {

    constructor(
        private readonly repository: IAdminRepository
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

        const salvou = await this.repository.create(admin);

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
        const instituicao = await this.repository.findByUuid(uuid);

        if (!instituicao) {
            throw new Error("Instituição não encontrada.");
        }

        return await this.repository.delete(uuid);
    }

    async listarTodos(): Promise<AdminRequest[]> {
        
        const administradores = await this.repository.findAll();

        if (!administradores || administradores.length === 0) {
            throw new Error("Nenhuma administrador encontrado");
        }

        // Mapeia o array de entidades 'Admin' para o array de DTOs 'AdminRequest'
        return administradores.map(admin => {
            return new AdminRequest(
                admin.uuid!,
                admin.nome!,
                admin.cpf!,
                admin.email!,
                admin.endereco! as any
            );
        });
    }

    async update(updateRequest: AdminRequest): Promise<AdminRequest> {
        if (!updateRequest.uuid) {
            throw new Error("Identificador UUID é obrigatório para atualizar o administrador.");
        }

        const adminOriginal = await this.repository.findByUuid(updateRequest.uuid);

        if (!adminOriginal) {
            throw new Error("Administrador não encontrado.");
        }

        adminOriginal.nome = updateRequest.nome ?? adminOriginal.nome;
        adminOriginal.cpf = updateRequest.cpf ?? adminOriginal.cpf;
        adminOriginal.email = updateRequest.email ?? adminOriginal.email;
        adminOriginal.endereco = updateRequest.endereco ?? adminOriginal.endereco;

        const atualizou = await this.repository.update(adminOriginal);

        if (!atualizou) {
            throw new Error("Não foi possível atualizar o administrador.");
        }

        return new AdminRequest(
            adminOriginal.uuid!,
            adminOriginal.nome!,
            adminOriginal.cpf!,
            adminOriginal.email!,
            adminOriginal.endereco! as any
        );
    }

    async buscarPorUuid(uuid: string): Promise<AdminRequest> {
        throw new Error("Esse método será implementado em outra atualização");
    }

    async listarPorNome(nome: string): Promise<AdminRequest[]> {
        throw new Error("Esse método será implementado em outra atualização");
    }

    async buscarPorEmail(email: string): Promise<AdminRequest> {
        throw new Error("Esse método será implementado em outra atualização");
    }
}