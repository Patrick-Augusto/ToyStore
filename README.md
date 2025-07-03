# Teste Técnico - Loja de Brinquedos

Este projeto consiste em uma aplicação completa para gerenciamento de clientes de uma loja de brinquedos, composto por:

- **Backend API** (Node.js + Express + SQLite)
- **Frontend Mobile** (React Native + Expo)

## 🚀 Recursos Implementados

### Backend (API)
✅ **CRUD completo de clientes**
- Criar, listar, editar e excluir clientes
- Filtros por nome e email
- Paginação

✅ **Sistema de autenticação JWT**
- Login seguro
- Proteção de rotas
- Token com expiração

✅ **Banco de dados relacional**
- SQLite com tabelas estruturadas
- Relacionamento entre clientes e vendas
- Migrações automáticas

✅ **Tabela de vendas**
- Armazenamento de vendas por cliente
- Relacionamento com clientes

✅ **Estatísticas avançadas**
- Total de vendas por dia
- Cliente com maior volume de vendas
- Cliente com maior média de valor por venda
- Cliente com maior frequência de compras

✅ **Testes automatizados**
- Testes unitários e de integração
- Cobertura de código
- Testes de autenticação, CRUD e estatísticas

✅ **API estruturada conforme especificação**
- Formato específico de resposta para clientes
- Dados aninhados e redundantes para teste do frontend

### Frontend (React Native)
✅ **Interface moderna e intuitiva**
- Design responsivo
- Feedback visual para ações do usuário

✅ **Autenticação simples**
- Login com credenciais
- Armazenamento seguro de token

✅ **Gestão de clientes**
- Adicionar clientes com nome, email e data de nascimento
- Listar clientes com informações completas
- Filtros de busca
- Exclusão de clientes

✅ **Recursos especiais**
- **Letra ausente**: Exibe a primeira letra do alfabeto que não aparece no nome completo
- **Normalização de dados**: Trata estrutura complexa da API no frontend
- **Total de vendas**: Exibe vendas por cliente

✅ **Tratamento robusto de dados**
- Normalização de estruturas aninhadas
- Remoção de dados redundantes
- Validação de formulários

## 📁 Estrutura do Projeto

```
TesteTecnicoRN/
├── API/                          # Backend Node.js
│   ├── src/
│   │   ├── controllers/          # Controladores da API
│   │   ├── database/             # Configuração e migrações do BD
│   │   ├── middleware/           # Middleware de autenticação
│   │   ├── routes/               # Definição das rotas
│   │   └── app.js               # Aplicação principal
│   ├── tests/                    # Testes automatizados
│   ├── package.json
│   └── README.md
│
└── Mobile/
    └── ToyStoreApp/              # Aplicação React Native
        ├── src/                  # Código fonte (se usando TS)
        ├── App.js               # Aplicação principal
        ├── package.json
        └── README.md
```

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **SQLite** - Banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Criptografia de senhas
- **Jest** - Testes automatizados
- **Express Validator** - Validação de dados

### Frontend
- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **Axios** - Cliente HTTP
- **AsyncStorage** - Armazenamento local
- **React Hooks** - Gerenciamento de estado

## 🚀 Como Executar

### Pré-requisitos
- Node.js (v14 ou superior)
- npm ou yarn
- Expo CLI (`npm install -g @expo/cli`)

### Backend (API)
```bash
cd API
npm install
npm run db:migrate
npm run dev
```

A API estará disponível em `http://localhost:3000`

### Frontend (React Native)
```bash
cd Mobile/ToyStoreApp
npm install
npm start
```

Use o Expo Go no seu dispositivo ou emulador para executar a aplicação.

## 🔐 Credenciais de Teste
- **Usuário**: admin
- **Senha**: admin123

## 📋 Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login do usuário

### Clientes
- `GET /api/clients` - Listar clientes (formato estruturado)
- `POST /api/clients` - Criar cliente
- `GET /api/clients/:id` - Buscar cliente por ID
- `PUT /api/clients/:id` - Atualizar cliente
- `DELETE /api/clients/:id` - Excluir cliente

### Estatísticas
- `GET /api/stats/sales-by-day` - Vendas por dia
- `GET /api/stats/client-stats` - Estatísticas de clientes
- `GET /api/stats/general` - Estatísticas gerais

## 🧪 Testes

### Executar testes do backend
```bash
cd API
npm test
```

Os testes cobrem:
- Autenticação
- CRUD de clientes
- Estatísticas
- Tratamento de erros

## 📊 Formato da API de Clientes

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

## 🔍 Funcionalidades Especiais

### Letra Ausente
Para cada cliente, a aplicação mobile calcula e exibe a primeira letra do alfabeto (A-Z) que não aparece no nome completo do cliente. Se todas as letras estiverem presentes, exibe "-".

### Normalização de Dados
O frontend React Native recebe a estrutura complexa da API e normaliza os dados, removendo redundâncias e organizando as informações de forma mais limpa para a interface.

### Estatísticas Avançadas
O backend calcula automaticamente:
- Cliente com maior volume total de vendas
- Cliente com maior média de valor por venda
- Cliente com maior número de dias únicos com vendas (frequência)

## 📱 Screenshots e Funcionalidades

### Tela de Login
- Interface limpa e moderna
- Validação de campos
- Credenciais de teste visíveis

### Tela de Clientes
- Lista com pull-to-refresh
- Busca por nome
- Destaque da "letra ausente" para cada cliente
- Total de vendas por cliente
- Botões de ação (adicionar, excluir)

### Adicionar Cliente
- Formulário com validação
- Campos: nome, email, data de nascimento
- Feedback de sucesso/erro

## 🔄 Próximos Passos

Para futuras melhorias:
- Gráficos de estatísticas no mobile
- Edição de clientes no mobile
- Push notifications
- Modo offline
- Testes automatizados no frontend
- Deploy em produção

## 📞 Suporte

Para executar o projeto:
1. Certifique-se de que o backend está rodando na porta 3000
2. Use as credenciais de teste: admin/admin123
3. Verifique os logs para debugging
4. Consulte os READMEs específicos de cada módulo
