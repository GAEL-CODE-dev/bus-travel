const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuration de la base de données MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME || 'bustravel',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
);

// Test de connexion
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connecté à MySQL avec succès');
  } catch (error) {
    console.error('❌ Erreur de connexion à MySQL:', error.message);
  }
};

// Synchronisation de la base de données
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force, alter: true });
    console.log(`📊 Base de données ${force ? 'réinitialisée' : 'synchronisée'} avec succès`);
  } catch (error) {
    console.error('❌ Erreur de synchronisation:', error.message);
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase
};
