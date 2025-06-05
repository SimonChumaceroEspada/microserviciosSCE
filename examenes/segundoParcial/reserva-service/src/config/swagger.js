// Configuración de Swagger para la API de reservas
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Definición básica
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Reservas de Hotel',
    version: '1.0.0',
    description: 'Documentación de la API de Reservas para el Sistema de Gestión Hotelera',
    contact: {
      name: 'Soporte de API',
      email: 'soporte@hotel.com'
    },
    license: {
      name: 'ISC',
      url: 'https://opensource.org/licenses/ISC'
    }
  },
  servers: [
    {
      url: 'http://localhost:3003',
      description: 'Servidor de desarrollo'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      Reserva: {
        type: 'object',
        required: ['habitacion_id', 'usuarios_id', 'fecha_entrada', 'fecha_salida', 'total_a_pagar'],
        properties: {
          id: {
            type: 'integer',
            description: 'ID único de la reserva'
          },
          habitacion_id: {
            type: 'integer',
            description: 'ID de la habitación reservada'
          },
          usuarios_id: {
            type: 'integer',
            description: 'ID del usuario que realiza la reserva'
          },
          fecha_reserva: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha y hora en que se realizó la reserva'
          },
          fecha_entrada: {
            type: 'string',
            format: 'date',
            description: 'Fecha de check-in'
          },
          fecha_salida: {
            type: 'string',
            format: 'date',
            description: 'Fecha de check-out'
          },
          estado_reserva: {
            type: 'string',
            enum: ['confirmada', 'pendiente', 'cancelada'],
            description: 'Estado actual de la reserva'
          },
          total_a_pagar: {
            type: 'number',
            format: 'float',
            description: 'Costo total de la reserva'
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de creación del registro'
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de última actualización del registro'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: 'Mensaje de error'
          }
        }
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};

// Opciones
const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js', './src/controllers/*.js'], // Rutas a los archivos con anotaciones JSDoc
};

// Inicializar swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// Función para configurar swagger en la app
const swaggerDocs = (app) => {
  // Ruta para acceder a la documentación
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  // Ruta para obtener el archivo swagger.json
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  console.log(`Documentación Swagger disponible en http://localhost:${process.env.PORT || 3003}/api-docs`);
};

module.exports = { swaggerDocs };
