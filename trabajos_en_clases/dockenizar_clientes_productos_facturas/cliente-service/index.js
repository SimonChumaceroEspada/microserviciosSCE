const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const clienteRoutes = require('./routes/clienteRoutes');

const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.use('/api/clientes', clienteRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.json({ message: 'API Servicio de Clientes. Accede a /api-docs para ver la documentación.' });
});

const PORT = process.env.PORT || 3001;

sequelize.sync()
  .then(() => {
    console.log('Base de datos conectada correctamente');
    app.listen(PORT, () => {
      console.log(`Servicio de clientes corriendo en el puerto ${PORT}`);
      console.log(`Documentación disponible en: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar la base de datos:', error);
  });