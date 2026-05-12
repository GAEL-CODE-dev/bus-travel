const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  trajet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trajet',
    required: [true, 'Le trajet est obligatoire']
  },
  passager: {
    nom: {
      type: String,
      required: [true, 'Le nom du passager est obligatoire'],
      trim: true,
      minlength: [2, 'Le nom doit contenir au moins 2 caractères']
    },
    email: {
      type: String,
      required: [true, 'L\'email est obligatoire'],
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide'],
      lowercase: true,
      trim: true
    },
    telephone: {
      type: String,
      required: [true, 'Le téléphone est obligatoire'],
      match: [/^(\+242|0)?[1-9]\d{8}$/, 'Numéro de téléphone congolais invalide']
    }
  },
  dateVoyage: {
    type: Date,
    required: [true, 'La date de voyage est obligatoire'],
    min: [new Date(), 'La date de voyage ne peut pas être dans le passé']
  },
  nombrePlaces: {
    type: Number,
    required: [true, 'Le nombre de places est obligatoire'],
    min: [1, 'Au moins une place est requise'],
    max: [10, 'Maximum 10 places par réservation']
  },
  prixTotal: {
    type: Number,
    required: true,
    min: 0
  },
  statut: {
    type: String,
    enum: ['En attente', 'Confirmée', 'Annulée', 'Terminée'],
    default: 'En attente'
  },
  numeroReservation: {
    type: String,
    unique: true,
    required: true
  },
  places: [{
    numero: {
      type: Number,
      required: true
    },
    nomPassager: {
      type: String,
      required: true
    }
  }],
  paiement: {
    methode: {
      type: String,
      enum: ['Carte bancaire', 'Mobile Money', 'Espèces', 'WhatsApp'],
      required: true
    },
    statut: {
      type: String,
      enum: ['En attente', 'Payé', 'Remboursé'],
      default: 'En attente'
    },
    reference: {
      type: String,
      trim: true
    }
  },
  notes: {
    type: String,
    maxlength: [500, 'Les notes ne peuvent pas dépasser 500 caractères']
  }
}, {
  timestamps: true
});

// Index pour optimiser les recherches
reservationSchema.index({ 'passager.email': 1 });
reservationSchema.index({ numeroReservation: 1 });
reservationSchema.index({ dateVoyage: 1 });

// Génération automatique du numéro de réservation
reservationSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.numeroReservation = `BT${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${random}`;
  }
  next();
});

// Validation des places disponibles
reservationSchema.pre('save', async function(next) {
  if (this.isNew) {
    const Trajet = mongoose.model('Trajet');
    const trajet = await Trajet.findById(this.trajet);
    
    if (!trajet) {
      return next(new Error('Trajet non trouvé'));
    }
    
    if (trajet.placesDisponibles < this.nombrePlaces) {
      return next(new Error(`Seulement ${trajet.placesDisponibles} places disponibles`));
    }
    
    // Mise à jour des places disponibles
    trajet.placesDisponibles -= this.nombrePlaces;
    await trajet.save();
  }
  next();
});

module.exports = mongoose.model('Reservation', reservationSchema);
