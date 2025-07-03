/**
 * Interface para operações de banco de dados
 * Seguindo o princípio da Inversão de Dependência (DIP)
 */
class IDatabase {
    async connect() {
        throw new Error('Método connect deve ser implementado');
    }

    async run(sql, params = []) {
        throw new Error('Método run deve ser implementado');
    }

    async get(sql, params = []) {
        throw new Error('Método get deve ser implementado');
    }

    async all(sql, params = []) {
        throw new Error('Método all deve ser implementado');
    }

    async close() {
        throw new Error('Método close deve ser implementado');
    }
}

module.exports = IDatabase;
