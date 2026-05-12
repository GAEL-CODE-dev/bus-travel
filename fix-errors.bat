@echo off
echo 🔍 Diagnostic et correction des erreurs BUS TRAVEL...
echo.

echo 1️⃣ Installation des dépendances...
npm install

echo.
echo 2️⃣ Diagnostic du projet...
node debug-errors.js

echo.
echo 3️⃣ Test de connexion MySQL...
node test-connection.js

echo.
echo 4️⃣ Génération de la base de données...
npm run seed

echo.
echo 5️⃣ Test de l'email...
curl -s http://localhost:5000/api/contact/test-email

echo.
echo ✅ Corrections terminées!
echo.
echo 🚀 Pour démarrer le serveur: npm run dev
echo 🌐 Pour tester: http://localhost:5000/api/test

pause
