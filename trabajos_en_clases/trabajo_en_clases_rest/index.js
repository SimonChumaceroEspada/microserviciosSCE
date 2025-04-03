const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Importar rutas
const productoRoutes = require('./routes/productoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const facturaRoutes = require('./routes/facturaRoutes');
const detalleFacturaRoutes = require('./routes/detalleFacturaRoutes');

const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());


app.use('/api/productos', productoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/facturas', facturaRoutes);
app.use('/api/detalles', detalleFacturaRoutes);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Ruta principal
app.get('/', (req, res) => {
  res.json({ message: 'API Sistema de Ventas. Accede a /api-docs para ver la documentación.' });
});


const PORT = process.env.PORT || 3000;


sequelize.sync({ alter: true })
  .then(() => {
    console.log('Base de datos sincronizada correctamente');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
      console.log(`Documentación disponible en: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((error) => {
    console.error('Error al sincronizar la base de datos:', error);
  });

