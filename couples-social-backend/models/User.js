const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isConfirmed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  couple_id: {
    type: DataTypes.UUID,
    allowNull: true
  }
}, {
  tableName: 'Users',
  freezeTableName: true
});

module.exports = User;
