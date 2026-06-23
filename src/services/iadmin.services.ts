import { AdminResponse } from "../dtos/admin-response.dtos.js";
import { AdminCreateRequest } from "../dtos/admin-create-request.dtos.js";
import { AdminUpdateRequest } from "../dtos/admin-update-request.dtos.js";

export interface IAdminService {
    listarTodos(): Promise<AdminResponse[]>;
    cadastrar(admin: AdminCreateRequest): Promise<AdminResponse>;
    modificar(admin: AdminUpdateRequest): Promise<AdminResponse>;
    excluir(uuid: string): Promise<boolean>;
}
