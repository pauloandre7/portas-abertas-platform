import type { InstituicaoCreateRequest } from "../dtos/instituicao-create-request.dtos.js";
import { InstituicaoRequest } from "../dtos/instituicao-request.dtos.js";
import { Instituicao } from "../models/instituicao.model.js";
import type { IInstituicaoRepository } from "../repositories/iinstituicao.repositories.js";
import type { IInstituicaoService } from "./iinstituicao.services.js";
import { UuidProvider } from "../utils/uuid-provider.utils.js";
import { cnpj as cnpjValidator } from "cpf-cnpj-validator";

export class InstituicaoService implements IInstituicaoService {

    constructor(
        public repository: IInstituicaoRepository
    ){ }

    private validaCnpj(cnpj : string ): string{
        if (cnpj !== undefined && cnpj !== null && cnpj.trim() !== "") {
                if (!cnpjValidator.isValid(cnpj)) {
                    throw new Error(`Não é possível criar Instituicao: CNPJ inválido (${cnpj})`);
                }
                // Salva no banco apenas os números
                return cnpjValidator.strip(cnpj);
            } else {
                throw new Error(`Não é possível criar Instituicao: CNPJ inválido (${cnpj})`);
            }
    }

    async cadastrarInstituicao(cadastrarRequest: InstituicaoCreateRequest): Promise<InstituicaoRequest> {
        const instituicao = new Instituicao(
            cadastrarRequest.nome,
            cadastrarRequest.servicos,
            cadastrarRequest.contato as any,
            cadastrarRequest.endereco as any,
            this.validaCnpj(cadastrarRequest.cnpj),
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

        // só valida o cpf se tiver algo nele, senão usa o que já estava no banco mesmo.
        if( !(!updateRequest.cnpj || updateRequest.cnpj == "")) {
            instituicaoOriginal.cnpj = this.validaCnpj(updateRequest.cnpj) ?? instituicaoOriginal.cnpj;
        }


        const atualizou = await this.repository.update(instituicaoOriginal);

        if (!atualizou) {
            throw new Error("Falha ao salvar as alterações da Instituição.");
        }

        if(instituicaoOriginal.uuid == undefined){
            throw new Error("Falha ao encontrar instituicao na base de dados.");
        }

        return new InstituicaoRequest(
            instituicaoOriginal.uuid, 
            instituicaoOriginal.nome,
            instituicaoOriginal.cnpj!, 
            instituicaoOriginal.descricao!,
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

    async listarTodasInstituicoes(apenasAtivos: boolean): Promise<InstituicaoRequest[]> {

        const instituicoes = await this.repository.findAll();

        if (!instituicoes || instituicoes.length === 0) {
            throw new Error("Nenhuma instituição foi encontrada");
        }

        

        if(apenasAtivos) {

            /* 
            // O filter mapeia todo o array, retorna cada objeto em i e monta um novo array
            // aplicando o filtro definido depois da arrow function.
            // O map mapeia o array, retorna cada objeto ali no "i" e manda para a arrow func
            // como parâmetro para fazer os novos objetos no construtor de InstituicaoRequest
            // */
            return instituicoes.filter(i => i.status === "ativo")
                .map(i => new InstituicaoRequest(
                    i.uuid!, i.nome!, i.cnpj!, i.descricao!, 
                    i.status!, i.servicos!, i.contato!, i.endereco!
                ));
        } else {
            return instituicoes.map(i => new InstituicaoRequest(
                    i.uuid!, i.nome!, i.cnpj!, i.descricao!, 
                    i.status!, i.servicos!, i.contato!, i.endereco!
                ));
        }
    }
    
    async listarPorServicos( apenasAtivos: boolean, servicos: string[]
    ): Promise<InstituicaoRequest[]> {

        const instituicoes =
            await this.repository.findByServicos(servicos);

        if (!instituicoes || instituicoes.length === 0) {
            return [];
        }

        if(apenasAtivos) {

            return instituicoes.filter(i => i.status === "ativo")
                .map(i => new InstituicaoRequest(
                    i.uuid!, i.nome!, i.cnpj!, i.descricao!, 
                    i.status!, i.servicos!, i.contato!, i.endereco!
                ));
        } else {
            return instituicoes.map(i => new InstituicaoRequest(
                    i.uuid!, i.nome!, i.cnpj!, i.descricao!, 
                    i.status!, i.servicos!, i.contato!, i.endereco!
                ));
        }
    }

    async listarPorLocalizacao(
        apenasAtivos: boolean,
        cidade: string
    ): Promise<InstituicaoRequest[]> {

        const instituicoes =
            await this.repository.findByCidade(cidade);

        if (!instituicoes || instituicoes.length === 0) {
            return [];
        }

        if(apenasAtivos) {

            return instituicoes.filter(i => i.status === "ativo")
                .map(i => new InstituicaoRequest(
                    i.uuid!, i.nome!, i.cnpj!, i.descricao!, 
                    i.status!, i.servicos!, i.contato!, i.endereco!
                ));
        } else {
            return instituicoes.map(i => new InstituicaoRequest(
                    i.uuid!, i.nome!, i.cnpj!, i.descricao!, 
                    i.status!, i.servicos!, i.contato!, i.endereco!
                ));
        }
    }

    async listarPorCidadeEServico(
        apenasAtivos: boolean,
        cidade: string,
        servico: string
    ): Promise<InstituicaoRequest[]> {

        const instituicoes =
            await this.repository.findByCidadeEServico(
                cidade,
                servico
            );

        if (!instituicoes || instituicoes.length === 0) {
            return [];
        }

        if(apenasAtivos) {

            return instituicoes.filter(i => i.status === "ativo")
                .map(i => new InstituicaoRequest(
                    i.uuid!, i.nome!, i.cnpj!, i.descricao!, 
                    i.status!, i.servicos!, i.contato!, i.endereco!
                ));
        } else {
            return instituicoes.map(i => new InstituicaoRequest(
                    i.uuid!, i.nome!, i.cnpj!, i.descricao!, 
                    i.status!, i.servicos!, i.contato!, i.endereco!
                ));
        }
    }

    async buscarPorNome(apenasAtivos: boolean, nome: string): Promise<InstituicaoRequest[]> {
        const instituicoes: Instituicao[] | null = await this.repository.findByNome(nome);

        if(!instituicoes || instituicoes.length === 0) {
            throw new Error("Não foi encontrada nenhuma instituição com esse nome.");
        }

        if(apenasAtivos) {

            return instituicoes.filter(i => i.status === "ativo")
                .map(i => new InstituicaoRequest(
                    i.uuid!, i.nome!, i.cnpj!, i.descricao!, 
                    i.status!, i.servicos!, i.contato!, i.endereco!
                ));
        } else {
            return instituicoes.map(i => new InstituicaoRequest(
                    i.uuid!, i.nome!, i.cnpj!, i.descricao!, 
                    i.status!, i.servicos!, i.contato!, i.endereco!
                ));
        }
    }

    async buscaPorUuid(apenasAtivos: boolean, uuid: string): Promise<InstituicaoRequest> {
        
        const instituicao: Instituicao | null = await this.repository.findByUuid(uuid);

        if(apenasAtivos && !(instituicao?.status === "ativo")) {
            throw new Error("Nenhuma instituição encontrada");
        }

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