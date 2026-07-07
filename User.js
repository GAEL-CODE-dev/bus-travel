const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom est obligatoire'],
    trim: true,
    minlength: [2, 'Le nom doit contenir au moins 2 caractères']
  },
  email: {
    type: String,
    required: [true, 'L\'email est obligatoire'],
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide'],
    lowercase: true,
    trim: true
  },
  telephone: {
    type: String,
    required: [true, 'Le téléphone est obligatoire'],
    match: [/^(\+242|0)?[1-9]\d{8}$/, 'Numéro de téléphone congolais invalide']
  },
  motDePasse: {
    type: String,
    required: [true, 'Le mot de passe est obligatoire'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
    select: false
  },
  role: {
    type: String,
    enum: ['client', 'admin'],
    default: 'client'
  },
  reservations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation'
  }],
  preferences: {
    classe: {
      type: String,
      enum: ['Standard', 'VIP', 'Express'],
      default: 'Standard'
    },
    siege: {
      type: String,
      enum: ['Fenêtre', 'Couloir'],
      default: 'Fenêtre'
    }
  },
  actif: {
    type: Boolean,
    default: true
  },
  derniereConnexion: {
    type: Date
  }
}, {
  timestamps: true
});

// Index pour optimiser les recherches
userSchema.index({ email: 1 });
userSchema.index({ telephone: 1 });

// Hashage du mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
  // Ne hasher que si le mot de passe a été modifié
  if (!this.isModified('motDePasse')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour vérifier le mot de passe
userSchema.methods.verifierMotDePasse = async function(motDePasse) {
  return await bcrypt.compare(motDePasse, this.motDePasse);
};

// Méthode pour obtenir les informations publiques
userSchema.methods.toPublicJSON = function() {
  const user = this.toObject();
  delete user.motDePasse;
  return user;
};

module.exports = mongoose.model('User', userSchema);
