const express = require('express');
const {
    createClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient
} = require('../controllers/clientController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Todas as rotas de clientes requerem autenticação
router.use(authenticateToken);

router.post('/', createClient);
router.get('/', getClients);
router.get('/:id', getClientById);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

module.exports = router;
