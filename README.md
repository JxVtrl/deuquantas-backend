
# Deu Quantas - Backend

Este repositório contém o backend da aplicação **Deu Quantas**, responsável por gerenciar a lógica de negócios, APIs e comunicação com o banco de dados. O backend é desenvolvido em Python, utilizando frameworks modernos para alta performance e escalabilidade.

---

## 📂 Estrutura do Projeto

```plaintext
deuquantas-backend/
├── app/                  # Código principal do backend
│   ├── app.py            # Ponto de entrada da aplicação
│   ├── models/           # Definições de modelos do banco de dados
│   ├── routes/           # Definições de rotas e endpoints
│   └── utils/            # Funções utilitárias
├── tests/                # Testes unitários e de integração
├── requirements.txt      # Dependências do projeto
├── Dockerfile            # Configuração do Docker para o backend
├── .env.example          # Exemplo de configuração de variáveis de ambiente
└── README.md             # Este arquivo
```

---

## 🚀 Funcionalidades

- **Gerenciamento de Comandas**: APIs para criação, atualização e visualização de comandas.
- **Integração com Banco de Dados**: Suporte para PostgreSQL.
- **Notificações**: Envio de notificações para consumidores e estabelecimentos.
- **APIs RESTful**: Estruturadas para integração com o frontend e outros serviços.

---

## 🛠 Tecnologias Utilizadas

- **Python 3.9+**
- **Flask**: Framework web para construção de APIs.
- **SQLAlchemy**: ORM para comunicação com o banco de dados PostgreSQL.
- **Gunicorn**: Servidor WSGI para produção.
- **Docker**: Containerização para ambiente consistente.

---

## 🧩 Configuração do Ambiente

### **1. Pré-requisitos**

Certifique-se de que as seguintes ferramentas estão instaladas:
- [Python 3.9+](https://www.python.org/downloads/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)

### **2. Instalar Dependências**

1. Clone o repositório:
   ```bash
   git clone https://github.com/SeuUsuario/deuquantas-backend.git
   cd deuquantas-backend
   ```

2. Crie um ambiente virtual e instale as dependências:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # Linux/Mac
   .\venv\Scripts\activate   # Windows
   pip install -r requirements.txt
   ```

### **3. Configurar Variáveis de Ambiente**

1. Renomeie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Preencha os valores das variáveis de ambiente:
   ```plaintext
   DATABASE_URL=postgresql://user:password@db:5432/deuquantas
   SECRET_KEY=sua-chave-secreta
   ```

### **4. Executar a Aplicação**

1. Execute as migrações do banco de dados (se aplicável):
   ```bash
   flask db upgrade
   ```

2. Inicie o servidor:
   ```bash
   python app/app.py
   ```

3. Acesse a aplicação:
   [http://localhost:8000](http://localhost:8000)

---

## 🧪 Testes

Execute os testes para garantir que tudo está funcionando corretamente:
```bash
pytest tests/
```

---

## 🐳 Usando Docker

1. Construa a imagem Docker:
   ```bash
   docker build -t deuquantas-backend .
   ```

2. Execute o container:
   ```bash
   docker run -p 8000:8000 --env-file .env deuquantas-backend
   ```

---

## 📄 APIs

### **Endpoints Disponíveis**

- **`GET /comandas`**: Retorna todas as comandas.
- **`POST /comandas`**: Cria uma nova comanda.
- **`PUT /comandas/:id`**: Atualiza uma comanda existente.
- **`DELETE /comandas/:id`**: Remove uma comanda. 

Para mais detalhes, consulte a [documentação completa da API](#).

---

## 🔒 Segurança

- **Variáveis Sensíveis**: Certifique-se de que as variáveis no arquivo `.env` não sejam expostas.
- **Autenticação**: Planeje a implementação de JWT ou OAuth2 para APIs seguras.
- **Banco de Dados**: Sempre utilize backups e acesso controlado.

---

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

Se precisar de mais informações ou encontrar problemas, abra uma **issue** ou entre em contato com a equipe de desenvolvimento. 🚀
