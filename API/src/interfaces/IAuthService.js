/**
 * Interface para serviços de autenticação
 * Seguindo o princípio da Inversão de Dependência (DIP)
 */
class IAuthService {
    async authenticate(credentials) {
        throw new Error('Método authenticate deve ser implementado');
    }

    async generateToken(user) {
        throw new Error('Método generateToken deve ser implementado');
    }

    async verifyToken(token) {
        throw new Error('Método verifyToken deve ser implementado');
    }
}

module.exports = IAuthService;
