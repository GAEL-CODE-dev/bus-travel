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

  var searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keyup', function () {
      var value = this.value.toLowerCase();
      document.querySelectorAll('.pricing-table tbody tr').forEach(function (row) {
        var text = row.innerText.toLowerCase();
        row.style.display = text.includes(value) ? '' : 'none';
      });
    });
  }
})();
