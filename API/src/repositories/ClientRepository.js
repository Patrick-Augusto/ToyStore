const IClientRepository = require('../interfaces/IClientRepository');
const db = require('../database/database');
const Client = require('../models/Client');

/**
 * Implementação de IClientRepository usando sqlite
 */
class ClientRepository extends IClientRepository {
    async create(clientData) {
        const result = await db.run(
            'INSERT INTO clients (name, email, birth_date) VALUES (?, ?, ?)',
            [clientData.name, clientData.email, clientData.birthDate]
        );
        const row = await db.get('SELECT * FROM clients WHERE id = ?', [result.id]);
        return new Client(row);
    }

    async findAll(filters = {}, pagination = {}) {
        const { name, email } = filters;
        const { page = 1, limit = 10 } = pagination;
        const offset = (page - 1) * limit;

        let query = `SELECT c.*, s.sale_date, s.value
                     FROM clients c
                     LEFT JOIN sales s ON c.id = s.client_id`;
        const params = [];
        const conditions = [];

        if (name) {
            conditions.push('c.name LIKE ?');
            params.push(`%${name}%`);
        }
        if (email) {
            conditions.push('c.email LIKE ?');
            params.push(`%${email}%`);
        }
        if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');

        query += ' ORDER BY c.name LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const rows = await db.all(query, params);
        return rows;
    }

    async countAll(filters = {}) {
        const { name, email } = filters;
        let query = 'SELECT COUNT(*) as total FROM clients';
        const params = [];
        const conditions = [];

        if (name) {
            conditions.push('name LIKE ?');
            params.push(`%${name}%`);
        }
        if (email) {
            conditions.push('email LIKE ?');
            params.push(`%${email}%`);
        }
        if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');

        const row = await db.get(query, params);
        return row.total;
    }

    async findById(id) {
        const row = await db.get('SELECT * FROM clients WHERE id = ?', [id]);
        return row ? new Client(row) : null;
    }

    async update(id, clientData) {
        const result = await db.run(
            'UPDATE clients SET name = ?, email = ?, birth_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [clientData.name, clientData.email, clientData.birthDate, id]
        );
        if (result.changes === 0) return null;
        const row = await db.get('SELECT * FROM clients WHERE id = ?', [id]);
        return new Client(row);
    }

    async delete(id) {
        const result = await db.run('DELETE FROM clients WHERE id = ?', [id]);
        return result.changes;
    }
}

module.exports = ClientRepository;
