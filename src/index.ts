import express from 'express';
import { AuthHandler } from './handlers/auth.handlers.js';
import { AuthRoutes } from './routes/auth.routes.js';
import { AuthService } from './services/auth.services.js';
import type { IAdminRepository } from './repositories/iadmin.repositories.js';
import { JwtTokenProvider } from './utils/jwt-token-provider.js';
import { Admin } from './models/admin.models.js';

// constante do express para gerenciar as rotas abaixo
const app = express();

// atribui, na constante, o middleware pra resolver jsons
app.use(express.json());

// Stub apenas pro método findByEmail
const adminRepository: IAdminRepository = {
	create: async () => {
		throw new Error('TODO: implementar repositório de Admin');
	},
	delete: async () => {
		throw new Error('TODO: implementar repositório de Admin');
	},
	update: async () => {
		throw new Error('TODO: implementar repositório de Admin');
	},
	findById: async () => {
		throw new Error('TODO: implementar repositório de Admin');
	},
	findAll: async () => {
		throw new Error('TODO: implementar repositório de Admin');
	},
	findByEmail: async () => {
		return new Admin("Admin", "52998224725", "admin@gmail.com", 
				"admin", 1n, "UU1212", undefined);
	}
};

// Instanciação e injeção de dependências
const tokenProvider = new JwtTokenProvider();
const authService = new AuthService(adminRepository, tokenProvider);
const authHandler = new AuthHandler(authService);
const authRouter = express.Router();

// No construtor dessa Routes tem o incializador, que vai pegar esse objeto
// e atribuir o edpoint nele.
new AuthRoutes(authRouter, authHandler);

// tudo que começar com /auth vai cair nesse conjunto de rotas
app.use('/auth', authRouter);

// esse endpoint apenas retorna um ok para verificar se está chegando requisição
app.get('/respirando', (_req, res) => {
	res.status(200).json({ status: 'ok' });
});

const port = Number(process.env.PORT ?? 3000);

// faz o servidor ficar olhando para a porta definida acima
app.listen(port, () => {
	console.log(`Servidor rodando em http://localhost:${port}`);
});
