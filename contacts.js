<<<<<<< HEAD
(function () {
  'use strict';

  var menuToggle = document.querySelector('.menu-toggle');
  var menu = document.querySelector('.menu');
  if (menuToggle && menu) {
    var overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
    menuToggle.addEventListener('click', function () {
      menu.classList.toggle('active');
      overlay.classList.toggle('active');
      document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });
    overlay.addEventListener('click', function () {
      menu.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
    document.querySelectorAll('.menu a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  var topBtn = document.getElementById('topBtn');
  if (topBtn) {
    window.addEventListener('scroll', function () {
      topBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    });
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  var form = document.getElementById('contactForm');

  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    var button = form.querySelector('button[type="submit"]');
    var originalText = button.innerHTML;

    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    button.disabled = true;

    try {
      var formData = new FormData(form);
      var data = Object.fromEntries(formData.entries());

      var response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      var result = await response.json();

      if (result.success) {
        button.innerHTML = '<i class="fas fa-check-circle"></i> Message envoye !';
        button.style.background = '#10b981';
        form.reset();
      } else {
        button.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + (result.message || 'Erreur');
        button.style.background = '#ef4444';
      }
    } catch (error) {
      console.error('Erreur:', error);
      button.innerHTML = '<i class="fas fa-exclamation-circle"></i> Erreur de connexion';
      button.style.background = '#ef4444';
    } finally {
      setTimeout(function () {
        button.innerHTML = originalText;
        button.style.background = '';
        button.disabled = false;
      }, 3000);
    }
  });

  document.querySelectorAll('input, textarea').forEach(function (field) {
    field.addEventListener('focus', function () {
      this.style.boxShadow = '0 0 0 4px rgba(255,122,0,0.1)';
    });
    field.addEventListener('blur', function () {
      this.style.boxShadow = 'none';
    });
  });
})();
=======
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
>>>>>>> d80d0895dce6cb6937a33ca4cb3c726bacbdd7bb
