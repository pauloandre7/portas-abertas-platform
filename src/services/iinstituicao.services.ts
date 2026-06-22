import type { InstituicaoCreateRequest } from "../dtos/instituicao-create-request.dtos.js";
import type { InstituicaoRequest } from "../dtos/instituicao-request.dtos.js";

export interface IInstituicaoService {

    cadastrarInstituicao(cadastrarRequest: InstituicaoCreateRequest): Promise<InstituicaoRequest>;
    // Dá pra usar esse modificar para trocar status também
    modificarInstituicao(updateRequest: InstituicaoRequest): Promise<InstituicaoRequest>;
    excluirInstituicao(uuid: string): Promise<boolean>;
    listarTodasInstituicoes(apenasAtivos: boolean): Promise<InstituicaoRequest[]>;
    listarPorServicos(apenasAtivos: boolean, servicos: string[]) : Promise<InstituicaoRequest[]>;
    listarPorLocalizacao(apenasAtivos: boolean, cidade: string): Promise<InstituicaoRequest[]>;
    buscarPorNome(apenasAtivos: boolean, nome: string): Promise<InstituicaoRequest[]>;
    buscaPorUuid(apenasAtivos: boolean, uuid: string) : Promise<InstituicaoRequest>;
    listarPorCidadeEServico(apenasAtivos: boolean, cidade: string, servico: string): Promise<InstituicaoRequest[]>;
}