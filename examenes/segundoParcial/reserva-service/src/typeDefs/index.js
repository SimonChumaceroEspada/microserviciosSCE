const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Reserva {
    id: ID!
    habitacion_id: ID!
    usuarios_id: ID!
    fecha_reserva: String!
    fecha_entrada: String!
    fecha_salida: String!
    estado_reserva: String!
    total_a_pagar: Float!
    created_at: String
    updated_at: String
    habitacion: Habitacion
    usuario: Usuario
  }

  type Habitacion {
    id: ID!
    numero_habitacion: String!
    tipo_habitacion_id: ID!
    estado: String!
    descripcion: String
  }

  type Usuario {
    id: ID!
    correo: String!
  }

  type Query {
    # Consultas de reservas
    reservas: [Reserva]!
    reserva(id: ID!): Reserva
    reservasByUsuario(usuarios_id: ID!): [Reserva]!
    reservasByHabitacion(habitacion_id: ID!): [Reserva]!
    reservasByEstado(estado_reserva: String!): [Reserva]!
  }

  input ReservaInput {
    habitacion_id: ID!
    usuarios_id: ID!
    fecha_entrada: String!
    fecha_salida: String!
    estado_reserva: String
    total_a_pagar: Float!
  }

  input ReservaUpdateInput {
    habitacion_id: ID
    fecha_entrada: String
    fecha_salida: String
    estado_reserva: String
    total_a_pagar: Float
  }

  type Mutation {
    # Crear una nueva reserva
    crearReserva(input: ReservaInput!): Reserva!
    
    # Actualizar una reserva existente
    actualizarReserva(id: ID!, input: ReservaUpdateInput!): Reserva!
    
    # Cancelar una reserva
    cancelarReserva(id: ID!): Reserva!
    
    # Eliminar una reserva
    eliminarReserva(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;
