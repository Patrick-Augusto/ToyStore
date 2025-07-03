/**
 * Modelo de Cliente
 * Seguindo o princípio da Responsabilidade Única (SRP)
 */
class Client {
    constructor(data = {}) {
        this.id = data.id || null;
        this.name = data.name || '';
        this.email = data.email || '';
        this.birthDate = data.birth_date || data.birthDate || '';
        this.createdAt = data.created_at || data.createdAt || new Date();
        this.updatedAt = data.updated_at || data.updatedAt || new Date();
    }

    /**
     * Valida se os dados do cliente são válidos
     * @returns {Object} { isValid: boolean, errors: string[] }
     */
    validate() {
        const errors = [];

        if (!this.name || this.name.trim().length === 0) {
            errors.push('Nome é obrigatório');
        }

        if (!this.email || !this.isValidEmail(this.email)) {
            errors.push('Email deve ser válido');
        }

        if (!this.birthDate || !this.isValidDate(this.birthDate)) {
            errors.push('Data de nascimento deve ser válida');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Valida formato de email
     * @param {string} email 
     * @returns {boolean}
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Valida formato de data
     * @param {string} date 
     * @returns {boolean}
     */
    isValidDate(date) {
        const dateObj = new Date(date);
        return dateObj instanceof Date && !isNaN(dateObj);
    }

    /**
     * Converte para objeto simples para resposta da API
     * @returns {Object}
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            birth_date: this.birthDate,
            created_at: this.createdAt,
            updated_at: this.updatedAt
        };
    }

    /**
     * Formata cliente para o formato específico solicitado
     * @param {Array} sales - Array de vendas do cliente
     * @returns {Object}
     */
    toFormattedResponse(sales = []) {
        return {
            info: {
                nomeCompleto: this.name,
                detalhes: {
                    email: this.email,
                    nascimento: this.birthDate
                }
            },
            duplicado: {
                nomeCompleto: this.name
            },
            estatisticas: {
                vendas: sales.map(sale => ({
                    data: sale.sale_date || sale.data,
                    valor: sale.value || sale.valor
                }))
            }
        };
    }
}

module.exports = Client;
