require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const logger = require('./utils/logger');
const { swaggerUi, specs } = require('./config/swagger');
const db = require('./database/database');

// Importar rotas
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients');
const statsRoutes = require('./routes/stats');

const app = express();
const PORT = process.env.PORT || 3000;

// Segurança: cabeçalhos HTTP
app.use(helmet());

// Limite de requisições
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100,
    message: { error: 'Muitas requisições, tente novamente mais tarde.' }
}));

// CORS e parsing JSON
app.use(cors());
app.use(express.json());

// Logger de requisições
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`);
    next();
});

// Documentação Swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/stats', statsRoutes);

// Rota de teste
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo deu errado!' });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Inicializar servidor
async function startServer() {
    try {
        await db.connect();
        if (process.env.NODE_ENV !== 'test') {
            console.log('Banco de dados conectado');
        }

        if (process.env.NODE_ENV !== 'test') {
            app.listen(PORT, () => {
                console.log(`Servidor rodando na porta ${PORT}`);
                console.log(`API disponível em http://localhost:${PORT}/api`);
            });
        }
    } catch (error) {
        if (process.env.NODE_ENV !== 'test') {
            console.error('Erro ao inicializar servidor:', error);
        }
        process.exit(1);
    }
}

if (process.env.NODE_ENV !== 'test') {
    startServer();
}

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nEncerrando servidor...');
    db.close();
    process.exit(0);
});

module.exports = app;
