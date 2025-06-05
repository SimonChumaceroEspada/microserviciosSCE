const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar componentes
const reservaRoutes = require('./routes/reservaRoutes');
const db = require('./config/db');
const { swaggerDocs } = require('./config/swagger');

// Inicializar la aplicación Express
const app = express();
const PORT = process.env.PORT || 3003;

// Configurar middleware
app.use(cors());
app.use(express.json());

// Ruta para verificar que el servicio está funcionando
app.get('/', (req, res) => {
  res.json({
    message: 'Servicio de Reservas API',
    status: 'OK',
    apiEndpoint: '/api/reservas'
  });
});

// Configurar rutas de la API
app.use('/api/reservas', reservaRoutes);

// Verificar conexión a la base de datos antes de iniciar el servidor
(async () => {
  try {
    // Comprobar conexión a la base de datos
    await db.query('SELECT 1');
    console.log('Conexión exitosa a la base de datos MySQL');
    
    // Iniciar el servidor Express
    app.listen(PORT, () => {
      console.log(`Servidor de Reservas ejecutándose en http://localhost:${PORT}`);
      console.log(`API REST disponible en http://localhost:${PORT}/api/reservas`);
      
      // Inicializar documentación Swagger
      swaggerDocs(app);
    });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    process.exit(1);
  }
})();

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
  console.error('Error no capturado:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa rechazada no manejada:', promise, 'motivo:', reason);
  process.exit(1);
});
