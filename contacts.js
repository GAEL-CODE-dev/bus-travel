// FORMULAIRE DE CONTACT AVEC API
const form = document.getElementById("contactForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const button = form.querySelector("button");
  const originalText = button.innerText;
  
  // État de chargement
  button.innerText = "Envoi en cours...";
  button.disabled = true;

  try {
    // Récupérer les données du formulaire
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Envoyer à l'API
    const response = await fetch('http://localhost:5000/api/contact/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.success) {
      // Succès
      alert('✅ ' + result.message);
      form.reset();
    } else {
      // Erreur serveur
      alert('❌ ' + result.message);
    }

  } catch (error) {
    console.error('Erreur:', error);
    alert('❌ Une erreur est survenue. Veuillez réessayer plus tard.');
  } finally {
    // Restaurer le bouton
    button.innerText = originalText;
    button.disabled = false;
  }
});

// ANIMATION INPUTS
document.querySelectorAll("input, textarea").forEach(field => {

  field.addEventListener("focus", () => {

    field.style.boxShadow =
    "0 0 0 3px rgba(255,122,0,0.2)";

  });

  field.addEventListener("blur", () => {

    field.style.boxShadow = "none";

  });

});