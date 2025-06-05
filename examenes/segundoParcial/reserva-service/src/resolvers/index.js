const reservaResolvers = require('./reservaResolvers');

const resolvers = {
  Query: {
    ...reservaResolvers.Query
  },
  Mutation: {
    ...reservaResolvers.Mutation
  },
  Reserva: {
    ...reservaResolvers.Reserva
  }
};

module.exports = resolvers;
