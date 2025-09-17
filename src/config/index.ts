import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_minimum_256_bits_chef_pessoal_ai_2024',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  
  // Database
  databaseUrl: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/chef_pessoal_ai',
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(url => url.trim())
    : ['http://localhost:5173', 'http://localhost:5174', 'https://chefeai.netlify.app'],
  
  // Bcrypt
  saltRounds: 12,
};

// Validar configurações críticas
if (!process.env.JWT_SECRET && config.nodeEnv === 'production') {
  throw new Error('JWT_SECRET deve ser definido em produção');
}

if (!process.env.DATABASE_URL && config.nodeEnv === 'production') {
  throw new Error('DATABASE_URL deve ser definido em produção');
}
