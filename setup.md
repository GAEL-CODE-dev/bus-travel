# 🚀 Démarrage Rapide - BUS TRAVEL

## 📋 Étapes pour Connecter votre Projet

### 1️⃣ Prérequis
- **MySQL** installé sur votre machine
- **Node.js** 16+ installé

### 2️⃣ Configuration MySQL

Ouvrez MySQL et exécutez :
```sql
CREATE DATABASE bustravel;
```

### 3️⃣ Configuration du Backend

1. **Ouvrez un terminal** dans le dossier `backend`
2. **Exécutez le script automatique** :
   ```bash
   start.bat
   ```

Ou manuellement :

```bash
# Installation des dépendances
npm install

# Génération des données
npm run seed

# Démarrage du serveur
npm run dev
```

### 4️⃣ Vérification

Le serveur devrait afficher :
```
✅ Connecté à MySQL
✅ Base de données MySQL synchronisée
🚀 Serveur démarré sur le port 5000
📊 API disponible sur http://localhost:5000/api
🗄️ Base de données: MySQL
```

### 5️⃣ Test de l'API

Ouvrez votre navigateur et testez :
- http://localhost:5000/api/test
- http://localhost:5000/api/trajets

## 🔧 Si Problèmes

### ❌ Erreur de connexion MySQL
- Vérifiez que MySQL est démarré
- Vérifiez vos identifiants dans `.env`

### ❌ Base de données vide
- Exécutez : `npm run seed`

### ❌ Port déjà utilisé
- Changez le port dans `.env` : `PORT=5001`

## 📊 Données Initiales

Après installation, vous aurez :
- **12 trajets** disponibles
- **3 comptes utilisateurs**
- **8 réservations exemples**

### Comptes de test :
- **Admin** : admin@bustravel.cg / admin123
- **Client** : jean.mbemba@email.com / client123

## 🎯 Prochaines Étapes

1. ✅ Backend connecté à MySQL
2. 🔄 Intégrer le frontend avec l'API
3. 🔄 Tester les réservations

---

🚌 **BUS TRAVEL est prêt !** 🇨🇬
