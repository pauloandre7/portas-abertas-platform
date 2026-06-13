import { Column } from "typeorm";

export class Contato{

    @Column({type: "varchar"})
    public telefone: string;

    @Column({type: "varchar"})
    public email: string;
    
    @Column({type: "varchar"})
    public instagram?: string | undefined;

    @Column({type: "varchar"})
    public facebook?: string | undefined;

    @Column({type: "varchar"})
    public site?: string | undefined;

    constructor(
        telefone: string,
        email: string,
        instagram: string | undefined,
        facebook: string | undefined,
        site: string | undefined,
    ){

        this.telefone = telefone;
        this.email = email;
        this.instagram = instagram;
        this.facebook = facebook;
        this.site = site;
    }
}