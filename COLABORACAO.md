## Como executar o projeto localmente

Para rodar o projeto na sua máquina, certifique-se de ter o [Node.js](https://nodejs.org/), o [Git](https://git-scm.com/) e o [Docker](https://www.docker.com/) instalados. Em seguida, siga o passo a passo abaixo:

**1. Clone o repositório**<br>
Abra o terminal na pasta onde deseja baixar o projeto e rode:
```bash
git clone https://github.com/pauloandre7/portas-abertas-platform.git
cd portas-abertas-platform
```

**2. Instale as dependências**<br>
Baixe todos os pacotes necessários do Node executando:
```bash
npm install
```

**3. Configure as variáveis de ambiente**<br>
Na raiz do projeto, crie um arquivo chamado `.env`. Certifique-se de preencher as variáveis do banco de dados e habilitar o modo de desenvolvimento para o banco sincronizar automaticamente:
```env
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5433
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=portas_abertas_db
```

**4. Suba o Banco de Dados (Docker)**<br>
Com o Docker aberto na sua máquina, rode o comando abaixo para iniciar o container do PostgreSQL e do pgAdmin em segundo plano:
```bash
docker compose up -d
```

**EXTRA: Para limpar o banco de dados e iniciar um novo do zero**<br>
Caso queira limpar o banco de dados salvo na sua máquina e iniciar um novo com o docker compose up, basta usar:
```bash
docker compose down -v
```
O comando acima irá apagar os containers e os dados que foram salvos no seu computador.
<br><br>

**5. Semeie o Banco de Dados**<br>
Com o banco rodando, precisamos criar as tabelas e inserir os dados iniciais de teste (como os administradores). Para isso, execute:
```bash
npm run seed
```

**6. Inicie o Servidor**<br>
Agora basta rodar a aplicação em modo de desenvolvimento:
```bash
npm run dev
```
O servidor estará rodando e pronto para receber requisições em http://localhost:3000! 🎉
