// Archivo para probar la documentación Swagger sin necesidad de conexión a la base de datos
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar componentes
const reservaRoutes = require('./routes/reservaRoutes');
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

// Iniciar el servidor Express (sin verificar conexión a BD)
app.listen(PORT, () => {
  console.log(`Servidor de Reservas ejecutándose en http://localhost:${PORT}`);
  console.log(`API REST disponible en http://localhost:${PORT}/api/reservas`);
  
  // Inicializar documentación Swagger
  swaggerDocs(app);
});

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
  console.error('Error no capturado:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa rechazada no manejada:', promise, 'motivo:', reason);
});
