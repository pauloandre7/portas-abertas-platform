# 🚪 Plataforma Portas Abertas

## 📖 Sobre o Projeto
O **Portas Abertas** é uma solução digital criada para centralizar, organizar e facilitar o acesso a informações sobre instituições e serviços voltados à neurodiversidade e pessoas com deficiência (PCDs). A plataforma atua como um catálogo confiável, reduzindo o tempo de busca das famílias por suporte especializado e ampliando a visibilidade dessas instituições parceiras.

Este projeto foi desenvolvido como parte da disciplina de Oficina de Integração 1 da Universidade Tecnológica Federal do Paraná (UTFPR).

## 🛠️ Tecnologias Utilizadas
- **Backend:** Node.js com TypeScript e Express
- **Banco de Dados:** PostgreSQL (via Docker)
- **ORM:** TypeORM
- **Outros:** Docker para conteinerização, JWT para autenticação, bcrypt para hash de senhas

## 🚀 Como Executar o Projeto

### Pré-requisitos
Certifique-se de ter instalado em sua máquina:
- [Docker](https://www.docker.com/) e Docker Compose

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/pauloandre7/portas-abertas-platform.git
   ```
2. **Crie um arquivo chamado .env na raiz do projeto.**<br>
  Copie o conteúdo do arquivo `.env-example` e cole dentro de um novo arquivo chamado `.env` (preenchendo com as senhas e portas desejadas).

2. **Rode o comando Docker Compose para construir a imagem e subir os containers:**
  ```bash
  docker compose up -d --build
  ```
A flag `-d` roda os containers em segundo plano. Se quiser ver os logs em tempo real, use apenas `docker compose up`

<br>

### Equipe
| Autor | Autora | Autor | Autora | Autor |
| :---: | :---: | :---: | :---: | :---: | 
| [<img loading="lazy" src="https://avatars.githubusercontent.com/u/147359503?v=4" width=115><br><sub>Paulo André Oliveira da Silva</sub>](https://github.com/pauloandre7) | [<img loading="lazy" src="https://avatars.githubusercontent.com/u/163479024?v=4" width=115><br><sub>Isabella Pires da Silva</sub>](https://github.com/isabellapires03) | [<img loading="lazy" src="https://avatars.githubusercontent.com/u/165838069?v=4" width=115><br><sub>Ricardo Lima</sub>](https://github.com/ricardoLima01) | [<img loading="lazy" src="assets/placeholder_perfil.png" width=115><br><sub>Luana Monteiro Ferreira</sub>]() | [<img loading="lazy" src="https://avatars.githubusercontent.com/u/238580858?v=4" width=115><br><sub>Wenio O. Silva</sub>](https://github.com/wenio-o-silva) |
