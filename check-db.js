const mongoose = require('mongoose');
require('dotenv').config();

// Script pour vérifier l'état de la base de données
async function checkDatabase() {
  try {
    console.log('🔍 Vérification de la base de données BUS TRAVEL...');
    
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');
    
    const db = mongoose.connection.db;
    
    // Vérifier les collections
    const collections = await db.listCollections().toArray();
    console.log(`📁 Collections trouvées: ${collections.length}`);
    
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`   - ${collection.name}: ${count} documents`);
    }
    
    // Vérifier les index
    console.log('\n📊 Index des collections:');
    
    // Index trajets
    const trajetsIndexes = await db.collection('trajets').listIndexes().toArray();
    console.log(`   - trajets: ${trajetsIndexes.length} index`);
    
    // Index réservations
    const reservationsIndexes = await db.collection('reservations').listIndexes().toArray();
    console.log(`   - reservations: ${reservationsIndexes.length} index`);
    
    // Index utilisateurs
    const usersIndexes = await db.collection('users').listIndexes().toArray();
    console.log(`   - users: ${usersIndexes.length} index`);
    
    // Vérifier les données exemples
    console.log('\n🚌 Trajets disponibles:');
    const trajets = await db.collection('trajets').find({}).limit(5).toArray();
    trajets.forEach(trajet => {
      console.log(`   - ${trajet.depart} → ${trajet.destination} (${trajet.classe}) - ${trajet.prix} FCFA`);
    });
    
    console.log('\n👥 Utilisateurs:');
    const users = await db.collection('users').find({}, { nom: 1, email: 1, role: 1 }).toArray();
    users.forEach(user => {
      console.log(`   - ${user.nom} (${user.role}) - ${user.email}`);
    });
    
    console.log('\n📝 Réservations:');
    const reservations = await db.collection('reservations').find({}, { numeroReservation: 1, statut: 1 }).toArray();
    const statuts = reservations.reduce((acc, res) => {
      acc[res.statut] = (acc[res.statut] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(statuts).forEach(([statut, count]) => {
      console.log(`   - ${statut}: ${count}`);
    });
    
    // Statistiques générales
    const stats = await db.stats();
    console.log('\n📈 Statistiques générales:');
    console.log(`   - Base de données: ${stats.db}`);
    console.log(`   - Taille: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   - Collections: ${stats.collections}`);
    console.log(`   - Documents: ${stats.objects}`);
    
    console.log('\n🎉 Vérification terminée!');
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter la vérification
if (require.main === module) {
  checkDatabase();
}

module.exports = { checkDatabase };
