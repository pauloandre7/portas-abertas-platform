import { InstituicaoRequest } from "../dtos/instituicao-request.dtos.js";
import type { IInstituicaoService } from "../services/iinstituicao.services.js";
import { InstituicaoCreateRequest } from "../dtos/instituicao-create-request.dtos.js";

export class InstituicaoHandler {

    constructor(
        public service: IInstituicaoService
    ){}

    public cadastrar(req: any, res: any){

        const request : InstituicaoCreateRequest = req.body;

        this.service.cadastrarInstituicao(request)
        .then(response => {

            res.status(201).json(response);

        }).catch(error => {

            res.status(400).json({
                error: error.message
            });
        });
    }

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

    public excluir(req: any, res: any){

        const request = String(req.params.uuid).toString();

        this.service.excluirInstituicao(request)
        .then(() => {

            res.status(200).json({
                mensagem: "Instituição excluída com sucesso."
            });

        }).catch(error => {

            res.status(400).json({
                error: error.message
            });
        });
    }

    public instituicaoPorUuid(req: any, res: any, rotaPublica: boolean) {
        const { uuid } = req.params;

        if(!uuid){
            res.status(400).json({
                error: "É necessário informar o uuid pelo path."
            })
        } else {

            this.service.buscaPorUuid(rotaPublica, uuid)
            .then( (response : InstituicaoRequest) => {
                res.status(200).json({response})
            }).catch( error => {
                res.status(400).json({
                    error: error.message
                })
            })
        }
    }

    public instituicaoPorNome(req: any, res: any, rotaPublica: boolean){
        
        const { nome } = req.params;

        if( !nome ){
            res.status(400).json({
                error: "É necessário informar o nome pelo path."
            })
        } else {
            this.service.buscarPorNome(rotaPublica, nome)
            .then( (response : InstituicaoRequest[]) => {
                res.status(200).json({response})
            }).catch( error => {
                res.status(400).json({
                    error: error.message
                })
            })
        }
    }

    public listar(req: any, res: any, rotaPublica: boolean) {
        if (req.query.servico) {
            // Se tem filtro "servico", vai para o método de busca por serviço
            return this.listarPorServico(req, res, rotaPublica);
        }

        return this.listarTodas(req, res, rotaPublica);
    }

    public listarTodas(req: any, res: any, rotaPublica: boolean) {
        this.service.listarTodasInstituicoes(rotaPublica)
            .then(response => {

                res.status(200).json(response);

            }).catch(error => {

                res.status(400).json({
                    error: error.message
                });

            });
    }

    public listarPorServico(req: any, res: any, rotaPublica: boolean) {
        let servicosQuery = req.query.servico;
        let arrayDeServicos: string[] = [];

        // quando a URL tem múltiplos '?servico=', o Express já converte para Array nativamente.
        if (Array.isArray(servicosQuery)) {

            arrayDeServicos = servicosQuery as string[];
        } else if (typeof servicosQuery === 'string') {
            // entra nesse se tiver apenas uma string na query. Envelopa ela em um array de um elemento só
            arrayDeServicos = [servicosQuery];
        }

        this.service.listarPorServicos(rotaPublica, arrayDeServicos)
            .then(response => {

                res.status(200).json(response);

            }).catch(error => {

                res.status(400).json({
                    error: error.message
                });

            });
    }

    public listarPorCidade(req: any, res: any, rotaPublica: boolean) {
        const { cidade } = req.params;
        this.service.listarPorLocalizacao(rotaPublica, cidade)
            .then(response => {

                res.status(200).json(response);

            }).catch(error => {

                res.status(400).json({
                    error: error.message
                });

            });
    }

    public listarPorCidadeEServico( req: any, res: any, rotaPublica: boolean ) {

        const { cidade, servico } = req.query;

        this.service
            .listarPorCidadeEServico(
                rotaPublica,
                String(cidade),
                String(servico)
            )
            .then(response => {

                res.status(200).json(response);

            })
            .catch(error => {

                res.status(400).json({
                    error: error.message
                });

            });
    }

}