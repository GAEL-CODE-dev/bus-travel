const mongoose = require('mongoose');
require('dotenv').config();

// Script d'initialisation de la base de données
async function initDatabase() {
  try {
    console.log('🔧 Initialisation de la base de données BUS TRAVEL...');
    
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');
    
    // Créer les indexes pour optimiser les performances
    const db = mongoose.connection.db;
    
    // Index pour les trajets
    await db.collection('trajets').createIndex({ depart: 1, destination: 1 });
    await db.collection('trajets').createIndex({ prix: 1 });
    await db.collection('trajets').createIndex({ classe: 1 });
    await db.collection('trajets').createIndex({ actif: 1 });
    
    // Index pour les réservations
    await db.collection('reservations').createIndex({ 'passager.email': 1 });
    await db.collection('reservations').createIndex({ numeroReservation: 1 }, { unique: true });
    await db.collection('reservations').createIndex({ dateVoyage: 1 });
    await db.collection('reservations').createIndex({ statut: 1 });
    await db.collection('reservations').createIndex({ trajet: 1 });
    
    // Index pour les utilisateurs
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ telephone: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1 });
    
    console.log('📊 Index créés avec succès');
    
    // Vérifier la connexion
    const stats = await db.stats();
    console.log(`📈 Base de données: ${stats.db}`);
    console.log(`📁 Collections: ${stats.collections}`);
    
    console.log('🎉 Base de données initialisée avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter l'initialisation
if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase };
