const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Factura = require('./Factura');
const Producto = require('./Producto');

const DetalleFactura = sequelize.define('DetalleFactura', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  timestamps: true
});

DetalleFactura.belongsTo(Factura, {
  foreignKey: {
    name: 'factura_id',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

DetalleFactura.belongsTo(Producto, {
  foreignKey: {
    name: 'producto_id',
    allowNull: false
  },
  onDelete: 'RESTRICT'
});

Factura.hasMany(DetalleFactura, {
  foreignKey: 'factura_id'
});

Producto.hasMany(DetalleFactura, {
  foreignKey: 'producto_id'
});

module.exports = DetalleFactura;
