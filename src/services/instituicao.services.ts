import type { InstituicaoCreateRequest } from "../dtos/instituicao-create-request.dtos.js";
import type { InstituicaoDeleteRequest } from "../dtos/instituicao-delete-request.dtos.js";
import { InstituicaoRequest } from "../dtos/instituicao-request.dtos.js";
import { Endereco } from "../models/endereco.model.js";
import { Instituicao } from "../models/instituicao.model.js";
import type { IInstituicaoRepository } from "../repositories/iinstituicao.repositories.js";
import type { IInstituicaoService } from "./iinstituicao.services.js";


export class InstituicaoService implements IInstituicaoService {

    constructor(
        public repository: IInstituicaoRepository
    ){ }

    cadastrarInstituicao(cadastrarRequest: InstituicaoCreateRequest): Promise<InstituicaoRequest> {
        throw new Error("Sera implementado em outra feature.");
    }
    
    
    async modificarInstituicao(updateRequest: InstituicaoRequest): Promise<InstituicaoRequest> {
        
        if (!updateRequest.uuid) {
            throw new Error("Não é possível editar uma instituição vazia.");
        }

        const instituicaoOriginal = await this.repository.findByUuid(updateRequest.uuid);

        if (!instituicaoOriginal) {
            throw new Error("Não foi possível encontrar essa Instituição no Banco de Dados.");
        }

        // Mescla os dados originais com as alterações desejadas na request. Se tiver undefined ou 
        // null do front, o operador ?? vai utilizar o valor original ao invés do "nada"
        instituicaoOriginal.nome = updateRequest.nome ?? instituicaoOriginal.nome;
        instituicaoOriginal.descricao = updateRequest.descricao ?? instituicaoOriginal.descricao;
        instituicaoOriginal.servicos = updateRequest.servicos ?? instituicaoOriginal.servicos;
        instituicaoOriginal.contato = updateRequest.contato ?? instituicaoOriginal.contato;
        instituicaoOriginal.endereco = updateRequest.endereco ?? instituicaoOriginal.endereco;
        instituicaoOriginal.cnpj = updateRequest.cnpj ?? instituicaoOriginal.cnpj;


        const atualizou = await this.repository.update(instituicaoOriginal);

        if (!atualizou) {
            throw new Error("Falha ao salvar as alterações da Instituição.");
        }

        if(instituicaoOriginal.uuid == undefined){
            throw new Error("Falha ao salvar as alterações da Instituição.");
        }


        return new InstituicaoRequest(
            instituicaoOriginal.uuid, 
            instituicaoOriginal.nome,
            instituicaoOriginal.cnpj, 
            instituicaoOriginal.descricao, 
            instituicaoOriginal.servicos,
            instituicaoOriginal.contato, 
            instituicaoOriginal.endereco
        );
    }


    excluirInstituicao(deleteRequest: InstituicaoDeleteRequest): Promise<boolean> {
        throw new Error("Sera implementado em outra feature.");
    }
    listarTodasInstituicoes(): Promise<InstituicaoRequest[]> {
        throw new Error("Sera implementado em outra feature.");
    }
    listarPorServicos(servicos: string[]): Promise<InstituicaoRequest[]> {
        throw new Error("Sera implementado em outra feature.");
    }
    listarPorLocalizacao(cidade: string): Promise<InstituicaoRequest[]> {
        throw new Error("Sera implementado em outra feature.");
    }
    buscarPorNome(nome: string): Promise<InstituicaoRequest> {
        throw new Error("Sera implementado em outra feature.");
    }


}