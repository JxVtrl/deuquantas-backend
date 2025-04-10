# Usa uma imagem do Node.js com Debian
FROM node:20-slim

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências primeiro
COPY backend/package*.json ./

# Configurar o npm para usar o registry global
RUN npm config set registry https://registry.npmjs.org/

# Instala as dependências
RUN apt-get update && \
    apt-get install -y python3 make g++ && \
    npm install && \
    apt-get remove -y python3 make g++ && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

# Copia o restante do código do backend
COPY backend/ ./

# Compila o TypeScript
RUN npm run build

# Expõe as portas do backend e socket
EXPOSE 3010 3011

# Define o ambiente com a importação do crypto antes de iniciar
CMD ["npm", "run", "start:prod"]
