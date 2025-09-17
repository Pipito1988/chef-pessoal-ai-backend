#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Chef Pessoal AI - Configuração do Backend\n');

// Criar arquivo .env se não existir
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Arquivo .env criado a partir do env.example');
  } else {
    // Criar .env com valores padrão
    const envContent = `# Configuração da Base de Dados
DATABASE_URL=postgresql://username:password@localhost:5432/chef_pessoal_ai

# Configuração JWT
JWT_SECRET=your_super_secret_jwt_key_here_minimum_256_bits_chef_pessoal_ai_2024
JWT_EXPIRES_IN=24h

# Configuração do Servidor
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173`;

    fs.writeFileSync(envPath, envContent);
    console.log('✅ Arquivo .env criado com configurações padrão');
  }
} else {
  console.log('ℹ️  Arquivo .env já existe');
}

console.log('\n📋 Próximos passos:');
console.log('1. Configurar PostgreSQL e criar a base de dados "chef_pessoal_ai"');
console.log('2. Editar o arquivo .env com as suas configurações de base de dados');
console.log('3. Executar: psql -d chef_pessoal_ai -f database/init.sql');
console.log('4. (Opcional) Executar: psql -d chef_pessoal_ai -f database/seed.sql');
console.log('5. Executar: npm run dev');

console.log('\n🔧 Comandos úteis:');
console.log('- npm run dev     # Iniciar em modo desenvolvimento');
console.log('- npm run build   # Compilar para produção');
console.log('- npm start       # Iniciar versão compilada');

console.log('\n📡 Endpoints disponíveis:');
console.log('- http://localhost:3001/api/v1/health');
console.log('- http://localhost:3001/api/v1/auth/signup');
console.log('- http://localhost:3001/api/v1/auth/login');
console.log('- http://localhost:3001/api/v1/household/data');

console.log('\n🧪 Dados de teste (após executar seed.sql):');
console.log('- Email: demo@chefpessoal.ai');
console.log('- Password: password');

console.log('\n✨ Backend configurado com sucesso!');
