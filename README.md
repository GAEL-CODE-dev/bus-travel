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
