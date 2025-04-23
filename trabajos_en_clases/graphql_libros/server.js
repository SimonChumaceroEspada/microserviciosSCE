require("reflect-metadata");
const express = require('express');
const { createHandler } = require('graphql-http/lib/use/express');
const cors = require('cors');
const { DataSource } = require("typeorm");
const { 
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLID
} = require('graphql');
const { title } = require("process");
require('dotenv').config();

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
    
    // Define GraphQL schema
    const LibroType = new GraphQLObjectType({
      name: 'Libro',
      fields: () => ({
        _id: { type: GraphQLID },
        titulo: { type: new GraphQLNonNull(GraphQLString) },
        autor: { type: new GraphQLNonNull(GraphQLString) },
        editorial: { type: new GraphQLNonNull(GraphQLString) },
        anio: { type: new GraphQLNonNull(GraphQLInt) },
        descripcion: { type: new GraphQLNonNull(GraphQLString) },
        numero_pagina: { type: new GraphQLNonNull(GraphQLInt) },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString }
      })
    });

    // Root Query
    const RootQueryType = new GraphQLObjectType({
      name: 'Query',
      fields: {
        libros: {
          type: new GraphQLList(LibroType),
          resolve: async () => {
            const libroRepository = AppDataSource.getRepository("Libro");
            return await libroRepository.find();
          }
        },
        libro: {
          type: LibroType,
          args: { id: { type: GraphQLID } },
          resolve: async (parent, args) => {
            const libroRepository = AppDataSource.getRepository("Libro");
            const { ObjectId } = require("mongodb");
            return await libroRepository.findOneBy({ _id: new ObjectId(args.id) });
          }
        }
      }
    });

    // Mutations
    const RootMutationType = new GraphQLObjectType({
      name: 'Mutation',
      fields: {
        crearLibro: {
          type: LibroType,
          args: {
            titulo: { type: new GraphQLNonNull(GraphQLString) },
            autor: { type: new GraphQLNonNull(GraphQLString) },
            editorial: { type: new GraphQLNonNull(GraphQLString) },
            anio: { type: new GraphQLNonNull(GraphQLInt) },
            descripcion: { type: new GraphQLNonNull(GraphQLString) },
            numero_pagina: { type: new GraphQLNonNull(GraphQLInt) }
          },
          resolve: async (parent, args) => {
            const libroRepository = AppDataSource.getRepository("Libro");
            const nuevoLibro = libroRepository.create(args);
            return await libroRepository.save(nuevoLibro);
          }
        },
        actualizarLibro: {
          type: LibroType,
          args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            titulo: { type: GraphQLString },
            autor: { type: GraphQLString },
            editorial: { type: GraphQLString },
            anio: { type: GraphQLInt },
            descripcion: { type: GraphQLString },
            numero_pagina: { type: GraphQLInt }
          },
          resolve: async (parent, args) => {
            const { id, ...data } = args;
            const libroRepository = AppDataSource.getRepository("Libro");
            const { ObjectId } = require("mongodb");
            
            // Update only the fields that were provided
            await libroRepository.update({ _id: new ObjectId(id) }, data);
            
            // Return the updated libro
            return await libroRepository.findOneBy({ _id: new ObjectId(id) });
          }
        },
        eliminarLibro: {
          type: GraphQLString,
          args: {
            id: { type: new GraphQLNonNull(GraphQLID) }
          },
          resolve: async (parent, args) => {
            const libroRepository = AppDataSource.getRepository("Libro");
            const { ObjectId } = require("mongodb");
            await libroRepository.delete({ _id: new ObjectId(args.id) });
            return `Libro con ID ${args.id} eliminado correctamente`;
          }
        },
        buscarPorNombre: {
          type: new GraphQLList(LibroType),
          args: {
            title: { type: new GraphQLNonNull(GraphQLString) }
          },
          resolve: async (parent, args) => {
            const libroRepository = AppDataSource.getRepository("Libro");
            const libros = await libroRepository.find();
            return libros.filter(libro => libro.titulo.toLowerCase().includes(args.title.toLowerCase()));
          }
        }
      }
    });

    // Create schema
    const schema = new GraphQLSchema({
      query: RootQueryType,
      mutation: RootMutationType
    });

    // GraphQL endpoint
    app.use('/graphql', createHandler({
      schema,
      formatError: (error) => {
        console.error(error);
        return {
          message: error.message,
          locations: error.locations,
          path: error.path
        };
      }
    }));

    // For GraphQL playground, you'll need to create an HTML file with the GraphQL IDE
    app.get('/playground', (req, res) => {
      res.sendFile('playground.html', { root: __dirname });
    });

    // Root route
    app.get('/', (req, res) => {
      res.send('API de Libros con GraphQL funcionando correctamente');
    });

    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor GraphQL ejecutándose en http://localhost:${PORT}/graphql`);
      console.log(`GraphQL Playground disponible en http://localhost:${PORT}/playground`);
    });
  })
  .catch((error) => console.log("Error al inicializar la base de datos:", error));
