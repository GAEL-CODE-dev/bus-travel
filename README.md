<<<<<<< HEAD
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
=======
# 🗄️ Base de Données BUS TRAVEL

Instructions pour générer et gérer la base de données MongoDB.

## 📋 Prérequis

1. **MongoDB installé** sur votre machine
2. **MongoDB en cours d'exécution**
3. **Variables d'environnement configurées** dans `.env`

## 🚀 Scripts Disponibles

### Initialisation complète
```bash
npm run setup
```
- Initialise la base de données
- Crée les index
- Remplit avec les données initiales

### Initialisation seule
```bash
npm run init-db
```
- Crée la structure de la base
- Configure les index pour optimisation

### Remplissage des données
```bash
npm run seed
```
- Ajoute les trajets, utilisateurs et réservations exemples

## 📊 Données Générées

### 🚌 Trajets (12 trajets)
- **Brazzaville ↔ Pointe-Noire** (VIP, Standard, Nuit)
- **Pointe-Noire ↔ Dolisie** (Standard)
- **Brazzaville ↔ Oyo** (Express)
- **Brazzaville ↔ Ouesso** (VIP)
- **Brazzaville ↔ Dolisie** (Express)

### 👥 Utilisateurs (3 comptes)
- **Admin**: `admin@bustravel.cg` / `admin123`
- **Client test**: `jean.mbemba@email.com` / `client123`
- **Client test**: `marie.nkoulou@email.com` / `client123`

### 📝 Réservations (8 exemples)
- Réservations avec différents statuts
- Dates futures variées
- Méthodes de paiement diverses

## 🔧 Configuration

### Variables d'environnement (.env)
```env
MONGODB_URI=mongodb://localhost:27017/bustravel
```

### Vérifier MongoDB
```bash
# Vérifier si MongoDB est en cours d'exécution
mongosh --eval "db.adminCommand('ismaster')"

# Démarrer MongoDB si nécessaire
mongod
```

## 📈 Structure de la Base

### Collections
- **trajets** - Routes et horaires des bus
- **users** - Comptes utilisateurs
- **reservations** - Réservations de billets

### Index Optimisés
- Recherche par ville de départ/destination
- Recherche par prix et classe
- Recherche rapide par email et numéro de réservation

## 🔄 Maintenance

### Vider la base de données
```bash
# Se connecter à MongoDB
mongosh bustravel

# Vider toutes les collections
db.trajets.deleteMany({})
db.users.deleteMany({})
db.reservations.deleteMany({})
```

### Régénérer les données
```bash
npm run setup
```

### Sauvegarder la base
```bash
mongodump --db bustravel --out backup/
```

### Restaurer la base
```bash
mongorestore --db bustravel backup/bustravel/
```

## 🐛 Dépannage

### Erreur de connexion MongoDB
```bash
# Vérifier que MongoDB est en cours d'exécution
sudo systemctl status mongod

# Redémarrer MongoDB
sudo systemctl restart mongod
```

### Erreur de permissions
```bash
# Donner les permissions nécessaires
sudo chown -R $USER:$USER /data/db
```

### Erreur de module
```bash
# Réinstaller les dépendances
npm install
```

## 📊 Statistiques après génération

- **Trajets**: 12 routes actives
- **Utilisateurs**: 3 comptes (1 admin, 2 clients)
- **Réservations**: 8 exemples variés
- **Prix**: 4,500 FCFA - 18,000 FCFA
- **Classes**: Standard, VIP, Express

## 🔍 Vérification

### Vérifier les données
```bash
# Se connecter à MongoDB
mongosh bustravel

# Compter les documents
db.trajets.countDocuments()
db.users.countDocuments()
db.reservations.countDocuments()

# Voir les trajets
db.trajets.find().pretty()
```

### Tester l'API
```bash
# Lancer le serveur
npm run dev

# Tester les endpoints
curl http://localhost:5000/api/trajets
curl http://localhost:5000/api/test
```

---

🎉 **Votre base de données est prête !** Utilisez `npm run setup` pour tout configurer en une seule commande.
>>>>>>> d80d0895dce6cb6937a33ca4cb3c726bacbdd7bb
