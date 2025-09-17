import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Teste de conexão
pool.on('connect', () => {
  console.log('✅ Conectado à base de dados PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Erro na conexão com a base de dados:', err);
});

export default pool;
