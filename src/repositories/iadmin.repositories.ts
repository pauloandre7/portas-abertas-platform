import { Admin } from "../models/admin.models.js"

export interface IAdminRepository{

    create(admin: Admin): Promise<boolean>;
    delete(admin: Admin): Promise<boolean>;
    update(admin: Admin): Promise<boolean>;
    findById(id: bigint): Promise<Admin | null> ;
    findAll(): Promise<Admin[] | null>;
    findByEmail(email: string): Promise<Admin | null>;

}