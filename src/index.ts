import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { config } from './config';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import pool from './config/database';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();

// Middlewares de segurança
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
  preflightContinue: false
}));

// Middlewares para parsing
app.use(express.json({ limit: '10mb' })); // Limite para app_state grandes
app.use(express.urlencoded({ extended: true }));

// Log de requests em desenvolvimento
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Rotas da API
app.use('/api/v1', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Chef Pessoal AI Backend API',
    version: '1.0.0',
    documentation: '/api/v1/health',
    endpoints: {
      auth: {
        signup: 'POST /api/v1/auth/signup',
        login: 'POST /api/v1/auth/login',
        verify: 'GET /api/v1/auth/verify',
      },
      household: {
        getData: 'GET /api/v1/household/data',
        updateData: 'PUT /api/v1/household/data',
        getMembers: 'GET /api/v1/household/members',
        invite: 'POST /api/v1/household/invite',
        removeMember: 'DELETE /api/v1/household/members/:userId',
      }
    }
  });
});

// Middleware de tratamento de rotas não encontradas
app.use(notFoundHandler);

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

// Função para inicializar o servidor
const startServer = async () => {
  try {
    // Testar conexão com a base de dados
    await pool.query('SELECT NOW()');
    console.log('✅ Conexão com a base de dados estabelecida');

    // Iniciar servidor
    app.listen(config.port, () => {
      console.log(`🚀 Servidor a correr em http://localhost:${config.port}`);
      console.log(`📝 Ambiente: ${config.nodeEnv}`);
      console.log(`🌐 CORS configurado para: ${config.corsOrigin}`);
      console.log(`📊 Health check: http://localhost:${config.port}/api/v1/health`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
};

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🔄 SIGTERM recebido, a encerrar servidor...');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔄 SIGINT recebido, a encerrar servidor...');
  await pool.end();
  process.exit(0);
});

// Iniciar servidor
startServer();
