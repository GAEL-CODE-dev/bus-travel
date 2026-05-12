const express = require('express');
const router = express.Router();
const { Reservation, Trajet, User } = require('../models');
const nodemailer = require('nodemailer');

// Configuration email
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// GET - Récupérer toutes les réservations (admin)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, statut } = req.query;
    const filtre = {};
    
    if (statut) filtre.statut = statut;

    const reservations = await Reservation.find(filtre)
      .populate('trajet')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Reservation.countDocuments(filtre);

    res.json({
      success: true,
      data: reservations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des réservations',
      error: error.message
    });
  }
});

// GET - Récupérer les réservations d'un passager
router.get('/passager/:email', async (req, res) => {
  try {
    const reservations = await Reservation.find({
      'passager.email': req.params.email.toLowerCase()
    })
    .populate('trajet')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des réservations',
      error: error.message
    });
  }
});

// GET - Récupérer une réservation par son numéro
router.get('/numero/:numero', async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      numeroReservation: req.params.numero
    }).populate('trajet');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la réservation',
      error: error.message
    });
  }
});

// POST - Créer une nouvelle réservation
router.post('/', async (req, res) => {
  try {
    const {
      trajet: trajetId,
      passager,
      dateVoyage,
      nombrePlaces,
      paiement
    } = req.body;

    // Vérifier si le trajet existe
    const trajet = await Trajet.findById(trajetId);
    if (!trajet) {
      return res.status(404).json({
        success: false,
        message: 'Trajet non trouvé'
      });
    }

    // Vérifier les places disponibles
    const reservationsExistantes = await Reservation.find({
      trajet: trajetId,
      dateVoyage: new Date(dateVoyage),
      statut: { $in: ['Confirmée', 'En attente'] }
    });

    const placesReservees = reservationsExistantes.reduce(
      (total, res) => total + res.nombrePlaces, 
      0
    );

    const placesDisponibles = trajet.placesTotales - placesReservees;
    
    if (placesDisponibles < nombrePlaces) {
      return res.status(400).json({
        success: false,
        message: `Seulement ${placesDisponibles} places disponibles pour cette date`
      });
    }

    // Calculer le prix total
    const prixTotal = trajet.prix * nombrePlaces;

    // Créer la réservation
    const reservation = new Reservation({
      trajet: trajetId,
      passager,
      dateVoyage: new Date(dateVoyage),
      nombrePlaces,
      prixTotal,
      paiement
    });

    await reservation.save();

    // Envoyer l'email de confirmation
    await envoyerEmailConfirmation(reservation, trajet);

    res.status(201).json({
      success: true,
      message: 'Réservation créée avec succès',
      data: reservation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création de la réservation',
      error: error.message
    });
  }
});

// PUT - Mettre à jour une réservation
router.put('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('trajet');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Réservation mise à jour avec succès',
      data: reservation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la réservation',
      error: error.message
    });
  }
});

// PUT - Annuler une réservation
router.put('/:id/annuler', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate('trajet');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    if (reservation.statut === 'Annulée') {
      return res.status(400).json({
        success: false,
        message: 'Réservation déjà annulée'
      });
    }

    if (reservation.statut === 'Terminée') {
      return res.status(400).json({
        success: false,
        message: 'Impossible d\'annuler une réservation terminée'
      });
    }

    // Remettre les places à disposition
    const trajet = await Trajet.findById(reservation.trajet._id);
    trajet.placesDisponibles += reservation.nombrePlaces;
    await trajet.save();

    // Mettre à jour le statut
    reservation.statut = 'Annulée';
    await reservation.save();

    // Envoyer l'email d'annulation
    await envoyerEmailAnnulation(reservation, trajet);

    res.json({
      success: true,
      message: 'Réservation annulée avec succès',
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'annulation de la réservation',
      error: error.message
    });
  }
});

// DELETE - Supprimer une réservation (admin)
router.delete('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Réservation supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la réservation',
      error: error.message
    });
  }
});

// Fonction pour envoyer l'email de confirmation
async function envoyerEmailConfirmation(reservation, trajet) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: reservation.passager.email,
      subject: `Confirmation de réservation - ${reservation.numeroReservation}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a2a6c;">🚌 BUS TRAVEL</h2>
          <h3 style="color: #ff7a00;">Confirmation de réservation</h3>
          
          <p><strong>Numéro de réservation:</strong> ${reservation.numeroReservation}</p>
          <p><strong>Trajet:</strong> ${trajet.depart} → ${trajet.destination}</p>
          <p><strong>Date:</strong> ${new Date(reservation.dateVoyage).toLocaleDateString('fr-FR')}</p>
          <p><strong>Heure:</strong> ${trajet.heureDepart}</p>
          <p><strong>Nombre de places:</strong> ${reservation.nombrePlaces}</p>
          <p><strong>Prix total:</strong> ${reservation.prixTotal} FCFA</p>
          <p><strong>Statut:</strong> ${reservation.statut}</p>
          
          <div style="background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <p style="margin: 0;"><strong>Nom:</strong> ${reservation.passager.nom}</p>
            <p style="margin: 0;"><strong>Téléphone:</strong> ${reservation.passager.telephone}</p>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Merci de faire confiance à BUS TRAVEL pour vos voyages au Congo-Brazzaville.
          </p>
          
          <p style="color: #ff7a00; font-weight: bold;">
            Contact: +242 06 593 6820 | contact@bustravel.cg
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Erreur envoi email confirmation:', error);
  }
}

// Fonction pour envoyer l'email d'annulation
async function envoyerEmailAnnulation(reservation, trajet) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: reservation.passager.email,
      subject: `Annulation de réservation - ${reservation.numeroReservation}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a2a6c;">🚌 BUS TRAVEL</h2>
          <h3 style="color: #ff7a00;">Annulation de réservation</h3>
          
          <p>Votre réservation a été annulée avec succès.</p>
          
          <p><strong>Numéro de réservation:</strong> ${reservation.numeroReservation}</p>
          <p><strong>Trajet:</strong> ${trajet.depart} → ${trajet.destination}</p>
          <p><strong>Date:</strong> ${new Date(reservation.dateVoyage).toLocaleDateString('fr-FR')}</p>
          <p><strong>Montant remboursé:</strong> ${reservation.prixTotal} FCFA</p>
          
          <p style="color: #666; font-size: 14px;">
            Nous espérons vous revoir prochainement pour vos voyages.
          </p>
          
          <p style="color: #ff7a00; font-weight: bold;">
            Contact: +242 06 593 6820 | contact@bustravel.cg
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Erreur envoi email annulation:', error);
  }
}

module.exports = router;
