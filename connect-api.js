// Script pour connecter le frontend à l'API backend
const fs = require('fs');
const path = require('path');

// Fonction pour intégrer l'API client dans les pages HTML
function integrateAPIClient() {
  const htmlFiles = [
    '../index.html',
    '../Destinations.html',
    '../horaires.html',
    '../billets.html',
    '../contacts.html'
  ];

  const apiClientScript = `
<script src="backend/api-client.js"></script>
<script>
// Initialisation de l'API au chargement
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚌 BUS TRAVEL API Client chargé');
  
  // Tester la connexion
  if (window.busTravelAPI) {
    window.busTravelAPI.getTrajets()
      .then(response => {
        console.log('✅ API connectée -', response.data.length, 'trajets trouvés');
      })
      .catch(error => {
        console.log('❌ Erreur API -', error.message);
      });
  }
});

// Fonctions utilitaires pour les formulaires
function handleReservationSubmit(event, formElement) {
  event.preventDefault();
  
  const formData = new FormData(formElement);
  const reservationData = {
    trajetId: formData.get('trajetId'),
    passager: {
      nom: formData.get('nom'),
      email: formData.get('email'),
      telephone: formData.get('telephone')
    },
    dateVoyage: formData.get('date'),
    nombrePlaces: parseInt(formData.get('places')),
    paiement: {
      methode: formData.get('paiement') || 'WhatsApp'
    }
  };
  
  window.busTravelAPI.makeReservation(reservationData)
    .then(response => {
      console.log('Réservation réussie:', response.data);
      // Rediriger ou afficher confirmation
      alert('🎫 Réservation confirmée! Numéro: ' + response.data.numeroReservation);
      formElement.reset();
    })
    .catch(error => {
      console.error('Erreur réservation:', error);
    });
}

// Rendre la fonction globale
window.handleReservationSubmit = handleReservationSubmit;
</script>`;

  htmlFiles.forEach(file => {
    try {
      const filePath = path.resolve(__dirname, file);
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Ajouter le script avant la balise </body>
        if (content.includes('</body>')) {
          content = content.replace('</body>', apiClientScript + '\n</body>');
          fs.writeFileSync(filePath, content);
          console.log(`✅ API client intégré dans ${file}`);
        }
      }
    } catch (error) {
      console.error(`❌ Erreur avec ${file}:`, error.message);
    }
  });
}

// Exécuter l'intégration
if (require.main === module) {
  console.log('🔗 Intégration de l\'API client...');
  integrateAPIClient();
  console.log('🎉 Intégration terminée!');
}

module.exports = { integrateAPIClient };
