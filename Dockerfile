# Dockerfile para o Backend Chef Pessoal AI
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar todas as dependências (incluindo dev para compilar)
RUN npm install

# Copiar código fonte
COPY . .

# Compilar TypeScript
RUN npm run build

# Remover dependências de desenvolvimento
RUN npm prune --production

# Expor porta (Railway define automaticamente)
EXPOSE $PORT

# Definir variáveis de ambiente padrão
ENV NODE_ENV=production
# Railway define PORT automaticamente

# Comando para iniciar a aplicação
CMD ["node", "dist/index.js"]
