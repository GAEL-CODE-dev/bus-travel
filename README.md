# BUS TRAVEL

Site vitrine de transport interurbain au Congo-Brazzaville. BUS TRAVEL relie les principales villes du pays avec des bus modernes, confortables et ponctuels.

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Accueil — presentation de la compagnie, statistiques, valeurs, horaires |
| `Destinations.html` | Destinations desservies (Brazzaville, Pointe-Noire, Dolisie, Ouesso, etc.) |
| `horaires.html` | Grille complete des departs et arrivees |
| `billets.html` | Tarifs et classes de bus (Standard, VIP, Express) |
| `contacts.html` | Formulaire de contact, coordonnees, WhatsApp |

## Structure du projet

```
/
├── index.html              # Page d'accueil
├── style.css               # Styles globaux
├── script.js               # Interactions globales
├── Destinations.html/css   # Page destinations
├── horaires.html/css       # Page horaires
├── billets.html/css/js     # Page tarifs
├── contacts.html/css/js    # Page contact
├── images/                 # Images des destinations
└── backend/                # API NestJS (contact)
    ├── src/
    │   ├── main.ts
    │   ├── app.module.ts
    │   ├── config/         # Prisma service
    │   └── modules/contact/# Module contact
    ├── prisma/             # Schema SQLite
    ├── package.json
    └── .env
```

## Stack technique

- **Frontend :** HTML5, CSS3, JavaScript vanilla (AOS animations, Font Awesome)
- **Backend :** NestJS, Prisma (SQLite), Nodemailer
- **Design :** Glassmorphism, gradients, responsive, W3C valide

## Installation

```bash
# Backend (contact)
cd backend
npm install
npx prisma migrate dev --name init
npm run start:dev
```

Le backend ecoute sur `http://localhost:5000`. La documentation Swagger est accessible sur `/api/docs`.

Le frontend s'ouvre simplement en double-cliquant sur `index.html` ou via un serveur local (Live Server, etc.).

## Ameliorations futures

- **Galerie photos** — Ajouter une galerie d'images des bus, des agences et des destinations
- **Temoignages clients** — Section temoignages avec photos et notes
- **Blog / actualites** — Articles sur les voyages, les destinations et les evenements au Congo
- **Multilingue** — Support francais / anglais / lingala
- **FAQ interactive** — Page de questions frequentes avec accordeon
- **Newsletter** — Inscription par email pour les offres et actualites
- **Reservation en ligne** — Systeme de reservation avec paiement Mobile Money et Stripe
- **Espace client** — Compte utilisateur pour suivre ses reservations
- **Application mobile** — Version mobile native (React Native / Flutter)
- **SEO avance** — Blog, plan du site XML, schema.org, rich snippets
- **Accessibilite** — Audit RGAA, navigation clavier, contraste renforce
- **Performance** — Lazy loading, compression images, CDN, cache
- **Dark mode** — Theme sombre avec bouton de bascule
- **Live tracking** — Suivi GPS des bus en temps reel
- **Dashboard admin** — Interface de gestion des trajets, horaires et messages
- **WebSocket** — Notifications en temps reel pour les messages de contact

## Licence

Projet prive — BUS TRAVEL
