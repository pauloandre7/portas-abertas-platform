import { response } from "express";
import { InstituicaoRequest } from "../dtos/instituicao-request.dtos.js";
import type { IInstituicaoService } from "../services/iinstituicao.services.js";

export class InstituicaoHandler {

    constructor(
        public service: IInstituicaoService
    ){}


    public modificar(req: any, res: any){
        
        const updateRequest : InstituicaoRequest = req.body;

        if(updateRequest.uuid == null){
            res.status(400).json({error: "Identificador UUID é obrigatório para essa operação"});

        } else {
            // Se o método retornar resultado, cai no .then() e realiza o parsing dessa response (que é a resposta do método) para um JSON
            // Se der erro, cai no .catch e retorna status 400
            this.service.modificarInstituicao(updateRequest)
            .then( (response : InstituicaoRequest ) => {
                res.status(200).json(response);

            }).catch( error => {
                res.status(401).json({error: "Erro ao modificar informações da Instituição"});
            })
        }
        
    }
}