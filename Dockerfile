# Usa uma imagem oficial do Node.js (versão 20 LTS, mais leve)
FROM node:20-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências primeiro
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código do projeto
COPY . .

# Faz o build do TypeScript (gera a pasta dist/)
RUN npm run build

# Expõe a porta que a aplicação vai rodar (opcional, mas boa prática)
EXPOSE 3000

# roda o seeder e o npm start (tem que remover o npm run seed em uso real)
CMD npm run seed && npm start