/**
 * Configuração do Swagger para documentação da API
 */
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Toy Store API',
            version: '1.0.0',
            description: 'API REST para loja de brinquedos - Documentação Swagger'
        },
        servers: [
            {
                url: 'http://localhost:' + (process.env.PORT || 3000) + '/api',
                description: 'Servidor local'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./src/routes/*.js', './src/models/*.js']
};

const specs = swaggerJsDoc(options);

module.exports = {
    swaggerUi,
    specs
};
