const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Sistema de Ventas',
      version: '1.0.0',
      description: 'API RESTful para sistema de ventas con gestión de productos, clientes, facturas y detalles',
    },
  },
  apis: [
    './routes/*.js',
  ],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
