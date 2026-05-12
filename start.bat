@echo off
echo 🚌 Démarrage de BUS TRAVEL Backend...
echo.

echo 📦 Installation des dépendances...
npm install

echo.
echo 🌱 Génération de la base de données...
npm run seed

echo.
echo 🚀 Démarrage du serveur...
npm run dev

pause
