const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cliente = require('./Cliente');

const Factura = sequelize.define('Factura', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  }
}, {
  timestamps: true
});

// Relación con Cliente
Factura.belongsTo(Cliente, {
  foreignKey: {
    name: 'cliente_id',
    allowNull: false
  },
  onDelete: 'RESTRICT'
});

Cliente.hasMany(Factura, {
  foreignKey: 'cliente_id'
});

module.exports = Factura;
