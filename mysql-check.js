const { sequelize, Trajet, User, Reservation } = require('../models');
require('dotenv').config();

// Script pour vérifier l'état de la base de données MySQL
async function checkMySQLDatabase() {
  try {
    console.log('🔍 Vérification de la base de données MySQL BUS TRAVEL...');
    
    // Connexion à MySQL
    await sequelize.authenticate();
    console.log('✅ Connecté à MySQL');
    
    // Vérifier les tables
    const [results] = await sequelize.query('SHOW TABLES');
    console.log(`📁 Tables trouvées: ${results.length}`);
    
    for (const result of results) {
      const tableName = Object.values(result)[0];
      const [countResult] = await sequelize.query(`SELECT COUNT(*) as count FROM ${tableName}`);
      const count = countResult[0].count;
      console.log(`   - ${tableName}: ${count} enregistrements`);
    }
    
    // Vérifier les trajets
    console.log('\n🚌 Trajets disponibles:');
    const trajets = await Trajet.findAll({ limit: 5 });
    trajets.forEach(trajet => {
      console.log(`   - ${trajet.depart} → ${trajet.destination} (${trajet.classe}) - ${trajet.prix} FCFA`);
    });
    
    // Vérifier les utilisateurs
    console.log('\n👥 Utilisateurs:');
    const users = await User.findAll({ 
      attributes: ['nom', 'email', 'role'],
      limit: 10 
    });
    users.forEach(user => {
      console.log(`   - ${user.nom} (${user.role}) - ${user.email}`);
    });
    
    // Vérifier les réservations
    console.log('\n📝 Réservations:');
    const reservations = await Reservation.findAll({
      attributes: ['numeroReservation', 'statut'],
      limit: 10
    });
    
    const statuts = reservations.reduce((acc, res) => {
      acc[res.statut] = (acc[res.statut] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(statuts).forEach(([statut, count]) => {
      console.log(`   - ${statut}: ${count}`);
    });
    
    // Statistiques générales
    const [stats] = await sequelize.query(`
      SELECT 
        table_schema as 'Database',
        ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) as 'Size_MB'
      FROM information_schema.tables 
      WHERE table_schema = '${process.env.DB_NAME || 'bustravel'}'
      GROUP BY table_schema
    `);
    
    console.log('\n📈 Statistiques générales:');
    if (stats.length > 0) {
      console.log(`   - Base de données: ${process.env.DB_NAME || 'bustravel'}`);
      console.log(`   - Taille: ${stats[0].Size_MB} MB`);
    }
    
    const [tableCount] = await sequelize.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = '${process.env.DB_NAME || 'bustravel'}'
    `);
    console.log(`   - Tables: ${tableCount[0].count}`);
    
    const [rowCount] = await sequelize.query(`
      SELECT SUM(table_rows) as total_rows
      FROM information_schema.tables 
      WHERE table_schema = '${process.env.DB_NAME || 'bustravel'}'
      AND table_name NOT LIKE 'information_schema%'
    `);
    console.log(`   - Enregistrements totaux: ${rowCount[0].total_rows || 0}`);
    
    console.log('\n🎉 Vérification MySQL terminée!');
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification MySQL:', error);
  } finally {
    await sequelize.close();
    console.log('🔌 Déconnecté de MySQL');
  }
}

// Exécuter la vérification
if (require.main === module) {
  checkMySQLDatabase();
}

module.exports = { checkMySQLDatabase };
