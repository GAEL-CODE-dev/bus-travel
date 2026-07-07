// Script de diagnostic des erreurs du projet
const fs = require('fs');
const path = require('path');

console.log('🔍 Diagnostic des erreurs BUS TRAVEL...\n');

// 1. Vérifier les fichiers essentiels
const fichiersEssentiels = [
  'package.json',
  '.env',
  'server.js',
  'config/database.js',
  'models/index.js',
  'routes/trajets.js',
  'routes/reservations.js',
  'routes/users.js',
  'routes/contact.js'
];

console.log('1️⃣ Vérification des fichiers essentiels:');
fichiersEssentiels.forEach(fichier => {
  const chemin = path.join(__dirname, fichier);
  if (fs.existsSync(chemin)) {
    console.log(`   ✅ ${fichier}`);
  } else {
    console.log(`   ❌ ${fichier} - MANQUANT`);
  }
});

// 2. Vérifier les dépendances
console.log('\n2️⃣ Vérification des dépendances:');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  const deps = packageJson.dependencies || {};
  
  const depsEssentielles = ['express', 'mysql2', 'sequelize', 'nodemailer', 'bcryptjs', 'jsonwebtoken'];
  depsEssentielles.forEach(dep => {
    if (deps[dep]) {
      console.log(`   ✅ ${dep}@${deps[dep]}`);
    } else {
      console.log(`   ❌ ${dep} - MANQUANTE`);
    }
  });
} catch (error) {
  console.log('   ❌ Erreur lecture package.json:', error.message);
}

// 3. Vérifier la configuration .env
console.log('\n3️⃣ Vérification .env:');
try {
  require('dotenv').config();
  
  const varsEssentielles = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'EMAIL_HOST', 'EMAIL_USER'];
  varsEssentielles.forEach(v => {
    if (process.env[v]) {
      console.log(`   ✅ ${v}: ${v.includes('PASS') ? '***' : process.env[v]}`);
    } else {
      console.log(`   ❌ ${v} - NON DÉFINIE`);
    }
  });
} catch (error) {
  console.log('   ❌ Erreur .env:', error.message);
}

// 4. Vérifier la syntaxe des fichiers JS
console.log('\n4️⃣ Vérification syntaxe JavaScript:');
const fichiersJS = [
  'config/database.js',
  'models/index.js',
  'server.js',
  'routes/trajets.js',
  'routes/reservations.js',
  'routes/users.js',
  'routes/contact.js'
];

fichiersJS.forEach(fichier => {
  try {
    const chemin = path.join(__dirname, fichier);
    if (fs.existsSync(chemin)) {
      require(chemin);
      console.log(`   ✅ ${fichier}`);
    }
  } catch (error) {
    console.log(`   ❌ ${fichier}: ${error.message}`);
  }
});

// 5. Vérifier les imports ES6 vs CommonJS
console.log('\n5️⃣ Vérification des imports:');
fichiersJS.forEach(fichier => {
  try {
    const contenu = fs.readFileSync(path.join(__dirname, fichier), 'utf8');
    if (contenu.includes('import ') && contenu.includes('from ')) {
      console.log(`   ⚠️  ${fichier} - Utilise ES6 (devrait être CommonJS)`);
    } else if (contenu.includes('require(')) {
      console.log(`   ✅ ${fichier} - Utilise CommonJS`);
    }
  } catch (error) {
    console.log(`   ❌ ${fichier}: Erreur lecture`);
  }
});

// 6. Vérifier les modèles
console.log('\n6️⃣ Vérification des modèles:');
try {
  const { sequelize, testConnection } = require('./config/database');
  testConnection().then(() => {
    console.log('   ✅ Connexion MySQL OK');
    
    const { Trajet, User, Reservation } = require('./models');
    console.log('   ✅ Modèles chargés');
    console.log(`   📊 Trajets: ${Trajet ? 'OK' : 'MANQUANT'}`);
    console.log(`   👥 Users: ${User ? 'OK' : 'MANQUANT'}`);
    console.log(`   📝 Reservations: ${Reservation ? 'OK' : 'MANQUANT'}`);
    
  }).catch(error => {
    console.log(`   ❌ Erreur modèles: ${error.message}`);
  });
} catch (error) {
  console.log(`   ❌ Erreur configuration DB: ${error.message}`);
}

console.log('\n🎯 Recommandations:');
console.log('   1. Assurez-vous que MySQL est installé et démarré');
console.log('   2. Créez la base de données: CREATE DATABASE bustravel;');
console.log('   3. Configurez correctement .env avec vos identifiants');
console.log('   4. Exécutez: npm install');
console.log('   5. Exécutez: npm run seed');

console.log('\n🔧 Si problèmes persistent:');
console.log('   - Vérifiez la version de Node.js (16+ requis)');
console.log('   - Redémarrez votre terminal');
console.log('   - Supprimez node_modules et réinstallez');

console.log('\n✅ Diagnostic terminé!');
