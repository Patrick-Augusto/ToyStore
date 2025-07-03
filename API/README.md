# API - Loja de Brinquedos

Esta é uma API REST para gerenciamento de clientes de uma loja de brinquedos.

## Recursos

- ✅ CRUD completo de clientes
- ✅ Sistema de autenticação JWT
- ✅ Filtros de busca por nome e email
- ✅ Tabela de vendas com relacionamento
- ✅ Estatísticas de vendas e clientes
- ✅ Testes automatizados
- ✅ Banco de dados SQLite

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Execute as migrações do banco:
```bash
npm run db:migrate
```

3. Inicie o servidor:
```bash
npm run dev
```

A API estará disponível em `http://localhost:3000`

## Autenticação

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

Retorna:
```json
{
  "token": "jwt_token_aqui",
  "user": {
    "id": 1,
    "username": "admin"
  }
}
```

## Endpoints

### Clientes

Todas as rotas de clientes requerem autenticação via header:
```
Authorization: Bearer {token}
```

#### Listar clientes
```http
GET /api/clients
GET /api/clients?name=João
GET /api/clients?email=joao@example.com
GET /api/clients?page=1&limit=10
```

#### Criar cliente
```http
POST /api/clients
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "birth_date": "1990-01-01"
}
```

#### Buscar cliente por ID
```http
GET /api/clients/:id
```

#### Atualizar cliente
```http
PUT /api/clients/:id
Content-Type: application/json

{
  "name": "João Silva Santos",
  "email": "joao.santos@example.com",
  "birth_date": "1990-01-01"
}
```

#### Deletar cliente
```http
DELETE /api/clients/:id
```

### Estatísticas

#### Vendas por dia
```http
GET /api/stats/sales-by-day
```

#### Estatísticas de clientes
```http
GET /api/stats/client-stats
```

Retorna:
- Cliente com maior volume de vendas
- Cliente com maior média de valor por venda
- Cliente com maior frequência de compras

#### Estatísticas gerais
```http
GET /api/stats/general
```

## Testes

Execute os testes:
```bash
npm test
```

Execute os testes em modo watch:
```bash
npm run test:watch
```

## Estrutura do Banco

### Tabela: users
- id (INTEGER PRIMARY KEY)
- username (TEXT UNIQUE)
- password (TEXT)
- created_at (DATETIME)

### Tabela: clients
- id (INTEGER PRIMARY KEY)
- name (TEXT)
- email (TEXT UNIQUE)
- birth_date (DATE)
- created_at (DATETIME)
- updated_at (DATETIME)

### Tabela: sales
- id (INTEGER PRIMARY KEY)
- client_id (INTEGER FK)
- value (DECIMAL)
- sale_date (DATE)
- created_at (DATETIME)

## Formato de Resposta da API de Clientes

A API retorna os clientes no formato específico solicitado:

```json
{
  "data": {
    "clientes": [
      {
        "info": {
          "nomeCompleto": "Ana Beatriz",
          "detalhes": {
            "email": "ana.b@example.com",
            "nascimento": "1992-05-01"
          }
        },
        "duplicado": {
          "nomeCompleto": "Ana Beatriz"
        },
        "estatisticas": {
          "vendas": [
            { "data": "2024-01-01", "valor": 150 },
            { "data": "2024-01-02", "valor": 50 }
          ]
        }
      }
    ]
  },
  "meta": {
    "registroTotal": 2,
    "pagina": 1
  },
  "redundante": {
    "status": "ok"
  }
}
```
