const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Producto = sequelize.define('Producto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT
  },
  marca: {
    type: DataTypes.STRING
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Producto;
