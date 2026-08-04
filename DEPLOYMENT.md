# 🚀 Guide de Déploiement - Zoro-Zipa

## 📋 Prérequis

- **Java 21+** (pour Spring Boot)
- **Maven 3.8+** (build backend)
- **Node.js 18+** (build frontend)
- **Git**

Vérifiez les versions:
```bash
java -version
mvn -version
node -v
npm -v
```

---

## 1️⃣ Installation Locale

### Clone le projet
```bash
git clone https://github.com/JuniorMinkoSon/zoro-zipa.git
cd zoro-zipa
```

### Récupère la branche de déploiement
```bash
git checkout claude/devin-frontend-merge-r4aowt
```

---

## 2️⃣ Build & Lancer Localement

### Build complet (Backend + Frontend)
```bash
# Crée le dossier uploads
mkdir uploads

# Installe les dépendances frontend
cd zoro-zipa-web
npm install --force
npm run build
cd ..

# Compile le projet Spring Boot
mvn clean package -DskipTests
```

### Lance l'application
```bash
java -jar target/zoro-zipa-0.0.1-SNAPSHOT.jar
```

**Accès local:**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080/api`
- Admin: `http://localhost:5173/admin`

---

## 3️⃣ Déploiement sur Railway (Recommandé)

### A. Prépare le dépôt
```bash
# Push sur main
git checkout main
git merge claude/devin-frontend-merge-r4aowt
git push origin main
```

### B. Crée un compte Railway
Visite: https://railway.app

### C. Connecte GitHub à Railway
1. Login sur Railway
2. "New Project" → "Deploy from GitHub repo"
3. Sélectionne `zoro-zipa`
4. Autorise l'accès

### D. Configure les variables d'environnement

Dans Railway, ajoute:
```
PORT=8080
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_DATASOURCE_URL=postgresql://...
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=...
```

### E. Crée un `Procfile` à la racine
```bash
echo "web: java -jar target/zoro-zipa-0.0.1-SNAPSHOT.jar" > Procfile
```

### F. Crée un `system.properties`
```bash
echo "java.runtime.version=21" > system.properties
```

### G. Push et déploie
```bash
git add Procfile system.properties
git commit -m "Add deployment files"
git push origin main
```

Railway va automatiquement déployer! 🚀

---

## 4️⃣ Déploiement alternatif - Render.com

### A. Crée un compte Render
Visite: https://render.com

### B. Crée un Web Service
1. "New +" → "Web Service"
2. Sélectionne le repo GitHub
3. Configure:
   - **Name:** zoro-zipa
   - **Runtime:** Java
   - **Build Command:** `mvn clean package -DskipTests`
   - **Start Command:** `java -jar target/zoro-zipa-0.0.1-SNAPSHOT.jar`

### C. Ajoute une BDD PostgreSQL
1. "New +" → "PostgreSQL"
2. Copie la `DATABASE_URL`
3. Dans le Web Service, ajoute la variable d'environnement

### D. Configure les env vars
```
DATABASE_URL=postgres://...
SPRING_DATASOURCE_URL=$DATABASE_URL
SPRING_JPA_HIBERNATE_DDL_AUTO=update
```

---

## 5️⃣ Déploiement alternatif - Heroku

### A. Install Heroku CLI
```bash
npm install -g heroku
heroku login
```

### B. Crée une app Heroku
```bash
heroku create zoro-zipa
```

### C. Ajoute la BDD
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

### D. Configure les env vars
```bash
heroku config:set SPRING_JPA_HIBERNATE_DDL_AUTO=update
```

### E. Deploy
```bash
git push heroku main
```

---

## 📊 Vérifier le déploiement

### Railway/Render
- Ouvre le lien fourni par la plateforme
- Teste `/api/artists` pour vérifier l'API

### Heroku
```bash
heroku logs --tail
heroku open
```

---

## 🔧 Troubleshooting

### Build échoue
```bash
# Nettoie Maven
mvn clean

# Réinstalle les dépendances
rm -rf ~/.m2/repository
mvn install -DskipTests
```

### Frontend ne s'affiche pas
```bash
# Récompile le frontend
cd zoro-zipa-web
npm install --force
npm run build
cd ..

# Relance le build
mvn clean package -DskipTests
```

### Images n'apparaissent pas
- Copie les fichiers du dossier `uploads/` sur le serveur
- Ou réupload via l'admin

### BDD vide
- L'app va auto-créer les tables et données (DataSeeder)
- Attends 30s après le démarrage

---

## 📝 Notes

- **Port:** L'app tourne sur le port `8080`
- **Static files:** Le frontend est servi dans `/target/classes/static`
- **Uploads:** Les images sont sauvegardées dans `/uploads`
- **Admin:** Pas d'authentification actuellement (à implémenter)

---

## 🆘 Support

Si ça ne marche pas:
1. Vérifie les logs: `java -jar target/... 2>&1 | tail -100`
2. Teste l'API: `curl http://localhost:8080/api/artists`
3. Vérifie la base de données: DataSeeder doit avoir créé les données

---

**Questions?** Ouvre une issue GitHub! 📧
