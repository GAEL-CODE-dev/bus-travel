const mongoose = require('mongoose');

const trajetSchema = new mongoose.Schema({
  depart: {
    type: String,
    required: [true, 'La ville de départ est obligatoire'],
    enum: ['Brazzaville', 'Pointe-Noire', 'Dolisie', 'Oyo', 'Ouesso'],
    trim: true
  },
  destination: {
    type: String,
    required: [true, 'La ville de destination est obligatoire'],
    enum: ['Brazzaville', 'Pointe-Noire', 'Dolisie', 'Oyo', 'Ouesso'],
    trim: true
  },
  heureDepart: {
    type: String,
    required: [true, 'L\'heure de départ est obligatoire'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format d\'heure invalide (HH:MM)']
  },
  heureArrivee: {
    type: String,
    required: [true, 'L\'heure d\'arrivée est obligatoire'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format d\'heure invalide (HH:MM)']
  },
  prix: {
    type: Number,
    required: [true, 'Le prix est obligatoire'],
    min: [0, 'Le prix doit être positif']
  },
  classe: {
    type: String,
    enum: ['Standard', 'VIP', 'Express'],
    default: 'Standard'
  },
  equipements: [{
    type: String,
    enum: ['Climatisation', 'Wifi', 'Prises électriques', 'Toilettes', 'Sièges confortables']
  }],
  placesDisponibles: {
    type: Number,
    required: true,
    min: 0,
    default: 50
  },
  placesTotales: {
    type: Number,
    required: true,
    min: 1,
    default: 50
  },
  jours: [{
    type: String,
    enum: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
  }],
  actif: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    maxlength: [200, 'La description ne peut pas dépasser 200 caractères']
  }
}, {
  timestamps: true
});

// Index pour optimiser les recherches
trajetSchema.index({ depart: 1, destination: 1 });
trajetSchema.index({ prix: 1 });

// Validation personnalisée
trajetSchema.pre('save', function(next) {
  if (this.depart === this.destination) {
    next(new Error('La destination doit être différente du départ'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Trajet', trajetSchema);
