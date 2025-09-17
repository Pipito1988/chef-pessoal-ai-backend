-- Criação da base de dados Chef Pessoal AI
-- Execute este script numa instância PostgreSQL para criar as tabelas necessárias

-- Extensão para UUID (se não existir)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de utilizadores
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de casas/households
CREATE TABLE IF NOT EXISTS households (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    app_state JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de junção utilizadores-casas
CREATE TABLE IF NOT EXISTS household_members (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    household_id UUID REFERENCES households(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('owner', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, household_id)
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_household_members_user_id ON household_members(user_id);
CREATE INDEX IF NOT EXISTS idx_household_members_household_id ON household_members(household_id);
CREATE INDEX IF NOT EXISTS idx_households_updated_at ON households(updated_at);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_households_updated_at 
    BEFORE UPDATE ON households 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados de teste (opcional - remover em produção)
-- INSERT INTO users (id, name, email, password_hash) VALUES 
-- ('550e8400-e29b-41d4-a716-446655440000', 'Utilizador Demo', 'demo@chefpessoal.ai', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsLd5Uj6i');
-- Password: 'password'

COMMENT ON TABLE users IS 'Tabela de utilizadores da aplicação';
COMMENT ON TABLE households IS 'Tabela de casas/households - contém o estado da aplicação em JSONB';
COMMENT ON TABLE household_members IS 'Tabela de junção entre utilizadores e casas';

COMMENT ON COLUMN households.app_state IS 'Estado completo da aplicação em formato JSON (profile, inventory, recipes, etc.)';
COMMENT ON COLUMN household_members.role IS 'Papel do utilizador na casa: owner ou member';
