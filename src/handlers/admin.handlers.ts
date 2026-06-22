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
}