import type { InstituicaoCreateRequest } from "../dtos/instituicao-create-request.dtos.js";
import { InstituicaoRequest } from "../dtos/instituicao-request.dtos.js";
import { Instituicao } from "../models/instituicao.model.js";
import type { IInstituicaoRepository } from "../repositories/iinstituicao.repositories.js";
import type { IInstituicaoService } from "./iinstituicao.services.js";
import { UuidProvider } from "../utils/uuid-provider.utils.js";



export class InstituicaoService implements IInstituicaoService {

    constructor(
        public repository: IInstituicaoRepository
    ){ }

    async cadastrarInstituicao(cadastrarRequest: InstituicaoCreateRequest): Promise<InstituicaoRequest> {
        const instituicao = new Instituicao(
            cadastrarRequest.nome,
            cadastrarRequest.servicos,
            cadastrarRequest.contato as any,
            cadastrarRequest.endereco as any,
            cadastrarRequest.cnpj,
            cadastrarRequest.descricao,
            cadastrarRequest.status,
            undefined,
            UuidProvider.gerarUuid()
        );
        
        const salvou = await this.repository.create(instituicao);

        if (!salvou) {
            throw new Error("Não foi possível cadastrar a instituição.");
        }

        return new InstituicaoRequest(
            instituicao.uuid!,
            instituicao.nome!,
            instituicao.cnpj!,
            instituicao.descricao!,
            instituicao.status!,
            instituicao.servicos!,
            instituicao.contato!,
            instituicao.endereco!
        );
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
        instituicaoOriginal.status = updateRequest.status ?? instituicaoOriginal.status;
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
            instituicaoOriginal.status, 
            instituicaoOriginal.servicos,
            instituicaoOriginal.contato, 
            instituicaoOriginal.endereco
        );
    }

    async excluirInstituicao( uuid: string ): Promise<boolean> {

        const instituicao = await this.repository.findByUuid(uuid);

        if (!instituicao) {
            throw new Error("Instituição não encontrada.");
        }

        return await this.repository.delete(uuid);
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
    async buscarPorNome(nome: string): Promise<InstituicaoRequest[]> {
        const instituicoes: Instituicao[] | null = await this.repository.findByNome(nome);

        if(!instituicoes || instituicoes.length === 0) {
            throw new Error("Não foi encontrada nenhuma instituição com esse nome.");
        }

        let instituicoesResponse: InstituicaoRequest[] = [];

        instituicoes.forEach((instituicao, index) => {
            // O método forEach implementa um looping igual o for each do java.
            // A arrow function que defini vai receber a instituicao do loop no 
            // objeto instituicao. Aí basta utilizar no bloco de código da função

            if(!instituicao || instituicao.uuid == null || instituicao.nome == null
                || instituicao.cnpj == null || !instituicao.descricao || !instituicao.status
                || instituicao.servicos == null || instituicao.contato == null 
                || instituicao.endereco == null
            ) {
                throw new Error("Não foi encontrada nenhuma instituição com esse nome.");
            }

            instituicoesResponse.push(
                new InstituicaoRequest( instituicao.uuid, instituicao.nome, 
                    instituicao.cnpj, instituicao.descricao, instituicao.status, 
                    instituicao.servicos, instituicao.contato, instituicao.endereco
                )
            );
        });

        return instituicoesResponse;
    }

    async buscaPorUuid(uuid: string): Promise<InstituicaoRequest> {
        
        const instituicao: Instituicao | null = await this.repository.findByUuid(uuid);

        if(!instituicao || instituicao.uuid == null || instituicao.nome == null
            || instituicao.cnpj == null || !instituicao.descricao || !instituicao.status
            || instituicao.servicos == null || instituicao.contato == null 
            || instituicao.endereco == null
        ) {
            throw new Error("Instituição não encontrada.");
        }

        return new InstituicaoRequest( instituicao.uuid, instituicao.nome, 
            instituicao.cnpj, instituicao.descricao, instituicao.status, 
            instituicao.servicos, instituicao.contato, instituicao.endereco
        );

    }
}