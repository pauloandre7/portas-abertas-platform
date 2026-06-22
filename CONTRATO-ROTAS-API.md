# Contrato das rotas da API

Documento descritivo das rotas disponíveis no estado atual do projeto, com foco no que o front-end precisa enviar no body, quais parâmetros de rota existem e qual formato de resposta esperar.

## Visão geral

- Base da aplicação: `src/index.ts`
- A rota de autenticação é montada em `/auth`
- As rotas de instituição são montadas na raiz (`/`)
- Existe também a rota de saúde `/respirando`
- As rotas de instituição protegidas usam `authMiddleware`, então exigem header `Authorization: Bearer <token>`; as consultas por UUID e nome são públicas

## Rotas disponíveis

| Método | Rota | Proteção | Finalidade |
| --- | --- | --- | --- |
| POST | `/auth/login` | Pública | Autenticar usuário administrador e gerar token |
| POST | `/instituicao` | Protegida | Cadastrar instituição |
| PUT | `/instituicao` | Protegida | Atualizar instituição existente |
| DELETE | `/instituicao/:uuid` | Protegida | Excluir instituição |
| GET | `/respirando` | Pública | Health check da API |
| GET | `/instituicao/uuid/:uuid` | Pública | Buscar instituição por UUID (apenas ativas) |
| GET | `/instituicoes/nome/:nome` | Pública | Buscar instituições por nome (apenas ativas) |
| GET | `/instituicoes` | Pública | Listar todas as ativas ou filtrar por serviço (Query Param) |
| GET | `/instituicoes/cidade/:cidade` | Pública | Buscar instituições ativas por cidade |
| GET | `/instituicoes/filtro` | Pública | Buscar instituições ativas cruzando cidade e serviço |
| GET | `/admin/instituicoes` | Protegida| Listar todas as instituições (ignora status) ou filtrar por serviço |
| GET | `/admin/instituicao/uuid/:uuid` | Protegida| Buscar instituição por UUID (ignora status) |
| GET | `/admin/instituicoes/nome/:nome` | Protegida| Buscar instituições por nome (ignora status) |
| GET | `/admin/instituicoes/cidade/:cidade` | Protegida| Buscar instituições por cidade (ignora status) |
| GET | `/admin/instituicoes/filtro` | Protegida| Buscar instituições cruzando cidade e serviço (ignora status) |

## 1. POST /auth/login

### Body esperado

O front-end deve enviar um JSON com:

- `email`: string
- `senha`: string

Exemplo:

```json
{
  "email": "admin@exemplo.com",
  "senha": "123456"
}
```

### Resposta de sucesso

Status: `200 OK`

O backend retorna um objeto compatível com `LoginResponse`:

- `nome`: string
- `cpf`: string
- `email`: string
- `token`: string
- `id`: string opcional
- `uuid`: string opcional
- `endereco`: objeto opcional com os campos do endereço

Exemplo:

```json
{
  "nome": "Administrador",
  "cpf": "12345678901",
  "email": "admin@exemplo.com",
  "token": "jwt-gerado-aqui",
  "id": "1",
  "uuid": "8dcb2e75-0b0c-4a8c-9c4e-123456789abc",
  "endereco": {
    "logradouro": "Rua Central",
    "bairro": "Centro",
    "numero": 123,
    "cep": "80000000",
    "cidade": "Curitiba",
    "estado": "PR",
    "pais": "Brasil"
  }
}
```

### Respostas de erro observadas no código

- `400 Bad Request` com `{ "error": "Email e Senha são obrigatórios" }` quando faltar `email` ou `senha`
- `401 Unauthorized` com `{ "error": "Erro ao efetuar login" }` quando a autenticação falhar

## 2. POST /instituicao

### Autenticação

Essa rota exige token JWT no header:

```http
Authorization: Bearer <token>
```

### Body esperado

O body é baseado em `InstituicaoCreateRequest` e exige:

- `nome`: string
- `cnpj`: string
- `descricao`: string
- `status`: string do tipo `StatusInstituicao`
- `servicos`: array de strings
- `contato`: objeto `ContatoDto`
- `endereco`: objeto `EnderecoDto`

### Valores válidos para `status`

O enum atual aceita:

- `ativo`
- `inativo`
- `pendente`

### Estrutura de `contato`

- `telefone`: string
- `email`: string
- `instagram`: string opcional
- `facebook`: string opcional
- `site`: string opcional

### Estrutura de `endereco`

- `logradouro`: string
- `bairro`: string
- `numero`: bigint / number no JSON
- `cep`: string
- `cidade`: string
- `estado`: string
- `pais`: string

### Exemplo de body

```json
{
  "nome": "Instituto Exemplo",
  "cnpj": "12345678000199",
  "descricao": "Instituição voltada para atendimento e apoio social",
  "status": "ativo",
  "servicos": ["atendimento", "orientacao"],
  "contato": {
    "telefone": "41999990000",
    "email": "contato@exemplo.org",
    "instagram": "@institutoexemplo",
    "facebook": "institutoexemplo",
    "site": "https://exemplo.org"
  },
  "endereco": {
    "logradouro": "Rua das Flores",
    "bairro": "Centro",
    "numero": 100,
    "cep": "80010000",
    "cidade": "Curitiba",
    "estado": "PR",
    "pais": "Brasil"
  }
}
```

### Resposta de sucesso

Status: `201 Created`

O backend retorna um objeto compatível com `InstituicaoRequest`:

- `uuid`: string
- `nome`: string
- `cnpj`: string
- `descricao`: string
- `status`: string
- `servicos`: string[]
- `contato`: objeto `ContatoDto`
- `endereco`: objeto `EnderecoDto`

Exemplo:

```json
{
  "uuid": "3dd0f2d7-2d1e-4d9a-a1f1-9d9f4d7c1a11",
  "nome": "Instituto Exemplo",
  "cnpj": "12345678000199",
  "descricao": "Instituição voltada para atendimento e apoio social",
  "status": "ativo",
  "servicos": ["atendimento", "orientacao"],
  "contato": {
    "telefone": "41999990000",
    "email": "contato@exemplo.org",
    "instagram": "@institutoexemplo",
    "facebook": "institutoexemplo",
    "site": "https://exemplo.org"
  },
  "endereco": {
    "logradouro": "Rua das Flores",
    "bairro": "Centro",
    "numero": 100,
    "cep": "80010000",
    "cidade": "Curitiba",
    "estado": "PR",
    "pais": "Brasil"
  }
}
```

### Resposta de erro observada no código

- `400 Bad Request` com `{ "error": "<mensagem>" }` quando o service falha ao cadastrar

## 3. PUT /instituicao

### Autenticação

Essa rota exige token JWT no header:

```http
Authorization: Bearer <token>
```

### Body esperado

O handler faz a leitura de um `InstituicaoRequest`, mas o comportamento real é de atualização parcial:

- `uuid` é obrigatório
- os demais campos podem ser enviados para substituir os dados atuais
- campos omitidos ou nulos mantêm o valor anterior no banco

Campos possíveis:

- `uuid`: string obrigatória
- `nome`: string
- `cnpj`: string
- `descricao`: string
- `status`: string do tipo `StatusInstituicao`
- `servicos`: string[]
- `contato`: objeto `ContatoDto`
- `endereco`: objeto `EnderecoDto`

### Exemplo de body mínimo para alteração parcial

```json
{
  "uuid": "3dd0f2d7-2d1e-4d9a-a1f1-9d9f4d7c1a11",
  "descricao": "Nova descrição da instituição",
  "status": "pendente"
}
```

### Resposta de sucesso

Status: `200 OK`

Retorna o objeto atualizado no mesmo formato de `InstituicaoRequest`:

- `uuid`: string
- `nome`: string
- `cnpj`: string
- `descricao`: string
- `status`: string
- `servicos`: string[]
- `contato`: objeto
- `endereco`: objeto

### Respostas de erro observadas no código

- `400 Bad Request` com `{ "error": "Identificador UUID é obrigatório para essa operação" }` se `uuid` não vier no body
- `401 Unauthorized` com `{ "error": "Erro ao modificar informações da Instituição" }` quando a atualização falha no service

## 4. DELETE /instituicao/:uuid

### Autenticação

Essa rota exige token JWT no header:

```http
Authorization: Bearer <token>
```

### Parâmetros de rota

- `uuid`: string na URL

Exemplo:

```http
DELETE /instituicao/3dd0f2d7-2d1e-4d9a-a1f1-9d9f4d7c1a11
```

### Body esperado

Não há body obrigatório. A exclusão usa apenas o `uuid` da rota.

### Resposta de sucesso

Status: `200 OK`

```json
{
  "mensagem": "Instituição excluída com sucesso."
}
```

### Respostas de erro observadas no código

- `400 Bad Request` com `{ "error": "Instituição não encontrada." }` se o UUID não existir
- `400 Bad Request` com `{ "error": "<mensagem>" }` quando o service falha na exclusão

## 5. GET /respirando

### Finalidade

Endpoint simples de health check da API.

### Resposta

Status: `200 OK`

```json
{
  "status": "ok"
}
```
## 6. GET /instituicao/uuid/:uuid e GET /admin/instituicao/uuid/:uuid

### Autenticação
- Rota sem `/admin/`: Pública (Não exige token).
- Rota com `/admin/`: Protegida (Exige token JWT no header).

### Parâmetros de rota
- `uuid`: string na URL

### Resposta de sucesso
Status: `200 OK`
O backend retorna um objeto com a chave `response` contendo um `InstituicaoRequest`.
*(Atenção front-end: Os dados estão dentro da propriedade `response`)*.

```json
{
  "response": [
    {
      "uuid": "3dd0f2d7-2d1e-4d9a-a1f1-9d9f4d7c1a11",
      "nome": "Instituto Exemplo",
      "cnpj": "12345678000199",
      "descricao": "Instituição voltada para atendimento e apoio social",
      "status": "ativo",
      "servicos": ["atendimento", "orientacao"],
      "contato": {
        "telefone": "41999990000",
        "email": "contato@exemplo.org",
        "instagram": "@institutoexemplo",
        "facebook": "institutoexemplo",
        "site": "https://exemplo.org"
      },
      "endereco": {
        "logradouro": "Rua das Flores",
        "bairro": "Centro",
        "numero": 100,
        "cep": "80010000",
        "cidade": "Curitiba",
        "estado": "PR",
        "pais": "Brasil"
      }
    }
  ]
}
```
## 7. GET /instituicoes/nome/:nome e GET /admin/instituicoes/nome/:nome

### Autenticação
- Rota sem `/admin/`: Pública (Não exige token).
- Rota com `/admin/`: Protegida (Exige token JWT no header).

### Parâmetros de rota
- `nome`: string na URL

### Resposta de sucesso
Status: `200 OK`
O backend retorna um objeto com a chave `response` contendo um array de `InstituicaoRequest`.
*(Atenção front-end: Os dados estão dentro da propriedade `response`)*.

```json
{
  "response": [
    {
      "uuid": "3dd0f2d7-2d1e-4d9a-a1f1-9d9f4d7c1a11",
      "nome": "Instituto Exemplo",
      "cnpj": "12345678000199",
      "descricao": "Instituição voltada para atendimento e apoio social",
      "status": "ativo",
      "servicos": ["atendimento", "orientacao"],
      "contato": {
        "telefone": "41999990000",
        "email": "contato@exemplo.org",
        "instagram": "@institutoexemplo",
        "facebook": "institutoexemplo",
        "site": "[https://exemplo.org](https://exemplo.org)"
      },
      "endereco": {
        "logradouro": "Rua das Flores",
        "bairro": "Centro",
        "numero": 100,
        "cep": "80010000",
        "cidade": "Curitiba",
        "estado": "PR",
        "pais": "Brasil"
      }
    }
  ]
}
```

## 8. GET /instituicoes e GET /admin/instituicoes

### Autenticação
- Rota sem `/admin/`: Pública (Não exige token).
- Rota com `/admin/`: Protegida (Exige token JWT no header).

### Parâmetros de Query (Query Params)
Esta rota possui comportamento duplo determinado pela URL:
- **Listar Todas:** `GET /instituicoes` (Sem parâmetros, retorna todas as instituições).
- **Filtrar por Serviços:** `GET /instituicoes?servico=psicologia`
  - *(Dica para o Front-end: Para enviar múltiplos serviços, repita o parâmetro. Ex: `?servico=psicologia&servico=terapia`)*.

### Resposta de sucesso
Status: `200 OK`
Retorna o Array direto de `InstituicaoRequest`.
*(Atenção front-end: Diferente da busca por nome ou UUID, esta rota NÃO possui a chave encapsuladora `response`. O array vem direto no root).*

```json
[
  {
    "uuid": "3dd0f2d7-2d1e-4d9a-a1f1-9d9f4d7c1a11",
    "nome": "Instituto Exemplo",
    "cnpj": "12345678000199",
    "descricao": "Instituição voltada para atendimento e apoio social",
    "status": "ativo",
    "servicos": [
      "psicologia",
      "terapia"
    ],
    "contato": {
      "telefone": "41999990000",
      "email": "contato@exemplo.org",
      "instagram": "@institutoexemplo",
      "facebook": "institutoexemplo",
      "site": "[https://exemplo.org](https://exemplo.org)"
    },
    "endereco": {
      "logradouro": "Rua das Flores",
      "bairro": "Centro",
      "numero": 100,
      "cep": "80010000",
      "cidade": "Curitiba",
      "estado": "PR",
      "pais": "Brasil"
    }
  }
]
```

## 9. GET /instituicoes/cidade/:cidade e GET /admin/instituicoes/cidade/:cidade

### Autenticação
- Rota sem `/admin/`: Pública (Não exige token).
- Rota com `/admin/`: Protegida (Exige token JWT no header).

### Parâmetros de rota
- `cidade`: string na URL (Ex: `/instituicoes/cidade/Curitiba`)

### Resposta de sucesso
Status: `200 OK`
Retorna o Array direto de `InstituicaoRequest` pertencentes àquela cidade.
*(Atenção front-end: Esta rota NÃO possui a chave encapsuladora `response`. O array vem direto no root).*

```json
[
  {
    "uuid": "3dd0f2d7-2d1e-4d9a-a1f1-9d9f4d7c1a11",
    "nome": "Instituto Curitiba",
    "cnpj": "12345678000199",
    "descricao": "Instituição voltada para atendimento e apoio social",
    "status": "ativo",
    "servicos": [
      "atendimento",
      "orientacao"
    ],
    "contato": {
      "telefone": "41999990000",
      "email": "contato@exemplo.org",
      "instagram": "@institutoexemplo",
      "facebook": "institutoexemplo",
      "site": "[https://exemplo.org](https://exemplo.org)"
    },
    "endereco": {
      "logradouro": "Rua das Flores",
      "bairro": "Centro",
      "numero": 100,
      "cep": "80010000",
      "cidade": "Curitiba",
      "estado": "PR",
      "pais": "Brasil"
    }
  }
]
```

## 10. GET /instituicoes/filtro e GET /admin/instituicoes/filtro

### Autenticação
- Rota sem `/admin/`: Pública (Não exige token).
- Rota com `/admin/`: Protegida (Exige token JWT no header).

### Parâmetros de Query Obrigatórios
O front-end deve enviar `cidade` e `servico` na URL.
- Exemplo: `GET /instituicoes/filtro?cidade=Curitiba&servico=psicologia`

### Resposta de sucesso
Status: `200 OK`
Retorna o Array direto de `InstituicaoRequest` correspondentes ao cruzamento da cidade com o serviço desejado.
*(Atenção front-end: Esta rota NÃO possui a chave encapsuladora `response`. O array vem direto no root).*

```json
[
  {
    "uuid": "3dd0f2d7-2d1e-4d9a-a1f1-9d9f4d7c1a11",
    "nome": "Instituto Curitiba",
    "cnpj": "12345678000199",
    "descricao": "Instituição voltada para atendimento e apoio social",
    "status": "ativo",
    "servicos": [
      "psicologia"
    ],
    "contato": {
      "telefone": "41999990000",
      "email": "contato@exemplo.org",
      "instagram": "@institutoexemplo",
      "facebook": "institutoexemplo",
      "site": "[https://exemplo.org](https://exemplo.org)"
    },
    "endereco": {
      "logradouro": "Rua das Flores",
      "bairro": "Centro",
      "numero": 100,
      "cep": "80010000",
      "cidade": "Curitiba",
      "estado": "PR",
      "pais": "Brasil"
    }
  }
]
```

### Respostas de erro observadas no código

- `400 Bad Request` com `{ "error": "É necessário informar o nome pelo path." }` quando o parâmetro não vier na URL
- `400 Bad Request` com `{ "error": "Não foi encontrada nenhuma instituição com esse nome." }` quando não houver correspondência

## Observações para o front-end

- Enviar `Authorization: Bearer <token>` em todas as rotas de instituição.
- Tratar `POST /auth/login` como a origem do token JWT.
- Nas rotas sem o prefixo `/admin/`, as instituições inativas ou pendentes serão silenciosamente omitidas dos resultados.
- No cadastro de instituição, enviar todos os campos obrigatórios da estrutura aninhada de contato e endereço.
- Na atualização de instituição, considerar que o backend aceita atualização parcial, desde que `uuid` seja enviado.
- Para consulta pública por UUID, ler a instituição dentro da chave `response`.
- Para busca pública por nome, ler a lista de instituições dentro da chave `response`; a busca retorna nomes que começam com o valor informado e não diferencia maiúsculas/minúsculas.
- O campo `status` deve respeitar os valores `ativo`, `inativo` ou `pendente`.
- O payload de `endereco.numero` chega como número no JSON, embora o model interno use `bigint`.
- Padrão de Retorno: As rotas que buscam por parâmetros de URL (`/uuid/:uuid` e `/nome/:nome`) retornam os dados encapsulados em `{ "response": dados }`. Já as rotas gerais (`/instituicoes`, `/cidade/:cidade` e  as de filtragem) retornam a coleção JSON ([ ... ]) diretamente no root da resposta.
