const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db');

const User = require('./models/User');
const Couple = require('./models/Couple');
const Post = require('./models/Post');

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

// Charger les variables d'environnement
dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ✅ Routes
app.use('/api', authRoutes);
app.use('/api/posts', postRoutes);

// ✅ Connexion à la DB + synchronisation
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connexion à PostgreSQL réussie');

    sequelize.sync({ alter: true }).then(() => {
      console.log('🗂️ Tables synchronisées');
      
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Serveur lancé sur http://0.0.0.0:${PORT}`);
      });
    });
  })
  .catch(err => console.error('❌ Erreur PostgreSQL :', err));
