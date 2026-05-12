const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuration du transporteur d'email
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Route pour envoyer le formulaire de contact
router.post('/send', async (req, res) => {
  try {
    const { nom, email, sujet, message } = req.body;

    // Validation des données
    if (!nom || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez remplir tous les champs obligatoires'
      });
    }

    // Email de validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez entrer une adresse email valide'
      });
    }

    // Contenu de l'email pour l'administrateur
    const adminEmailContent = `
      <h2>🚌 Nouveau message de contact - BUS TRAVEL</h2>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Informations du contact</h3>
        <p><strong>Nom:</strong> ${nom}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Sujet:</strong> ${sujet || 'Non spécifié'}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString('fr-CG', { timeZone: 'Africa/Brazzaville' })}</p>
      </div>
      
      <div style="background-color: #e9ecef; padding: 20px; border-radius: 8px;">
        <h3>Message</h3>
        <p style="white-space: pre-wrap; font-family: Arial, sans-serif;">${message}</p>
      </div>
      
      <div style="margin-top: 30px; padding: 15px; background-color: #007bff; color: white; border-radius: 8px; text-align: center;">
        <p>Ce message a été envoyé depuis le formulaire de contact du site BUS TRAVEL</p>
        <p>📍 Brazzaville, Congo | 📞 +242 06 593 6820</p>
      </div>
    `;

    // Contenu de l'email de confirmation pour l'utilisateur
    const userEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #007bff; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1>🚌 BUS TRAVEL</h1>
          <h2>Merci de nous avoir contacté!</h2>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
          <p>Bonjour ${nom},</p>
          
          <p>Nous avons bien reçu votre message et nous vous en remercions. Notre équipe va l'examiner et vous répondra dans les plus brefs délais.</p>
          
          <div style="background-color: white; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0;">
            <h3>Résumé de votre message:</h3>
            <p><strong>Sujet:</strong> ${sujet || 'Non spécifié'}</p>
            <p><strong>Date d'envoi:</strong> ${new Date().toLocaleString('fr-CG', { timeZone: 'Africa/Brazzaville' })}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p><strong>Nos coordonnées:</strong></p>
            <p>📧 contact@bustravel.cg</p>
            <p>📞 +242 06 593 6820</p>
            <p>📍 Brazzaville, Congo</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://wa.me/242065936820" style="background-color: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              <i class="fab fa-whatsapp"></i> Contactez-nous sur WhatsApp
            </a>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #6c757d; font-size: 12px;">
          <p>&copy; 2025 BUS TRAVEL - Tous droits réservés</p>
        </div>
      </div>
    `;

    // Envoyer l'email à l'administrateur
    const adminMailOptions = {
      from: `"BUS TRAVEL" <${process.env.EMAIL_USER}>`,
      to: process.env.COMPANY_EMAIL || 'contact@bustravel.cg',
      subject: `🚌 Nouveau contact: ${sujet || 'Message de ' + nom}`,
      html: adminEmailContent,
      replyTo: email
    };

    // Envoyer l'email de confirmation à l'utilisateur
    const userMailOptions = {
      from: `"BUS TRAVEL" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🚌 BUS TRAVEL - Confirmation de votre message',
      html: userEmailContent
    };

    // Envoyer les deux emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions)
    ]);

    res.status(200).json({
      success: true,
      message: 'Message envoyé avec succès! Vous recevrez une confirmation par email.'
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer plus tard.'
    });
  }
});

// Route de test pour vérifier la configuration email
router.get('/test-email', async (req, res) => {
  try {
    await transporter.verify();
    res.json({
      success: true,
      message: 'Configuration email valide',
      config: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER ? '***' : 'Non configuré'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur de configuration email',
      error: error.message
    });
  }
});

module.exports = router;
