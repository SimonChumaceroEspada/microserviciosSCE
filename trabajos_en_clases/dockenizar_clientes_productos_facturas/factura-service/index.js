const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Importar solo las rutas de facturas
const facturaRoutes = require('./routes/facturaRoutes');

const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

// Registrar solo las rutas de facturas
app.use('/api/facturas', facturaRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Ruta principal
app.get('/', (req, res) => {
  res.json({ message: 'API Servicio de Facturas. Accede a /api-docs para ver la documentación.' });
});

const PORT = process.env.PORT || 3003;

sequelize.sync()
  .then(() => {
    console.log('Base de datos conectada correctamente');
    app.listen(PORT, () => {
      console.log(`Servicio de facturas corriendo en el puerto ${PORT}`);
      console.log(`Documentación disponible en: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar la base de datos:', error);
  });