const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Couple = sequelize.define('Couple', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user1_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  user2_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  isValidated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'Couples',
  freezeTableName: true
});

module.exports = Couple;
