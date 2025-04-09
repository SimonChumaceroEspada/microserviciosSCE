const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cliente = require('./Cliente');
const Producto = require('./Producto');

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
  },
  detalles: {
    type: DataTypes.JSON,
    defaultValue: [],
    get() {
      const rawValue = this.getDataValue('detalles');
      if (!rawValue) return [];
      return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
    },
    set(value) {
      this.setDataValue('detalles', 
        value === null ? '[]' : 
        typeof value === 'string' ? value : 
        JSON.stringify(value)
      );
    }
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
