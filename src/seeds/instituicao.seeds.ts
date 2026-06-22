import type { DataSource} from "typeorm";
import type { BaseSeed } from "./iseedBase.seeds.js";
import type { InstituicaoRepository } from "../repositories/instituicao.repositories.js";
import { Endereco } from "../models/endereco.model.js";
import { Instituicao } from "../models/instituicao.model.js";
import { Contato } from "../models/contato.models.js";
import { UuidProvider } from "../utils/uuid-provider.utils.js";
import { Status} from '../models/instituicao-status-enum.models.js';

export class InstituicaoSeeder implements BaseSeed{

    private repository : InstituicaoRepository;

    constructor( instituicaoRespository : InstituicaoRepository){
        this.repository = instituicaoRespository;
    }

    async run(dataSource: DataSource): Promise<void> {
        console.log(">> Seed de Instituições iniciada.")

        // verifica a quantidade de instituições cadastradas
        const totalInstituicoes = await dataSource.getRepository(Instituicao).count();

        if (totalInstituicoes > 0) {
            console.log("  >> Seed ignorado: A tabela 'instituicao' já possui dados.");
            return;
        }

        this.repository.limparTabela();
        
        const endereco: Endereco = new Endereco(
            "Avenida Principal", "Centro", BigInt(123), 
            "86300000", "Cornélio Procópio", "PR", "Brasil"
        );
        const endereco2: Endereco = new Endereco(
            "Avenida Principal", "Centro", BigInt(321), 
            "86300000", "Londrina", "PR", "Brasil"
        );


        const contato: Contato = new Contato("40028922",
            "portas@email.com", undefined, undefined, undefined
        );


        const instituicao: Instituicao = new Instituicao(
            "Portas Abertas", ["Informação", "Suporte"],
            contato, endereco, "44555666000181", "Descrição Descritiva",
            Status.ATIVO, undefined, UuidProvider.gerarUuid()
        );
        const instituicao2: Instituicao = new Instituicao(
            "Psi. Luanna", ["Terapia", "Avaliação Clínica", "Informação"],
            contato, endereco, "12345678000195", "Descrição Descritiva",
            Status.ATIVO, undefined, UuidProvider.gerarUuid()
        );
        const instituicao3: Instituicao = new Instituicao(
            "Psi. Isabella", ["Terapia", "Avaliação Clínica", "Suporte de Desenvolvimento", "Informação"],
            contato, endereco2, "98765432000198", "Descrição Descritiva", 
            Status.PENDENTE, undefined, UuidProvider.gerarUuid()
        );

        if(await this.repository.create(instituicao)) console.log("\n>> Instituição 1 criada com sucesso.");
        if(await this.repository.create(instituicao2)) console.log("\n>> Instituição 2 criada com sucesso.");
        if(await this.repository.create(instituicao3)) console.log("\n>> Instituição 3 criada com sucesso.");

        console.log("Seed de instituições finalizada com sucesso!");

    }

}