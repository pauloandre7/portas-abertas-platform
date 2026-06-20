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
| GET | `/instituicao/uuid/:uuid` | Pública | Buscar instituição por UUID |
| GET | `/instituicoes/nome/:nome` | Pública | Buscar instituições por nome |
| GET | `/respirando` | Pública | Health check da API |

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

## 6. GET /instituicao/uuid/:uuid

### Autenticação

Essa rota é pública e não exige token JWT.

### Parâmetros de rota

- `uuid`: string na URL

Exemplo:

```http
GET /instituicao/uuid/3dd0f2d7-2d1e-4d9a-a1f1-9d9f4d7c1a11
```

### Body esperado

Não há body.

### Resposta de sucesso

Status: `200 OK`

O backend retorna um objeto com a chave `response` contendo um `InstituicaoRequest`:

- `response.uuid`: string
- `response.nome`: string
- `response.cnpj`: string
- `response.descricao`: string
- `response.status`: string
- `response.servicos`: string[]
- `response.contato`: objeto `ContatoDto`
- `response.endereco`: objeto `EnderecoDto`

Exemplo:

```json
{
  "response": {
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
}
```

### Respostas de erro observadas no código

- `400 Bad Request` com `{ "error": "É necessário informar o uuid pelo path." }` quando o parâmetro não vier na URL
- `400 Bad Request` com `{ "error": "Instituição não encontrada." }` quando não existir instituição para o UUID informado

## 7. GET /instituicoes/nome/:nome

### Autenticação

Essa rota é pública e não exige token JWT.

### Parâmetros de rota

- `nome`: string na URL

Exemplo:

```http
GET /instituicoes/nome/instituto
```

### Body esperado

Não há body.

### Resposta de sucesso

Status: `200 OK`

O backend retorna um objeto com a chave `response` contendo um array de `InstituicaoRequest`:

- `response[].uuid`: string
- `response[].nome`: string
- `response[].cnpj`: string
- `response[].descricao`: string
- `response[].status`: string
- `response[].servicos`: string[]
- `response[].contato`: objeto `ContatoDto`
- `response[].endereco`: objeto `EnderecoDto`

Exemplo:

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

### Respostas de erro observadas no código

- `400 Bad Request` com `{ "error": "É necessário informar o nome pelo path." }` quando o parâmetro não vier na URL
- `400 Bad Request` com `{ "error": "Não foi encontrada nenhuma instituição com esse nome." }` quando não houver correspondência

## Observações para o front-end

- Enviar `Authorization: Bearer <token>` em todas as rotas de instituição.
- Tratar `POST /auth/login` como a origem do token JWT.
- No cadastro de instituição, enviar todos os campos obrigatórios da estrutura aninhada de contato e endereço.
- Na atualização de instituição, considerar que o backend aceita atualização parcial, desde que `uuid` seja enviado.
- Para consulta pública por UUID, ler a instituição dentro da chave `response`.
- Para busca pública por nome, ler a lista de instituições dentro da chave `response`; a busca retorna nomes que começam com o valor informado e não diferencia maiúsculas/minúsculas.
- O campo `status` deve respeitar os valores `ativo`, `inativo` ou `pendente`.
- O payload de `endereco.numero` chega como número no JSON, embora o model interno use `bigint`.
