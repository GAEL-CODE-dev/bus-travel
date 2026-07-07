<<<<<<< HEAD
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
=======
//pour header
// ==========================
// MENU MOBILE
// ==========================
const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");

menuToggle.addEventListener("click", () => {
  menu.classList.toggle("active");
});

// ==========================
// FERMER MENU APRÈS CLIC
// ==========================
document.querySelectorAll(".menu a").forEach(link => {
  link.addEventListener("click", () => {
    menu.classList.remove("active");
  });
});

// ==========================
// HEADER SCROLL EFFECT
// ==========================
const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// ==========================
// LIEN ACTIF (NAVIGATION)
// ==========================
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".menu a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });
});

// ==========================
// SCROLL DOUX
// ==========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));

    if (target) {
      target.scrollIntoView({
        behavior: "smooth"
      });
    }
  });
});

// Message après réservation
document.querySelector("form").addEventListener("submit", function(e){
  e.preventDefault();

  alert("✅ Réservation envoyée avec succès !");
});

// Animation bouton (feedback UX)
document.querySelector(".btn").addEventListener("click", function(){
  this.innerText = "Traitement...";
  setTimeout(() => {
    this.innerText = "Confirmer";
  }, 2000);
});

// Bouton retour en haut
const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", () => {
  topBtn.style.display = window.scrollY > 300 ? "block" : "none";
});

topBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// Animation hover dynamique (socials)
document.querySelectorAll(".socials a").forEach(icon => {
  icon.addEventListener("mouseenter", () => {
    icon.style.transform = "scale(1.2)";
  });
  icon.addEventListener("mouseleave", () => {
    icon.style.transform = "scale(1)";
  });
});
>>>>>>> d80d0895dce6cb6937a33ca4cb3c726bacbdd7bb
