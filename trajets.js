const express = require('express');
const router = express.Router();
const { Trajet, Reservation } = require('../models');

// GET - Récupérer tous les trajets avec filtres
router.get('/', async (req, res) => {
  try {
    const { 
      depart, 
      destination, 
      date, 
      classe, 
      prixMin, 
      prixMax,
      page = 1,
      limit = 10
    } = req.query;

    // Construction du filtre avec Sequelize
    const whereClause = { actif: true };
    
    if (depart) whereClause.depart = depart;
    if (destination) whereClause.destination = destination;
    if (classe) whereClause.classe = classe;
    if (prixMin || prixMax) {
      whereClause.prix = {};
      if (prixMin) whereClause.prix[require('sequelize').Op.gte] = parseFloat(prixMin);
      if (prixMax) whereClause.prix[require('sequelize').Op.lte] = parseFloat(prixMax);
    }

    const offset = (page - 1) * limit;
    const trajets = await Trajet.findAndCountAll({
      where: whereClause,
      order: [['prix', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: trajets.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: trajets.count,
        pages: Math.ceil(trajets.count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des trajets',
      error: error.message
    });
  }
});

// GET - Récupérer un trajet spécifique
router.get('/:id', async (req, res) => {
  try {
    const trajet = await Trajet.findById(req.params.id);
    
    if (!trajet) {
      return res.status(404).json({
        success: false,
        message: 'Trajet non trouvé'
      });
    }

    // Vérifier les places disponibles pour une date spécifique
    if (req.query.date) {
      const dateVoyage = new Date(req.query.date);
      const reservations = await Reservation.find({
        trajet: trajet._id,
        dateVoyage: {
          $gte: dateVoyage.setHours(0, 0, 0, 0),
          $lt: dateVoyage.setHours(23, 59, 59, 999)
        },
        statut: { $in: ['Confirmée', 'En attente'] }
      });

      const placesReservees = reservations.reduce((total, res) => total + res.nombrePlaces, 0);
      trajet.placesDisponibles = trajet.placesTotales - placesReservees;
    }

    res.json({
      success: true,
      data: trajet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du trajet',
      error: error.message
    });
  }
});

// POST - Créer un nouveau trajet (admin)
router.post('/', async (req, res) => {
  try {
    const trajet = new Trajet(req.body);
    await trajet.save();

    res.status(201).json({
      success: true,
      message: 'Trajet créé avec succès',
      data: trajet
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création du trajet',
      error: error.message
    });
  }
});

// PUT - Mettre à jour un trajet (admin)
router.put('/:id', async (req, res) => {
  try {
    const trajet = await Trajet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!trajet) {
      return res.status(404).json({
        success: false,
        message: 'Trajet non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Trajet mis à jour avec succès',
      data: trajet
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour du trajet',
      error: error.message
    });
  }
});

// DELETE - Supprimer un trajet (admin)
router.delete('/:id', async (req, res) => {
  try {
    const trajet = await Trajet.findByIdAndUpdate(
      req.params.id,
      { actif: false },
      { new: true }
    );

    if (!trajet) {
      return res.status(404).json({
        success: false,
        message: 'Trajet non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Trajet supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du trajet',
      error: error.message
    });
  }
});

// GET - Recherche de trajets
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const trajets = await Trajet.find({
      $or: [
        { depart: new RegExp(query, 'i') },
        { destination: new RegExp(query, 'i') },
        { description: new RegExp(query, 'i') }
      ],
      actif: true
    })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

    res.json({
      success: true,
      data: trajets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche',
      error: error.message
    });
  }
});

module.exports = router;
