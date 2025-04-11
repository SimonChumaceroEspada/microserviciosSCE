const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Servicio de Clientes',
      version: '1.0.0',
      description: 'API para gestión de clientes',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor local de clientes',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;