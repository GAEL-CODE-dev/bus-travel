(function () {
  'use strict';

  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');
  const header = document.querySelector('.header');

  if (menuToggle && menu) {
    const overlay = document.createElement('div');
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

  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  var topBtn = document.getElementById('topBtn');
  if (topBtn) {
    window.addEventListener('scroll', function () {
      topBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    });
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function animateCounters() {
    var counters = document.querySelectorAll('.stat-number');
    counters.forEach(function (counter) {
      var target = parseInt(counter.getAttribute('data-count'));
      if (!target) return;
      var current = 0;
      var increment = Math.ceil(target / 40);
      var timer = setInterval(function () {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = current;
      }, 40);
    });
  }

  var statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounters();
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });
    observer.observe(statsSection);
  }

  document.querySelectorAll('.feature-card').forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      var icon = this.querySelector('.feature-icon');
      if (icon) icon.style.transform = 'scale(1.1) rotate(-5deg)';
    });
    card.addEventListener('mouseleave', function () {
      var icon = this.querySelector('.feature-icon');
      if (icon) icon.style.transform = '';
    });
  });
})();
