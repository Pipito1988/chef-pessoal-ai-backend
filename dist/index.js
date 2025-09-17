"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = require("./config");
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const database_1 = __importDefault(require("./config/database"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use((0, cors_1.default)({
    origin: config_1.config.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
if (config_1.config.nodeEnv === 'development') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}
app.use('/api/v1', routes_1.default);
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
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
const startServer = async () => {
    try {
        await database_1.default.query('SELECT NOW()');
        console.log('✅ Conexão com a base de dados estabelecida');
        app.listen(config_1.config.port, () => {
            console.log(`🚀 Servidor a correr em http://localhost:${config_1.config.port}`);
            console.log(`📝 Ambiente: ${config_1.config.nodeEnv}`);
            console.log(`🌐 CORS configurado para: ${config_1.config.corsOrigin}`);
            console.log(`📊 Health check: http://localhost:${config_1.config.port}/api/v1/health`);
        });
    }
    catch (error) {
        console.error('❌ Erro ao iniciar o servidor:', error);
        process.exit(1);
    }
};
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});
process.on('SIGTERM', async () => {
    console.log('🔄 SIGTERM recebido, a encerrar servidor...');
    await database_1.default.end();
    process.exit(0);
});
process.on('SIGINT', async () => {
    console.log('🔄 SIGINT recebido, a encerrar servidor...');
    await database_1.default.end();
    process.exit(0);
});
startServer();
//# sourceMappingURL=index.js.map