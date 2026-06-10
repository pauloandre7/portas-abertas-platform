import { Entity } from 'typeorm';
import { Pessoa } from './pessoa.models.js'

@Entity()
export class Admin extends Pessoa {
    
}