// RECHERCHE BILLETS
const searchInput = document.getElementById("searchInput");
const cards = document.querySelectorAll(".ticket-card");

searchInput.addEventListener("keyup", () => {

  const value = searchInput.value.toLowerCase();

  cards.forEach(card => {

    const text = card.innerText.toLowerCase();

    if(text.includes(value)){
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }

  });

});

// INTERACTION BOUTONS
document.querySelectorAll(".btn").forEach(btn => {

  btn.addEventListener("click", () => {

    btn.innerText = "Traitement...";

    setTimeout(() => {

      btn.innerText = "Réserver";

      alert("✅ Billet réservé avec succès !");

    }, 1500);

  });

});