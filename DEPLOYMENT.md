# 🚀 Guide de Déploiement - Zoro Zipa

## Architecture

- **Frontend** : React/Vite → Vercel
- **Backend** : Spring Boot → Railway / Heroku / AWS

---

## ✅ Prérequis

1. Compte Vercel (gratuit)
2. Compte Railway ou Heroku (pour le backend)
3. Git configuré

---

## 📦 Étape 1 : Déployer le Backend

### Option A : Railway (Recommandé - Gratuit et simple)

```bash
# 1. Crée un compte sur railway.app
# 2. Connecte ton GitHub

# 3. Dans Railway:
# - Clique "New Project"
# - Sélectionne "Deploy from GitHub"
# - Choisis ce repo
# - Configure les variables d'environnement:
JAVA_VERSION=21
MAIL_USERNAME=bruno488@gmail.com
MAIL_PASSWORD=ton_app_password
```

**URL du backend** : `https://zoro-zipa-backend.railway.app` (exemple)

---

## 🎨 Étape 2 : Déployer le Frontend sur Vercel

### Via GitHub (Recommandé)

```bash
# 1. Push sur GitHub
# 2. Va sur vercel.com
# 3. Clique "New Project" 
# 4. Import depuis GitHub
# 5. Sélectionne: root = frontend
```

---

## 🔑 Variables d'Environnement Vercel

Dans Vercel Dashboard → Settings → Environment Variables :

```
VITE_API_URL = https://zoro-zipa-backend.railway.app/api
```

*(Remplace par l'URL réelle de ton backend)*

---

## ✅ Test Final

1. Frontend : https://zoro-zipa.vercel.app
2. Admin : https://zoro-zipa.vercel.app/admin  
3. Crée une œuvre → Vérifie qu'elle apparaît en 5 secondes
4. Les images s'affichent correctement

---

## ✨ C'est déployé !

