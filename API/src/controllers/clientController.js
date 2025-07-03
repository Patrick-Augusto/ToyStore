const { body, validationResult } = require('express-validator');
const ClientService = require('../services/ClientService');

// Validações
const clientValidation = [
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('Email deve ser válido'),
    body('birth_date').isDate().withMessage('Data de nascimento deve ser válida')
];

// Criar cliente
const createClient = async (req, res) => {
    try {
        const service = new ClientService();
        const result = await service.createClient(req.body);
        res.status(201).json(result);
    } catch (error) {
        service.handleError(error, res);
    }
};

// Listar clientes com formato específico
const getClients = async (req, res) => {
    try {
        const service = new ClientService();
        const result = await service.getClients(req.query);
        res.json(result);
    } catch (error) {
        logger.error('Erro ao buscar clientes', { error });
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Buscar cliente por ID
const getClientById = async (req, res) => {
    try {
        const service = new ClientService();
        const client = await service.getClientById(req.params.id);
        res.json(client);
    } catch (error) {
        service.handleError(error, res);
    }
};

// Atualizar cliente
const updateClient = async (req, res) => {
    try {
        const service = new ClientService();
        const updated = await service.updateClient(req.params.id, req.body);
        res.json(updated);
    } catch (error) {
        service.handleError(error, res);
    }
};

// Deletar cliente
const deleteClient = async (req, res) => {
    try {
        const service = new ClientService();
        await service.deleteClient(req.params.id);
        res.status(204).send();
    } catch (error) {
        service.handleError(error, res);
    }
};

module.exports = {
    createClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient
};
