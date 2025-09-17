-- Dados de teste para a aplicação Chef Pessoal AI
-- Execute após init.sql para popular a base de dados com dados de exemplo

-- Limpar dados existentes (cuidado em produção!)
-- DELETE FROM household_members;
-- DELETE FROM households;
-- DELETE FROM users;

-- Utilizador de demonstração
INSERT INTO users (id, name, email, password_hash) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Utilizador Principal', 'demo@chefpessoal.ai', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsLd5Uj6i')
ON CONFLICT (email) DO NOTHING;

-- Casa de demonstração com estado inicial
INSERT INTO households (id, name, app_state) VALUES 
('660e8400-e29b-41d4-a716-446655440000', 'Casa Principal', '{
  "profile": {
    "isConfigured": true,
    "objetivo": "manutencao",
    "restricoes": [],
    "orcamento_por_jantar_eur": 15,
    "equipamento": ["forno", "fogao", "microondas"],
    "pessoas": 4,
    "sobras_almoco": true,
    "idioma_listas": ["pt-PT", "fr-FR"],
    "refeicoes_a_planear": ["jantar"],
    "preferencias_conveniencia": {},
    "staples": ["arroz", "massa", "azeite", "sal", "pimenta"]
  },
  "inventory": [
    {
      "item": "Arroz",
      "quantidade": 1000,
      "unidade": "g",
      "validade": "2025-12-31",
      "prioridade": 3
    },
    {
      "item": "Tomate",
      "quantidade": 500,
      "unidade": "g",
      "validade": "2024-01-20",
      "prioridade": 1
    },
    {
      "item": "Cebola",
      "quantidade": 300,
      "unidade": "g",
      "validade": "2024-02-15",
      "prioridade": 2
    }
  ],
  "semana_atual": null,
  "historico": [],
  "lista_compras": null,
  "recipes": [],
  "batchPrepPlan": null,
  "cookNowSuggestions": null
}')
ON CONFLICT (id) DO NOTHING;

-- Associar utilizador à casa como owner
INSERT INTO household_members (user_id, household_id, role) VALUES 
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', 'owner')
ON CONFLICT (user_id, household_id) DO NOTHING;

-- Utilizador adicional para testar convites
INSERT INTO users (id, name, email, password_hash) VALUES 
('770e8400-e29b-41d4-a716-446655440000', 'Maria Silva', 'maria@exemplo.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsLd5Uj6i')
ON CONFLICT (email) DO NOTHING;

-- Casa para o segundo utilizador
INSERT INTO households (id, name, app_state) VALUES 
('880e8400-e29b-41d4-a716-446655440000', 'Casa de Maria Silva', '{
  "profile": {
    "isConfigured": false,
    "objetivo": "",
    "restricoes": [],
    "orcamento_por_jantar_eur": 10,
    "equipamento": [],
    "pessoas": 4,
    "sobras_almoco": true,
    "idioma_listas": ["pt-PT", "fr-FR"],
    "refeicoes_a_planear": ["jantar"],
    "preferencias_conveniencia": {},
    "staples": []
  },
  "inventory": [],
  "semana_atual": null,
  "historico": [],
  "lista_compras": null,
  "recipes": [],
  "batchPrepPlan": null,
  "cookNowSuggestions": null
}')
ON CONFLICT (id) DO NOTHING;

-- Associar Maria à sua casa
INSERT INTO household_members (user_id, household_id, role) VALUES 
('770e8400-e29b-41d4-a716-446655440000', '880e8400-e29b-41d4-a716-446655440000', 'owner')
ON CONFLICT (user_id, household_id) DO NOTHING;

-- Verificar dados inseridos
SELECT 'Utilizadores inseridos:' as info;
SELECT id, name, email FROM users;

SELECT 'Casas inseridas:' as info;
SELECT id, name FROM households;

SELECT 'Membros das casas:' as info;
SELECT 
    u.name as user_name, 
    h.name as household_name, 
    hm.role 
FROM household_members hm
JOIN users u ON hm.user_id = u.id
JOIN households h ON hm.household_id = h.id;
