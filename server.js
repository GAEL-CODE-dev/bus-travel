const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import database et modèles
const { sequelize, testConnection } = require('./config/database');
const { Trajet, User, Reservation } = require('./models');

// Import routes
const trajetRoutes = require('./routes/trajets');
const reservationRoutes = require('./routes/reservations');
const userRoutes = require('./routes/users');
const contactRoutes = require('./routes/contact');

const app = express();

// Sécurité
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite chaque IP à 100 requêtes par windowMs
});
app.use('/api/', limiter);

// CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:5500'], // Pour le développement
  credentials: true
}));

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging
app.use(morgan('dev'));

// Connexion à MySQL et synchronisation
const initDatabase = async () => {
  try {
    await testConnection();
    await sequelize.sync({ alter: true });
    console.log('✅ Base de données MySQL synchronisée');
  } catch (error) {
    console.error('❌ Erreur de base de données:', error);
  }
};

// Routes
app.use('/api/trajets', trajetRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '🚌 BUS TRAVEL API fonctionne!',
    version: '1.0.0',
    status: 'active'
  });
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route non trouvée' 
  });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Erreur serveur interne',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;

// Initialiser la base de données puis démarrer le serveur
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📊 API disponible sur http://localhost:${PORT}/api`);
    console.log(`🗄️ Base de données: MySQL`);
  });
}).catch(error => {
  console.error('❌ Erreur lors du démarrage:', error);
  process.exit(1);
});

module.exports = app;
