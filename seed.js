const mongoose = require('mongoose');
require('dotenv').config();

// Importer les modèles
const Trajet = require('../models/Trajet');
const User = require('../models/User');
const Reservation = require('../models/Reservation');

// Données initiales
const trajetsData = [
  {
    depart: 'Brazzaville',
    destination: 'Pointe-Noire',
    heureDepart: '06:00',
    heureArrivee: '16:00',
    prix: 15000,
    classe: 'VIP',
    equipements: ['Climatisation', 'Wifi', 'Prises électriques', 'Toilettes', 'Sièges confortables'],
    placesTotales: 50,
    placesDisponibles: 50,
    jours: ['Lundi', 'Mercredi', 'Vendredi', 'Dimanche'],
    description: 'Trajet premium avec tout le confort nécessaire'
  },
  {
    depart: 'Pointe-Noire',
    destination: 'Brazzaville',
    heureDepart: '07:00',
    heureArrivee: '17:00',
    prix: 15000,
    classe: 'VIP',
    equipements: ['Climatisation', 'Wifi', 'Prises électriques', 'Toilettes'],
    placesTotales: 50,
    placesDisponibles: 50,
    jours: ['Lundi', 'Mercredi', 'Vendredi', 'Dimanche'],
    description: 'Retour confortable vers la capitale'
  },
  {
    depart: 'Brazzaville',
    destination: 'Pointe-Noire',
    heureDepart: '08:00',
    heureArrivee: '18:00',
    prix: 12000,
    classe: 'Standard',
    equipements: ['Climatisation', 'Prises électriques'],
    placesTotales: 45,
    placesDisponibles: 45,
    jours: ['Mardi', 'Jeudi', 'Samedi'],
    description: 'Trajet économique et fiable'
  },
  {
    depart: 'Pointe-Noire',
    destination: 'Dolisie',
    heureDepart: '09:00',
    heureArrivee: '11:30',
    prix: 5000,
    classe: 'Standard',
    equipements: ['Climatisation'],
    placesTotales: 35,
    placesDisponibles: 35,
    jours: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
    description: 'Liaison rapide vers Dolisie'
  },
  {
    depart: 'Dolisie',
    destination: 'Pointe-Noire',
    heureDepart: '12:00',
    heureArrivee: '14:30',
    prix: 5000,
    classe: 'Standard',
    equipements: ['Climatisation'],
    placesTotales: 35,
    placesDisponibles: 35,
    jours: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
    description: 'Retour depuis Dolisie'
  },
  {
    depart: 'Brazzaville',
    destination: 'Oyo',
    heureDepart: '07:30',
    heureArrivee: '10:00',
    prix: 7000,
    classe: 'Express',
    equipements: ['Climatisation', 'Wifi'],
    placesTotales: 30,
    placesDisponibles: 30,
    jours: ['Lundi', 'Mercredi', 'Vendredi', 'Samedi'],
    description: 'Trajet express vers Oyo'
  },
  {
    depart: 'Oyo',
    destination: 'Brazzaville',
    heureDepart: '10:30',
    heureArrivee: '13:00',
    prix: 7000,
    classe: 'Express',
    equipements: ['Climatisation', 'Wifi'],
    placesTotales: 30,
    placesDisponibles: 30,
    jours: ['Lundi', 'Mercredi', 'Vendredi', 'Samedi'],
    description: 'Retour express depuis Oyo'
  },
  {
    depart: 'Brazzaville',
    destination: 'Ouesso',
    heureDepart: '05:30',
    heureArrivee: '14:00',
    prix: 18000,
    classe: 'VIP',
    equipements: ['Climatisation', 'Wifi', 'Prises électriques', 'Toilettes', 'Sièges confortables'],
    placesTotales: 40,
    placesDisponibles: 40,
    jours: ['Mardi', 'Samedi'],
    description: 'Long trajet vers le nord avec tout le confort'
  },
  {
    depart: 'Ouesso',
    destination: 'Brazzaville',
    heureDepart: '15:00',
    heureArrivee: '23:30',
    prix: 18000,
    classe: 'VIP',
    equipements: ['Climatisation', 'Wifi', 'Prises électriques', 'Toilettes', 'Sièges confortables'],
    placesTotales: 40,
    placesDisponibles: 40,
    jours: ['Mercredi', 'Dimanche'],
    description: 'Retour depuis Ouesso'
  },
  {
    depart: 'Pointe-Noire',
    destination: 'Dolisie',
    heureDepart: '14:00',
    heureArrivee: '16:30',
    prix: 4500,
    classe: 'Standard',
    equipements: ['Climatisation'],
    placesTotales: 35,
    placesDisponibles: 35,
    jours: ['Samedi', 'Dimanche'],
    description: 'Trajet de fin de journée'
  },
  {
    depart: 'Brazzaville',
    destination: 'Pointe-Noire',
    heureDepart: '20:00',
    heureArrivee: '06:00',
    prix: 10000,
    classe: 'Standard',
    equipements: ['Climatisation', 'Prises électriques'],
    placesTotales: 45,
    placesDisponibles: 45,
    jours: ['Vendredi', 'Samedi'],
    description: 'Trajet de nuit économique'
  },
  {
    depart: 'Brazzaville',
    destination: 'Dolisie',
    heureDepart: '10:00',
    heureArrivee: '15:00',
    prix: 8000,
    classe: 'Express',
    equipements: ['Climatisation', 'Wifi', 'Prises électriques'],
    placesTotales: 38,
    placesDisponibles: 38,
    jours: ['Jeudi', 'Dimanche'],
    description: 'Liaison directe Brazzaville-Dolisie'
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
    }
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
    }
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
    }
  }
];

// Fonction pour générer des dates de réservation
function genererDateReservation() {
  const aujourd = new Date();
  const futur = new Date();
  futur.setDate(aujourd.getDate() + Math.floor(Math.random() * 30) + 1);
  return futur;
}

// Fonction pour générer des réservations exemple
function genererReservationsExemple(trajets, utilisateurs) {
  const reservations = [];
  const statuts = ['Confirmée', 'En attente', 'Terminée'];
  const methodesPaiement = ['Carte bancaire', 'Mobile Money', 'WhatsApp', 'Espèces'];
  
  // Générer quelques réservations exemples
  for (let i = 0; i < 8; i++) {
    const trajet = trajets[Math.floor(Math.random() * trajets.length)];
    const utilisateur = utilisateurs[Math.floor(Math.random() * utilisateurs.length)];
    const nombrePlaces = Math.floor(Math.random() * 3) + 1;
    
    reservations.push({
      trajet: trajet._id,
      passager: {
        nom: utilisateur.nom,
        email: utilisateur.email,
        telephone: utilisateur.telephone
      },
      dateVoyage: genererDateReservation(),
      nombrePlaces: nombrePlaces,
      prixTotal: trajet.prix * nombrePlaces,
      statut: statuts[Math.floor(Math.random() * statuts.length)],
      paiement: {
        methode: methodesPaiement[Math.floor(Math.random() * methodesPaiement.length)],
        statut: 'Payé',
        reference: `REF${Math.floor(Math.random() * 1000000)}`
      },
      notes: 'Réservation générée automatiquement pour démonstration'
    });
  }
  
  return reservations;
}

// Fonction principale de seeding
async function seedDatabase() {
  try {
    console.log('🌱 Début du seeding de la base de données...');
    
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');
    
    // Vider les collections existantes
    await Promise.all([
      Trajet.deleteMany({}),
      User.deleteMany({}),
      Reservation.deleteMany({})
    ]);
    console.log('🗑️ Collections vidées');
    
    // Insérer les trajets
    const trajets = await Trajet.insertMany(trajetsData);
    console.log(`✅ ${trajets.length} trajets créés`);
    
    // Insérer les utilisateurs
    const utilisateurs = await User.insertMany(utilisateursData);
    console.log(`✅ ${utilisateurs.length} utilisateurs créés`);
    
    // Générer et insérer des réservations exemple
    const reservationsData = genererReservationsExemple(trajets, utilisateurs);
    const reservations = await Reservation.insertMany(reservationsData);
    console.log(`✅ ${reservations.length} réservations créées`);
    
    // Afficher un résumé
    console.log('\n📊 Résumé du seeding:');
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
    
    console.log('\n🎉 Base de données générée avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le seeding
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
