import { Admin } from "../models/admin.models.js"

export interface IAdminRepository{

    create(admin: Admin): Promise<boolean>;
    delete(uuid: string): Promise<boolean>;
    update(admin: Admin): Promise<boolean>;
    findByUuid(uuid: string): Promise<Admin | null> ;
    findAll(): Promise<Admin[] | null>;
    findByEmail(email: string): Promise<Admin | null>;

}