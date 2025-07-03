const express = require('express');
const {
    getSalesByDay,
    getClientStats,
    getGeneralStats
} = require('../controllers/statsController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Todas as rotas de estatísticas requerem autenticação
router.use(authenticateToken);

router.get('/sales-by-day', getSalesByDay);
router.get('/client-stats', getClientStats);
router.get('/general', getGeneralStats);

module.exports = router;
