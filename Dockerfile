# Usar uma imagem base do Python
FROM python:3.9-slim

# Instalar dependências do sistema necessárias
RUN apt-get update && apt-get install -y \
    libpq-dev gcc && \
    rm -rf /var/lib/apt/lists/*

# Definir o diretório de trabalho
WORKDIR /app

# Copiar os arquivos de dependências
COPY requirements.txt .

# Instalar as dependências do Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar o código restante
COPY . .

# Expor a porta da aplicação
EXPOSE 8000

# Comando para iniciar o backend
CMD ["python", "app/app.py"]
