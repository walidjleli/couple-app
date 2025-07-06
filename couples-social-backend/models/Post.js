const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  coupleId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'coupleId' // s'assure que la colonne s'appelle bien 'coupleId'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false // user1 ou user2
  }
}, {
  tableName: 'Posts',           // ✅ Correspond exactement à ta table PostgreSQL
  freezeTableName: true,        // ✅ Empêche Sequelize de modifier le nom
  timestamps: true              // ✅ createdAt / updatedAt auto
});

module.exports = Post;
