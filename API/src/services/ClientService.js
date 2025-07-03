const IClientRepository = require('../interfaces/IClientRepository');
const ClientRepository = require('../repositories/ClientRepository');
const Client = require('../models/Client');
const { ValidationError, NotFoundError, ConflictError } = require('../utils/errors');

/**
 * Serviço de negócio para Cliente
 * Seguindo o princípio da Responsabilidade Única (SRP) e ISP
 */
class ClientService {
    constructor(repository = new ClientRepository()) {
        this.repository = repository;
    }

    async createClient(data) {
        const client = new Client(data);
        const { isValid, errors } = client.validate();
        if (!isValid) throw new ValidationError(errors);

        try {
            const created = await this.repository.create(client);
            return created.toJSON();
        } catch (error) {
            if (error.message.includes('UNIQUE constraint failed')) {
                throw new ConflictError('Email já está em uso');
            }
            throw error;
        }
    }

    async getClients(query) {
        const filters = { name: query.name, email: query.email };
        const pagination = { page: parseInt(query.page) || 1, limit: parseInt(query.limit) || 10 };

        const rows = await this.repository.findAll(filters, pagination);
        const total = await this.repository.countAll(filters);

        // Agrupar vendas por cliente
        const grouped = {};
        rows.forEach(row => {
            if (!grouped[row.id]) grouped[row.id] = { client: new Client(row), sales: [] };
            if (row.sale_date) grouped[row.id].sales.push({ sale_date: row.sale_date, value: row.value });
        });

        const formatted = Object.values(grouped).map(({ client, sales }) => client.toFormattedResponse(sales));

        return {
            data: { clientes: formatted },
            meta: { registroTotal: total, pagina: pagination.page },
            redundante: { status: 'ok' }
        };
    }

    async getClientById(id) {
        const client = await this.repository.findById(id);
        if (!client) throw new NotFoundError('Cliente não encontrado');
        return client.toJSON();
    }

    async updateClient(id, data) {
        const client = new Client({ ...data, id });
        const { isValid, errors } = client.validate();
        if (!isValid) throw new ValidationError(errors);

        try {
            const updated = await this.repository.update(id, client);
            if (!updated) throw new NotFoundError('Cliente não encontrado');
            return updated.toJSON();
        } catch (error) {
            if (error.message.includes('UNIQUE constraint failed')) throw new ConflictError('Email já está em uso');
            throw error;
        }
    }

    async deleteClient(id) {
        const changes = await this.repository.delete(id);
        if (!changes) throw new NotFoundError('Cliente não encontrado');
    }

    handleError(error, res) {
        if (error.statusCode) {
            const payload = error.errors ? { errors: error.errors } : { error: error.message };
            return res.status(error.statusCode).json(payload);
        }
        console.error(error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

module.exports = ClientService;
