/**
 * Interface para logging
 * Seguindo o princípio da Inversão de Dependência (DIP)
 */
class ILogger {
    info(message, meta = {}) {
        throw new Error('Método info deve ser implementado');
    }

    error(message, meta = {}) {
        throw new Error('Método error deve ser implementado');
    }

    warn(message, meta = {}) {
        throw new Error('Método warn deve ser implementado');
    }

    debug(message, meta = {}) {
        throw new Error('Método debug deve ser implementado');
    }
}

module.exports = ILogger;
