import { Column, Entity } from 'typeorm';
import { Pessoa } from './pessoa.models.js'

@Entity()
export class Admin extends Pessoa {
    
    @Column({ type: "varchar", length: 50, default: "ativo" })
    public status?: string;

    @Column({ type: "varchar", length: 50, default: "Editor" })
    public role?: string;
    
}