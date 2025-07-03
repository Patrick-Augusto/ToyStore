/**
 * Classes de Erro para tratamento padronizado
 */
class HttpError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

class NotFoundError extends HttpError {
    constructor(message = 'Recurso não encontrado') {
        super(message, 404);
    }
}

class ValidationError extends HttpError {
    constructor(errors = []) {
        super('Dados inválidos', 400);
        this.errors = errors;
    }
}

class ConflictError extends HttpError {
    constructor(message = 'Conflito de dados') {
        super(message, 409);
    }
}

module.exports = {
    HttpError,
    NotFoundError,
    ValidationError,
    ConflictError
};
