// Script pour tester la connexion à la base de données et l'API
const { sequelize, testConnection } = require('./config/database');
const { Trajet, User, Reservation } = require('./models');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('🔍 Test de connexion BUS TRAVEL...\n');
    
    // 1. Test connexion MySQL
    console.log('1️⃣ Connexion à MySQL...');
    await testConnection();
    
    // 2. Test synchronisation
    console.log('\n2️⃣ Synchronisation des modèles...');
    await sequelize.sync({ alter: true });
    console.log('✅ Modèles synchronisés');
    
    // 3. Test des trajets
    console.log('\n3️⃣ Test des trajets...');
    const trajetCount = await Trajet.count();
    console.log(`✅ ${trajetCount} trajets dans la base`);
    
    if (trajetCount === 0) {
      console.log('⚠️  Aucun trajet - exécutez "npm run seed"');
    }
    
    // 4. Test des utilisateurs
    console.log('\n4️⃣ Test des utilisateurs...');
    const userCount = await User.count();
    console.log(`✅ ${userCount} utilisateurs dans la base`);
    
    // 5. Test des réservations
    console.log('\n5️⃣ Test des réservations...');
    const reservationCount = await Reservation.count();
    console.log(`✅ ${reservationCount} réservations dans la base`);
    
    // 6. Test de requête complexe
    console.log('\n6️⃣ Test de requête complexe...');
    const trajetsVIP = await Trajet.findAll({
      where: { classe: 'VIP', actif: true },
      order: [['prix', 'ASC']],
      limit: 3
    });
    
    console.log(`✅ ${trajetsVIP.length} trajets VIP trouvés`);
    trajetsVIP.forEach(trajet => {
      console.log(`   - ${trajet.depart} → ${trajet.destination}: ${trajet.prix} FCFA`);
    });
    
    // 7. Test d'association
    console.log('\n7️⃣ Test des associations...');
    if (trajetCount > 0 && reservationCount > 0) {
      const reservationWithTrajet = await Reservation.findOne({
        include: [{ model: Trajet, as: 'trajet' }],
        limit: 1
      });
      
      if (reservationWithTrajet) {
        console.log(`✅ Association OK: ${reservationWithTrajet.trajet.depart} → ${reservationWithTrajet.trajet.destination}`);
      }
    }
    
    console.log('\n🎉 Tous les tests sont passés!');
    console.log('📊 Votre base de données est prête');
    console.log('🚀 Vous pouvez démarrer le serveur avec: npm run dev');
    
  } catch (error) {
    console.error('\n❌ Erreur lors du test:', error.message);
    
    if (error.message.includes('connect')) {
      console.log('\n💡 Solutions possibles:');
      console.log('   - Vérifiez que MySQL est démarré');
      console.log('   - Vérifiez les identifiants dans .env');
      console.log('   - Créez la base: CREATE DATABASE bustravel;');
    }
    
    if (error.message.includes('Access denied')) {
      console.log('\n💡 Vérifiez votre mot de passe MySQL dans .env');
    }
    
  } finally {
    await sequelize.close();
  }
}

// Exécuter le test
if (require.main === module) {
  testConnection();
}

module.exports = { testConnection };
