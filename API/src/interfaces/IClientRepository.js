/**
 * Interface para repositório de clientes
 * Seguindo o princípio da Inversão de Dependência (DIP)
 */
class IClientRepository {
    async create(clientData) {
        throw new Error('Método create deve ser implementado');
    }

    async findAll(filters = {}, pagination = {}) {
        throw new Error('Método findAll deve ser implementado');
    }

    async findById(id) {
        throw new Error('Método findById deve ser implementado');
    }

    async update(id, clientData) {
        throw new Error('Método update deve ser implementado');
    }

    async delete(id) {
        throw new Error('Método delete deve ser implementado');
    }

    async countAll(filters = {}) {
        throw new Error('Método countAll deve ser implementado');
    }
}

module.exports = IClientRepository;
