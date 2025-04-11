require("reflect-metadata");
const express = require('express');
const cors = require('cors');
const { DataSource } = require("typeorm");
require('dotenv').config();


const libroRoutes = require('./routes/libroRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


const AppDataSource = new DataSource({
  type: "mongodb",
  url: process.env.MONGODB_URI,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  synchronize: true,
  logging: false,
  entities: [require("./entities/Libro")]
});

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log("Conexión a MongoDB establecida");
    
    // Make DataSource available globally
    app.locals.dataSource = AppDataSource;
    
    // Routes
    app.use('/libro', libroRoutes);

    // Root route
    app.get('/', (req, res) => {
      res.send('API de Libros funcionando correctamente');
    });

    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    });
  })
  .catch((error) => console.log("Error al inicializar la base de datos:", error));
