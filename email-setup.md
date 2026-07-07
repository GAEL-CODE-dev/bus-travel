# 📧 Configuration Email - BUS TRAVEL

## 🚀 Pour Recevoir les Emails du Formulaire de Contact

### 1️⃣ **Configurer Gmail (recommandé)**

#### Étape A: Activer l'authentification 2 facteurs
1. Allez dans votre compte Gmail
2. Paramètres → Sécurité
3. Activez l'authentification à deux facteurs

#### Étape B: Générer un mot de passe d'application
1. Allez dans: https://myaccount.google.com/apppasswords
2. Sélectionnez "Autre (nom personnalisé)"
3. Tapez "BUS TRAVEL Backend"
4. Copiez le mot de passe généré (16 caractères)

### 2️⃣ **Mettre à jour le fichier .env**

```env
# Configuration Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_application_16_caracteres
COMPANY_EMAIL=votre_email@gmail.com
```

### 3️⃣ **Test de la configuration**

Après avoir configuré le `.env`, testez:

```bash
# Test de la configuration email
curl http://localhost:5000/api/contact/test-email
```

### 4️⃣ **Comment ça fonctionne**

1. **Utilisateur remplit le formulaire** sur contacts.html
2. **Le frontend envoie** les données à l'API
3. **Le backend envoie 2 emails**:
   - 📧 **Pour vous** (administrateur) avec le message du client
   - 📧 **Pour le client** avec confirmation de réception

### 5️⃣ **Contenu des emails reçus**

Vous recevrez un email contenant:
- 📝 Nom et email du contact
- 📋 Sujet du message
- 💬 Message complet
- 🕐 Date et heure d'envoi
- 📍 Format HTML professionnel

### 6️⃣ **Options alternatives**

#### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=votre_email@outlook.com
EMAIL_PASS=votre_mot_de_passe
```

#### Autre fournisseur
Consultez la documentation SMTP de votre fournisseur d'email.

## 🔧 Dépannage

### ❌ "Authentication failed"
- Vérifiez le mot de passe d'application Gmail
- Assurez-vous que l'authentification 2 facteurs est active

### ❌ "Connection refused"
- Vérifiez que le port 587 n'est pas bloqué
- Essayez avec le port 465 (SSL)

### ❌ "Email not sent"
- Vérifiez l'adresse EMAIL_USER
- Testez avec un autre email de destination

## 📊 Test du formulaire

1. **Démarrez le serveur**: `npm run dev`
2. **Allez sur**: http://localhost:5000/contacts.html
3. **Remplissez le formulaire**
4. **Vérifiez vos emails** (dossier spam inclus)

---

🎉 **Vous recevrez automatiquement tous les messages du formulaire de contact!** 🚌🇨🇬
