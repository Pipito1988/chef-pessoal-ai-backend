# Chef Pessoal AI - Backend

Backend da aplicação Chef Pessoal AI desenvolvido em Node.js com TypeScript, Express e PostgreSQL.

## 🚀 Funcionalidades

- **Autenticação JWT**: Sistema completo de registo e login
- **Multi-utilizador**: Suporte para casas (households) partilhadas
- **Persistência**: Migração de localStorage para base de dados
- **API RESTful**: Endpoints bem estruturados e documentados
- **Segurança**: Middleware de segurança, validação e tratamento de erros

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- PostgreSQL (versão 12 ou superior)
- npm ou yarn

## ⚙️ Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Base de Dados

1. Criar uma base de dados PostgreSQL:
```sql
CREATE DATABASE chef_pessoal_ai;
```

2. Executar o script de inicialização:
```bash
psql -d chef_pessoal_ai -f database/init.sql
```

3. (Opcional) Inserir dados de teste:
```bash
psql -d chef_pessoal_ai -f database/seed.sql
```

### 3. Configurar Variáveis de Ambiente

Copiar o ficheiro de exemplo e configurar:
```bash
cp env.example .env
```

Editar o ficheiro `.env` com as suas configurações:
```env
# Base de Dados
DATABASE_URL=postgresql://username:password@localhost:5432/chef_pessoal_ai

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_minimum_256_bits
JWT_EXPIRES_IN=24h

# Servidor
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173
```

## 🏃‍♂️ Execução

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## 📡 Endpoints da API

### Autenticação (`/api/v1/auth`)

#### `POST /api/v1/auth/signup`
Registar novo utilizador.

**Request:**
```json
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "uma_password_forte"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@exemplo.com"
    },
    "household": {
      "id": "uuid",
      "name": "Casa de João Silva",
      "members": [...]
    }
  }
}
```

#### `POST /api/v1/auth/login`
Autenticar utilizador existente.

**Request:**
```json
{
  "email": "joao@exemplo.com",
  "password": "uma_password_forte"
}
```

**Response (200):** Igual ao signup.

#### `GET /api/v1/auth/verify`
Verificar validade do token.

**Headers:** `Authorization: Bearer <token>`

### Dados da Casa (`/api/v1/household`)

#### `GET /api/v1/household/data`
Obter estado completo da casa.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "profile": { ... },
    "inventory": [ ... ],
    "semana_atual": { ... },
    "lista_compras": { ... },
    "recipes": [ ... ],
    // ... outros campos do AppState
  }
}
```

#### `PUT /api/v1/household/data`
Atualizar estado da casa.

**Headers:** `Authorization: Bearer <token>`

**Request:** Objeto AppState completo

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "State updated successfully",
    "updated_at": "2024-01-10T14:30:00Z"
  }
}
```

### Gestão de Membros (`/api/v1/household`)

#### `GET /api/v1/household/members`
Listar membros da casa.

#### `POST /api/v1/household/invite`
Convidar utilizador para a casa.

**Request:**
```json
{
  "email": "esposa@exemplo.com"
}
```

#### `DELETE /api/v1/household/members/:userId`
Remover membro da casa.

## 🗄️ Estrutura da Base de Dados

### Tabela `users`
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela `households`
```sql
CREATE TABLE households (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    app_state JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela `household_members`
```sql
CREATE TABLE household_members (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    household_id UUID REFERENCES households(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('owner', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, household_id)
);
```

## 🧪 Testes

### Dados de Teste
Se executou o script `seed.sql`, pode usar estas credenciais:

- **Email:** `demo@chefpessoal.ai`
- **Password:** `password`

### Testar Endpoints

1. **Health Check:**
```bash
curl http://localhost:3001/api/v1/health
```

2. **Signup:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@exemplo.com","password":"12345678"}'
```

3. **Login:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@chefpessoal.ai","password":"password"}'
```

4. **Obter dados da casa:**
```bash
curl -X GET http://localhost:3001/api/v1/household/data \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🏗️ Arquitetura

```
backend/
├── src/
│   ├── config/          # Configurações (DB, JWT, etc.)
│   ├── controllers/     # Controladores da API
│   ├── middleware/      # Middleware (auth, validação, erros)
│   ├── models/          # Modelos da base de dados
│   ├── routes/          # Definição das rotas
│   ├── types/           # Tipos TypeScript
│   └── index.ts         # Ponto de entrada
├── database/            # Scripts SQL
└── README.md
```

## 🔒 Segurança

- Passwords encriptadas com bcrypt (12 rounds)
- JWT com expiração configurável
- Validação de entrada em todos os endpoints
- Middleware de segurança (helmet)
- CORS configurado
- Tratamento de erros sem exposição de dados sensíveis

## 🚀 Deployment

### Variáveis de Ambiente para Produção
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your_production_secret_key_minimum_256_bits
CORS_ORIGIN=https://yourdomain.com
```

### Docker (Opcional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

## 📝 Logs

O servidor regista automaticamente:
- Requests HTTP (desenvolvimento)
- Erros da aplicação
- Conexões da base de dados
- Eventos de startup/shutdown

## 🤝 Integração com Frontend

O backend foi desenhado para funcionar como uma camada de persistência para o frontend existente. As principais mudanças necessárias no frontend são:

1. Substituir `localStorage` por chamadas à API
2. Implementar autenticação real
3. Gerir tokens JWT
4. Tratar estados de loading/erro da rede

## 📞 Suporte

Para problemas ou dúvidas:
1. Verificar logs do servidor
2. Confirmar configuração da base de dados
3. Validar variáveis de ambiente
4. Testar conectividade de rede

---

**Nota:** Este backend implementa exatamente a especificação da documentação de handover, mantendo compatibilidade total com a estrutura de estado do frontend existente.
