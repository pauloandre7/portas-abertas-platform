
import type { AdminCreateRequest } from "../dtos/admin-create.dtos.js";
import type { AdminRequest } from "../dtos/admin-request.dtos.js";

export interface IAdminService {
    
    create(cadastrarRequest: AdminCreateRequest): Promise<AdminRequest>;
    
    delete(uuid: string): Promise<boolean>;
    
    update(updateRequest: AdminRequest): Promise<AdminRequest>;
    
    buscarPorUuid(uuid: string): Promise<AdminRequest>;
    
    listarTodos(): Promise<AdminRequest[]>;
    
    listarPorNome(nome: string): Promise<AdminRequest[]>;
    
    buscarPorEmail(email: string): Promise<AdminRequest>;
}