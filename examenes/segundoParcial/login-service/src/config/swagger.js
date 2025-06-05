// Configuración de Swagger para la API de autenticación
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Definición básica
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Autenticación',
    version: '1.0.0',
    description: 'Documentación de la API de Autenticación para el Sistema de Gestión Hotelera',
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
      url: 'http://localhost:3001',
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
      LoginRequest: {
        type: 'object',
        required: ['correo', 'password'],
        properties: {
          correo: {
            type: 'string',
            format: 'email',
            description: 'Correo electrónico del usuario'
          },
          password: {
            type: 'string',
            format: 'password',
            description: 'Contraseña del usuario'
          }
        }
      },
      RegisterRequest: {
        type: 'object',
        required: ['correo', 'password'],
        properties: {
          correo: {
            type: 'string',
            format: 'email',
            description: 'Correo electrónico del usuario'
          },
          password: {
            type: 'string',
            format: 'password',
            description: 'Contraseña del usuario'
          }
        }
      },
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'ID único del usuario'
          },
          correo: {
            type: 'string',
            format: 'email',
            description: 'Correo electrónico del usuario'
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de creación del usuario'
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de última actualización del usuario'
          }
        }
      },
      LoginResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Indica si la operación fue exitosa'
          },
          message: {
            type: 'string',
            description: 'Mensaje descriptivo del resultado'
          },
          token: {
            type: 'string',
            description: 'Token JWT para autenticación'
          },
          user: {
            $ref: '#/components/schemas/User'
          }
        }
      },
      RegisterResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Indica si la operación fue exitosa'
          },
          message: {
            type: 'string',
            description: 'Mensaje descriptivo del resultado'
          },
          token: {
            type: 'string',
            description: 'Token JWT para autenticación'
          },
          user: {
            $ref: '#/components/schemas/User'
          }
        }
      },
      UserInfoResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Indica si la operación fue exitosa'
          },
          user: {
            $ref: '#/components/schemas/User'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Indica si la operación fue exitosa (false para errores)'
          },
          message: {
            type: 'string',
            description: 'Mensaje de error'
          },
          error: {
            type: 'string',
            description: 'Detalles técnicos del error (solo en modo desarrollo)'
          }
        }
      }
    }
  }
};

// Opciones
const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'], // Rutas a los archivos con anotaciones JSDoc
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
  
  console.log(`Documentación Swagger disponible en http://localhost:${process.env.PORT || 3001}/api-docs`);
};

module.exports = { swaggerDocs };
