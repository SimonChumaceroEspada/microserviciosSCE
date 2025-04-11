const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Servicio de Productos',
      version: '1.0.0',
      description: 'API para gestión de productos',
    },
    servers: [
      {
        url: 'http://localhost:3002',
        description: 'Servidor local de productos',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;