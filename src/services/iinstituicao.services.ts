import type { InstituicaoCreateRequest } from "../dtos/instituicao-create-request.dtos.js";
import type { InstituicaoDeleteRequest } from "../dtos/instituicao-delete-request.dtos.js";
import type { InstituicaoRequest } from "../dtos/instituicao-request.dtos.js";

export interface IInstituicaoService {

    cadastrarInstituicao(cadastrarRequest: InstituicaoCreateRequest): Promise<InstituicaoRequest>;
    // Dá pra usar esse modificar para trocar status também
    modificarInstituicao(updateRequest: InstituicaoRequest): Promise<InstituicaoRequest>;
    excluirInstituicao(deleteRequest: InstituicaoDeleteRequest): Promise<boolean>;
    listarTodasInstituicoes(): Promise<InstituicaoRequest[]>;
    listarPorServicos(servicos: string[]) : Promise<InstituicaoRequest[]>;
    listarPorLocalizacao(cidade: string): Promise<InstituicaoRequest[]>;
    buscarPorNome(nome: string): Promise<InstituicaoRequest>;
}