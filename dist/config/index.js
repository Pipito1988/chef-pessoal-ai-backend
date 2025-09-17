"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_minimum_256_bits_chef_pessoal_ai_2024',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    databaseUrl: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/chef_pessoal_ai',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    saltRounds: 12,
};
if (!process.env.JWT_SECRET && exports.config.nodeEnv === 'production') {
    throw new Error('JWT_SECRET deve ser definido em produção');
}
if (!process.env.DATABASE_URL && exports.config.nodeEnv === 'production') {
    throw new Error('DATABASE_URL deve ser definido em produção');
}
//# sourceMappingURL=index.js.map