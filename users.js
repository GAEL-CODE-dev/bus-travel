const express = require('express');
const router = express.Router();
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const validator = require('validator');

// Middleware pour vérifier le token JWT
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Accès non autorisé - Token manquant'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
};

// POST - Inscription
router.post('/inscription', async (req, res) => {
  try {
    const { nom, email, telephone, motDePasse } = req.body;

    // Validation
    if (!nom || !email || !telephone || !motDePasse) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont obligatoires'
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email invalide'
      });
    }

    if (motDePasse.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe doit contenir au moins 6 caractères'
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const utilisateurExistant = await User.findOne({
      $or: [{ email }, { telephone }]
    });

    if (utilisateurExistant) {
      return res.status(400).json({
        success: false,
        message: 'Un utilisateur avec cet email ou ce téléphone existe déjà'
      });
    }

    // Créer l'utilisateur
    const utilisateur = new User({
      nom,
      email: email.toLowerCase(),
      telephone,
      motDePasse
    });

    await utilisateur.save();

    // Générer le token
    const token = jwt.sign(
      { id: utilisateur._id, email: utilisateur.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      data: {
        utilisateur: utilisateur.toPublicJSON(),
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription',
      error: error.message
    });
  }
});

// POST - Connexion
router.post('/connexion', async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    // Validation
    if (!email || !motDePasse) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe sont obligatoires'
      });
    }

    // Trouver l'utilisateur avec le mot de passe
    const utilisateur = await User.findOne({ email: email.toLowerCase() }).select('+motDePasse');

    if (!utilisateur) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier le mot de passe
    const motDePasseValide = await utilisateur.verifierMotDePasse(motDePasse);

    if (!motDePasseValide) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier si le compte est actif
    if (!utilisateur.actif) {
      return res.status(401).json({
        success: false,
        message: 'Compte désactivé'
      });
    }

    // Mettre à jour la dernière connexion
    utilisateur.derniereConnexion = new Date();
    await utilisateur.save();

    // Générer le token
    const token = jwt.sign(
      { id: utilisateur._id, email: utilisateur.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        utilisateur: utilisateur.toPublicJSON(),
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
});

// GET - Profil utilisateur (protégé)
router.get('/profil', authMiddleware, async (req, res) => {
  try {
    const utilisateur = await User.findById(req.user.id).populate('reservations');

    if (!utilisateur) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      data: utilisateur.toPublicJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil',
      error: error.message
    });
  }
});

// PUT - Mettre à jour le profil (protégé)
router.put('/profil', authMiddleware, async (req, res) => {
  try {
    const { nom, telephone, preferences } = req.body;
    const updates = {};

    if (nom) updates.nom = nom;
    if (telephone) updates.telephone = telephone;
    if (preferences) updates.preferences = preferences;

    const utilisateur = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!utilisateur) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: utilisateur.toPublicJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil',
      error: error.message
    });
  }
});

// PUT - Changer le mot de passe (protégé)
router.put('/motdepasse', authMiddleware, async (req, res) => {
  try {
    const { motDePasseActuel, nouveauMotDePasse } = req.body;

    if (!motDePasseActuel || !nouveauMotDePasse) {
      return res.status(400).json({
        success: false,
        message: 'Les deux mots de passe sont obligatoires'
      });
    }

    if (nouveauMotDePasse.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Le nouveau mot de passe doit contenir au moins 6 caractères'
      });
    }

    // Vérifier le mot de passe actuel
    const utilisateur = await User.findById(req.user.id).select('+motDePasse');
    const motDePasseValide = await utilisateur.verifierMotDePasse(motDePasseActuel);

    if (!motDePasseValide) {
      return res.status(400).json({
        success: false,
        message: 'Mot de passe actuel incorrect'
      });
    }

    // Mettre à jour le mot de passe
    utilisateur.motDePasse = nouveauMotDePasse;
    await utilisateur.save();

    res.json({
      success: true,
      message: 'Mot de passe changé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors du changement de mot de passe',
      error: error.message
    });
  }
});

// POST - Mot de passe oublié
router.post('/motdepasse-oublie', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email est obligatoire'
      });
    }

    const utilisateur = await User.findOne({ email: email.toLowerCase() });

    if (!utilisateur) {
      // Pour des raisons de sécurité, on ne révèle pas si l'email existe
      return res.json({
        success: true,
        message: 'Si cet email existe, un email de réinitialisation a été envoyé'
      });
    }

    // Générer un token de réinitialisation
    const token = jwt.sign(
      { id: utilisateur._id, type: 'reset' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // TODO: Envoyer l'email de réinitialisation
    // Pour l'instant, on retourne le token en développement
    if (process.env.NODE_ENV === 'development') {
      res.json({
        success: true,
        message: 'Token de réinitialisation généré',
        token
      });
    } else {
      res.json({
        success: true,
        message: 'Si cet email existe, un email de réinitialisation a été envoyé'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la demande de réinitialisation',
      error: error.message
    });
  }
});

// DELETE - Supprimer le compte (protégé)
router.delete('/compte', authMiddleware, async (req, res) => {
  try {
    const utilisateur = await User.findByIdAndDelete(req.user.id);

    if (!utilisateur) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Compte supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du compte',
      error: error.message
    });
  }
});

// GET - Vérifier si un email existe
router.get('/verification/email/:email', async (req, res) => {
  try {
    const utilisateur = await User.findOne({ 
      email: req.params.email.toLowerCase() 
    });

    res.json({
      success: true,
      disponible: !utilisateur
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification',
      error: error.message
    });
  }
});

module.exports = router;
