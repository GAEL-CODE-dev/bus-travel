const { sequelize, Trajet, User, Reservation } = require('../models');
require('dotenv').config();

// Données initiales pour MySQL
const trajetsData = [
  {
    depart: 'Brazzaville',
    destination: 'Pointe-Noire',
    heureDepart: '06:00:00',
    heureArrivee: '16:00:00',
    prix: 15000.00,
    classe: 'VIP',
    equipements: ['Climatisation', 'Wifi', 'Prises électriques', 'Toilettes', 'Sièges confortables'],
    placesTotales: 50,
    placesDisponibles: 50,
    jours: ['Lundi', 'Mercredi', 'Vendredi', 'Dimanche'],
    description: 'Trajet premium avec tout le confort nécessaire',
    actif: true
  },
  {
    depart: 'Pointe-Noire',
    destination: 'Brazzaville',
    heureDepart: '07:00:00',
    heureArrivee: '17:00:00',
    prix: 15000.00,
    classe: 'VIP',
    equipements: ['Climatisation', 'Wifi', 'Prises électriques', 'Toilettes'],
    placesTotales: 50,
    placesDisponibles: 50,
    jours: ['Lundi', 'Mercredi', 'Vendredi', 'Dimanche'],
    description: 'Retour confortable vers la capitale',
    actif: true
  },
  {
    depart: 'Brazzaville',
    destination: 'Pointe-Noire',
    heureDepart: '08:00:00',
    heureArrivee: '18:00:00',
    prix: 12000.00,
    classe: 'Standard',
    equipements: ['Climatisation', 'Prises électriques'],
    placesTotales: 45,
    placesDisponibles: 45,
    jours: ['Mardi', 'Jeudi', 'Samedi'],
    description: 'Trajet économique et fiable',
    actif: true
  },
  {
    depart: 'Pointe-Noire',
    destination: 'Dolisie',
    heureDepart: '09:00:00',
    heureArrivee: '11:30:00',
    prix: 5000.00,
    classe: 'Standard',
    equipements: ['Climatisation'],
    placesTotales: 35,
    placesDisponibles: 35,
    jours: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
    description: 'Liaison rapide vers Dolisie',
    actif: true
  },
  {
    depart: 'Dolisie',
    destination: 'Pointe-Noire',
    heureDepart: '12:00:00',
    heureArrivee: '14:30:00',
    prix: 5000.00,
    classe: 'Standard',
    equipements: ['Climatisation'],
    placesTotales: 35,
    placesDisponibles: 35,
    jours: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
    description: 'Retour depuis Dolisie',
    actif: true
  },
  {
    depart: 'Brazzaville',
    destination: 'Oyo',
    heureDepart: '07:30:00',
    heureArrivee: '10:00:00',
    prix: 7000.00,
    classe: 'Express',
    equipements: ['Climatisation', 'Wifi'],
    placesTotales: 30,
    placesDisponibles: 30,
    jours: ['Lundi', 'Mercredi', 'Vendredi', 'Samedi'],
    description: 'Trajet express vers Oyo',
    actif: true
  },
  {
    depart: 'Oyo',
    destination: 'Brazzaville',
    heureDepart: '10:30:00',
    heureArrivee: '13:00:00',
    prix: 7000.00,
    classe: 'Express',
    equipements: ['Climatisation', 'Wifi'],
    placesTotales: 30,
    placesDisponibles: 30,
    jours: ['Lundi', 'Mercredi', 'Vendredi', 'Samedi'],
    description: 'Retour express depuis Oyo',
    actif: true
  },
  {
    depart: 'Brazzaville',
    destination: 'Ouesso',
    heureDepart: '05:30:00',
    heureArrivee: '14:00:00',
    prix: 18000.00,
    classe: 'VIP',
    equipements: ['Climatisation', 'Wifi', 'Prises électriques', 'Toilettes', 'Sièges confortables'],
    placesTotales: 40,
    placesDisponibles: 40,
    jours: ['Mardi', 'Samedi'],
    description: 'Long trajet vers le nord avec tout le confort',
    actif: true
  },
  {
    depart: 'Ouesso',
    destination: 'Brazzaville',
    heureDepart: '15:00:00',
    heureArrivee: '23:30:00',
    prix: 18000.00,
    classe: 'VIP',
    equipements: ['Climatisation', 'Wifi', 'Prises électriques', 'Toilettes', 'Sièges confortables'],
    placesTotales: 40,
    placesDisponibles: 40,
    jours: ['Mercredi', 'Dimanche'],
    description: 'Retour depuis Ouesso',
    actif: true
  },
  {
    depart: 'Pointe-Noire',
    destination: 'Dolisie',
    heureDepart: '14:00:00',
    heureArrivee: '16:30:00',
    prix: 4500.00,
    classe: 'Standard',
    equipements: ['Climatisation'],
    placesTotales: 35,
    placesDisponibles: 35,
    jours: ['Samedi', 'Dimanche'],
    description: 'Trajet de fin de journée',
    actif: true
  },
  {
    depart: 'Brazzaville',
    destination: 'Pointe-Noire',
    heureDepart: '20:00:00',
    heureArrivee: '06:00:00',
    prix: 10000.00,
    classe: 'Standard',
    equipements: ['Climatisation', 'Prises électriques'],
    placesTotales: 45,
    placesDisponibles: 45,
    jours: ['Vendredi', 'Samedi'],
    description: 'Trajet de nuit économique',
    actif: true
  },
  {
    depart: 'Brazzaville',
    destination: 'Dolisie',
    heureDepart: '10:00:00',
    heureArrivee: '15:00:00',
    prix: 8000.00,
    classe: 'Express',
    equipements: ['Climatisation', 'Wifi', 'Prises électriques'],
    placesTotales: 38,
    placesDisponibles: 38,
    jours: ['Jeudi', 'Dimanche'],
    description: 'Liaison directe Brazzaville-Dolisie',
    actif: true
  }
];

const utilisateursData = [
  {
    nom: 'Admin BUS TRAVEL',
    email: 'admin@bustravel.cg',
    telephone: '+242065936820',
    motDePasse: 'admin123',
    role: 'admin',
    preferences: {
      classe: 'VIP',
      siege: 'Fenêtre'
    },
    actif: true
  },
  {
    nom: 'Jean Mbemba',
    email: 'jean.mbemba@email.com',
    telephone: '+242061234567',
    motDePasse: 'client123',
    role: 'client',
    preferences: {
      classe: 'Standard',
      siege: 'Fenêtre'
    },
    actif: true
  },
  {
    nom: 'Marie Nkoulou',
    email: 'marie.nkoulou@email.com',
    telephone: '+242062345678',
    motDePasse: 'client123',
    role: 'client',
    preferences: {
      classe: 'VIP',
      siege: 'Couloir'
    },
    actif: true
  }
];

// Fonction pour générer des dates de réservation
function genererDateReservation() {
  const aujourd = new Date();
  const futur = new Date();
  futur.setDate(aujourd.getDate() + Math.floor(Math.random() * 30) + 1);
  return futur;
}

// Fonction principale de seeding
async function seedMySQLDatabase() {
  try {
    console.log('🌱 Début du seeding de la base de données MySQL...');
    
    // Connexion à la base de données
    await sequelize.authenticate();
    console.log('✅ Connecté à MySQL');
    
    // Synchroniser et vider les tables
    await sequelize.sync({ force: true });
    console.log('🗑️ Tables synchronisées et vidées');
    
    // Insérer les trajets
    const trajets = await Trajet.bulkCreate(trajetsData);
    console.log(`✅ ${trajets.length} trajets créés`);
    
    // Insérer les utilisateurs
    const utilisateurs = await User.bulkCreate(utilisateursData);
    console.log(`✅ ${utilisateurs.length} utilisateurs créés`);
    
    // Générer des réservations exemple
    const reservationsData = [];
    const statuts = ['Confirmée', 'En attente', 'Terminée'];
    const methodesPaiement = ['Carte bancaire', 'Mobile Money', 'WhatsApp', 'Espèces'];
    
    for (let i = 0; i < 8; i++) {
      const trajet = trajets[Math.floor(Math.random() * trajets.length)];
      const utilisateur = utilisateurs[Math.floor(Math.random() * utilisateurs.length)];
      const nombrePlaces = Math.floor(Math.random() * 3) + 1;
      
      reservationsData.push({
        trajetId: trajet.id,
        userId: utilisateur.id,
        passagerNom: utilisateur.nom,
        passagerEmail: utilisateur.email,
        passagerTelephone: utilisateur.telephone,
        dateVoyage: genererDateReservation(),
        nombrePlaces: nombrePlaces,
        prixTotal: trajet.prix * nombrePlaces,
        statut: statuts[Math.floor(Math.random() * statuts.length)],
        paiementMethode: methodesPaiement[Math.floor(Math.random() * methodesPaiement.length)],
        paiementStatut: 'Payé',
        paiementReference: `REF${Math.floor(Math.random() * 1000000)}`,
        notes: 'Réservation générée automatiquement pour démonstration'
      });
    }
    
    const reservations = await Reservation.bulkCreate(reservationsData);
    console.log(`✅ ${reservations.length} réservations créées`);
    
    // Afficher un résumé
    console.log('\n📊 Résumé du seeding MySQL:');
    console.log(`   - Trajets: ${trajets.length}`);
    console.log(`   - Utilisateurs: ${utilisateurs.length}`);
    console.log(`   - Réservations: ${reservations.length}`);
    
    // Afficher les comptes de connexion
    console.log('\n🔑 Comptes de connexion:');
    console.log('   Admin:');
    console.log('     Email: admin@bustravel.cg');
    console.log('     Mot de passe: admin123');
    console.log('   Client test:');
    console.log('     Email: jean.mbemba@email.com');
    console.log('     Mot de passe: client123');
    
    console.log('\n🎉 Base de données MySQL générée avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors du seeding MySQL:', error);
  } finally {
    await sequelize.close();
    console.log('🔌 Déconnecté de MySQL');
  }
}

// Exécuter le seeding
if (require.main === module) {
  seedMySQLDatabase();
}

module.exports = { seedMySQLDatabase };
