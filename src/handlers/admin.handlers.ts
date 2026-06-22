import type { IAdminService } from "../services/iadmin.services.js";
import type { AdminCreateRequest } from "../dtos/admin-create.dtos.js";
import type { AdminRequest } from "../dtos/admin-request.dtos.js";

export class AdminHandler {

    constructor(
        public readonly service: IAdminService
    ){}

    public cadastrar(req: any, res: any): void {
        // Tipar com AdminCreateRequest garante a estrutura que vem do body
        const request: AdminCreateRequest = req.body;

        this.service.create(request)
            .then((response: AdminRequest) => {
                
                res.status(201).json(response);
            })
            .catch(error => {

                res.status(400).json({
                    error: error.message
                });
            });
    }

    public atualizar(req: any, res: any): void {
        const { uuid } = req.params;

        if (!uuid) {
            res.status(400).json({ error: "Identificador UUID é obrigatório para atualizar o administrador." });
            return;
        }

        const request: AdminRequest = req.body;
        request.uuid = uuid;

        this.service.update(request)
            .then((response: AdminRequest) => {
                res.status(200).json(response);
            })
            .catch(error => {
                res.status(400).json({
                    error: error.message
                });
            });
    }

    public buscarPorUuid(req: any, res: any): void {
        const { uuid } = req.params;

        if (!uuid) {
            res.status(400).json({ error: "Identificador UUID é obrigatório para buscar o administrador." });
            return;
        }

        this.service.buscarPorUuid(uuid)
            .then((response: AdminRequest) => {
                res.status(200).json(response);
            })
            .catch(error => {
                res.status(400).json({
                    error: error.message
                });
            });
    }

    public deletar(req: any, res: any): void {
        const { uuid } = req.params;

        this.service.delete(uuid)
            .then((sucesso: boolean) => {
                if (sucesso) {
                    // status 204 indica sucesso sem corpo de resposta
                    res.status(204).send();
                } else {
                    res.status(400).json({ error: "Não foi possível deletar o administrador." });
                }
            })
            .catch(error => {
                res.status(400).json({
                    error: error.message
                });
            });
    }

    public listarTodos(req: any, res: any): void {
        this.service.listarTodos()
            .then((response: AdminRequest[]) => {
                // Retorna 200 OK com a lista de administradores formatada pelo DTO
                res.status(200).json(response);
            })
            .catch(error => {
                res.status(400).json({
                    error: error.message
                });
            });
    }
}