const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

// Définition des modèles avec Sequelize

// Modèle Trajet
const Trajet = sequelize.define('Trajet', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  depart: {
    type: DataTypes.ENUM('Brazzaville', 'Pointe-Noire', 'Dolisie', 'Oyo', 'Ouesso'),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  destination: {
    type: DataTypes.ENUM('Brazzaville', 'Pointe-Noire', 'Dolisie', 'Oyo', 'Ouesso'),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  heureDepart: {
    type: DataTypes.TIME,
    allowNull: false,
    validate: {
      is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    }
  },
  heureArrivee: {
    type: DataTypes.TIME,
    allowNull: false,
    validate: {
      is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    }
  },
  prix: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  classe: {
    type: DataTypes.ENUM('Standard', 'VIP', 'Express'),
    defaultValue: 'Standard'
  },
  equipements: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  placesDisponibles: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
    validate: {
      min: 0
    }
  },
  placesTotales: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
    validate: {
      min: 1
    }
  },
  jours: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  actif: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  description: {
    type: DataTypes.STRING(200),
    validate: {
      len: [0, 200]
    }
  }
}, {
  tableName: 'trajets',
  indexes: [
    { fields: ['depart', 'destination'] },
    { fields: ['prix'] },
    { fields: ['classe'] },
    { fields: ['actif'] }
  ]
});

// Validation personnalisée
Trajet.beforeValidate((trajet) => {
  if (trajet.depart === trajet.destination) {
    throw new Error('La destination doit être différente du départ');
  }
});

// Modèle User
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  telephone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      is: /^(\+242|0)?[1-9]\d{8}$/
    }
  },
  motDePasse: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [6, 255]
    }
  },
  role: {
    type: DataTypes.ENUM('client', 'admin'),
    defaultValue: 'client'
  },
  preferences: {
    type: DataTypes.JSON,
    defaultValue: {
      classe: 'Standard',
      siege: 'Fenêtre'
    }
  },
  actif: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  derniereConnexion: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'users',
  indexes: [
    { fields: ['email'], unique: true },
    { fields: ['telephone'], unique: true },
    { fields: ['role'] }
  ]
});

// Méthodes pour le mot de passe
const bcrypt = require('bcryptjs');

User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.motDePasse = await bcrypt.hash(user.motDePasse, salt);
});

User.beforeUpdate(async (user) => {
  if (user.changed('motDePasse')) {
    const salt = await bcrypt.genSalt(10);
    user.motDePasse = await bcrypt.hash(user.motDePasse, salt);
  }
});

User.prototype.verifierMotDePasse = async function(motDePasse) {
  return await bcrypt.compare(motDePasse, this.motDePasse);
};

User.prototype.toPublicJSON = function() {
  const user = this.toJSON();
  delete user.motDePasse;
  return user;
};

// Modèle Reservation
const Reservation = sequelize.define('Reservation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numeroReservation: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  passagerNom: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  passagerEmail: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  passagerTelephone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      is: /^(\+242|0)?[1-9]\d{8}$/
    }
  },
  dateVoyage: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isAfter: new Date().toISOString()
    }
  },
  nombrePlaces: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 10
    }
  },
  prixTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  statut: {
    type: DataTypes.ENUM('En attente', 'Confirmée', 'Annulée', 'Terminée'),
    defaultValue: 'En attente'
  },
  paiementMethode: {
    type: DataTypes.ENUM('Carte bancaire', 'Mobile Money', 'Espèces', 'WhatsApp'),
    allowNull: false
  },
  paiementStatut: {
    type: DataTypes.ENUM('En attente', 'Payé', 'Remboursé'),
    defaultValue: 'En attente'
  },
  paiementReference: {
    type: DataTypes.STRING(100)
  },
  places: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  notes: {
    type: DataTypes.TEXT,
    validate: {
      len: [0, 500]
    }
  }
}, {
  tableName: 'reservations',
  indexes: [
    { fields: ['passagerEmail'] },
    { fields: ['numeroReservation'], unique: true },
    { fields: ['dateVoyage'] },
    { fields: ['statut'] }
  ]
});

// Génération automatique du numéro de réservation
Reservation.beforeCreate(async (reservation) => {
  const date = new Date();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  reservation.numeroReservation = `BT${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${random}`;
});

// Définition des associations
Reservation.belongsTo(Trajet, { foreignKey: 'trajetId', as: 'trajet' });
Trajet.hasMany(Reservation, { foreignKey: 'trajetId', as: 'reservations' });

User.hasMany(Reservation, { foreignKey: 'userId', as: 'reservations' });
Reservation.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Validation des places disponibles
Reservation.beforeCreate(async (reservation) => {
  const trajet = await Trajet.findByPk(reservation.trajetId);
  if (!trajet) {
    throw new Error('Trajet non trouvé');
  }
  
  // Calculer les places déjà réservées pour cette date
  const reservationsExistantes = await Reservation.findAll({
    where: {
      trajetId: reservation.trajetId,
      dateVoyage: reservation.dateVoyage,
      statut: ['Confirmée', 'En attente']
    }
  });
  
  const placesReservees = reservationsExistantes.reduce(
    (total, res) => total + res.nombrePlaces, 
    0
  );
  
  const placesDisponibles = trajet.placesTotales - placesReservees;
  
  if (placesDisponibles < reservation.nombrePlaces) {
    throw new Error(`Seulement ${placesDisponibles} places disponibles pour cette date`);
  }
  
  // Calculer le prix total
  reservation.prixTotal = trajet.prix * reservation.nombrePlaces;
});

module.exports = {
  sequelize,
  Trajet,
  User,
  Reservation
};
