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

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var button = form.querySelector('button[type="submit"]');
    var originalText = button.innerHTML;

    button.innerHTML = '<i class="fas fa-paper-plane"></i> Préparation...';
    button.disabled = true;

    var formData = new FormData(form);
    var name = formData.get('nom') || '';
    var email = formData.get('email') || '';
    var subject = formData.get('sujet') || 'Demande BUS TRAVEL';
    var message = formData.get('message') || '';

    var mailtoSubject = encodeURIComponent(subject);
    var mailtoBody = encodeURIComponent(
      'Nom : ' + name + '\n' +
      'Email : ' + email + '\n\n' +
      message
    );

    window.location.href = 'mailto:contact@bustravel.cg?subject=' + mailtoSubject + '&body=' + mailtoBody;
    button.innerHTML = '<i class="fas fa-check-circle"></i> Ouvrir votre messagerie...';
    form.reset();
    button.disabled = false;
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

