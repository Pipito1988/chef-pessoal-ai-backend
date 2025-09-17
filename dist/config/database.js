"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
pool.on('connect', () => {
    console.log('✅ Conectado à base de dados PostgreSQL');
});
pool.on('error', (err) => {
    console.error('❌ Erro na conexão com a base de dados:', err);
});
exports.default = pool;
//# sourceMappingURL=database.js.map