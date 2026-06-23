import type { IAdminService } from "../services/iadmin.services.js";
import { AdminCreateRequest } from "../dtos/admin-create-request.dtos.js";
import { AdminUpdateRequest } from "../dtos/admin-update-request.dtos.js";

export class AdminHandler {

    constructor(
        public service: IAdminService
    ){}

    public listarTodos(req: any, res: any){
        this.service.listarTodos()
        .then(response => {
            res.status(200).json(response);
        }).catch(error => {
            res.status(400).json({ error: error.message });
        });
    }

    public cadastrar(req: any, res: any){
        const request: AdminCreateRequest = req.body;
        this.service.cadastrar(request)
        .then(response => {
            res.status(201).json(response);
        }).catch(error => {
            res.status(400).json({ error: error.message });
        });
    }

    public modificar(req: any, res: any){
        const request: AdminUpdateRequest = req.body;
        this.service.modificar(request)
        .then(response => {
            res.status(200).json(response);
        }).catch(error => {
            res.status(400).json({ error: error.message });
        });
    }

    public excluir(req: any, res: any){
        const uuid = String(req.params.uuid);
        this.service.excluir(uuid)
        .then(() => {
            res.status(200).json({ mensagem: "Administrador excluído com sucesso." });
        }).catch(error => {
            res.status(400).json({ error: error.message });
        });
    }
}
