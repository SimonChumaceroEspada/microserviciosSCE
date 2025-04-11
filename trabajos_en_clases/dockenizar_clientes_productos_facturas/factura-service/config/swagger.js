const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Servicio de Facturas',
      version: '1.0.0',
      description: 'API para gestión de facturas',
    },
    servers: [
      {
        url: 'http://localhost:3003',
        description: 'Servidor local de facturas',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;