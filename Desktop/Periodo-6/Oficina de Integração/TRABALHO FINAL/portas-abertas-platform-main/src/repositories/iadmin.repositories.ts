import { Admin } from "../models/admin.models.js"

export interface IAdminRepository{

    create(admin: Admin): Promise<boolean>;
    delete(id: number): Promise<boolean>;
    update(admin: Admin): Promise<boolean>;
    findById(id: number): Promise<Admin> ;
    findAll(): Promise<Admin[]>;
    findByEmail(email: string): Promise<Admin>;

}