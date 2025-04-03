const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ci: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  nombres: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellidos: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sexo: {
    type: DataTypes.ENUM('M', 'F'),
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Cliente;
