const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    logging: false
  }
);

module.exports = sequelize;
// ...existing code...

// Test de connexion (à retirer en production)
sequelize.authenticate()
  .then(() => console.log('Connexion à la base de données réussie.'))
  .catch(err => console.error('Erreur de connexion à la base de données :', err));