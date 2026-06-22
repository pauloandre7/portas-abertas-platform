import type { Instituicao } from "../models/instituicao.model.js"

export interface IInstituicaoRepository {

    delete(uuid: string)                : Promise<boolean>;
    create(instituicao: Instituicao)    : Promise<boolean>;
    update(instituicao: Instituicao)    : Promise<boolean>;
    findById(id: bigint)                : Promise<Instituicao | null>;
    findByUuid(uuid: string)            : Promise<Instituicao | null>;
    findByNome(nome: string)            : Promise<Instituicao[] | null>;
    findAll()                           : Promise<Instituicao[] | null>;
    findByCidade(cidade : string)       : Promise<Instituicao[] | null>;
    findByServicos(servicos: string[])  : Promise<Instituicao[] | null>;
    findByCidadeEServico(cidade: string, servico: string): Promise<Instituicao[] | null>;
}