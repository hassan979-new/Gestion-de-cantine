# 🍽️ Cantine ENS Marrakech — Système de Gestion de Menu & Précommandes

Plateforme complète de gestion de cantine scolaire permettant aux étudiants de consulter
les menus et passer des précommandes via une application Android, avec un tableau de bord
web pour les agents de cantine et les administrateurs.

---

## 📁 Structure du Projet

```
cantine-ens/
├── catine-api/          # Backend Node.js / Express
├── web-react/           # Frontend Web React + Tailwind
└── android/             # Application Mobile Android (Java)
```

---

## 🧱 Conception

### Acteurs

<img width="923" height="1162" alt="Diagramme sans nom drawio" src="https://github.com/user-attachments/assets/e04b545c-2984-4384-a405-17ad44df4007" />


---

### Modèle de Données (4 tables)

<img width="451" height="440" alt="projet diagramme de classe drawio (1)" src="https://github.com/user-attachments/assets/79cc487b-e65c-4edb-b60a-366a22ea1630" />


```sql
-- 1. Utilisateurs
CREATE TABLE users (
  id         INT(11)      PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(100) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  role       ENUM('student','agent','admin') DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Menus
CREATE TABLE menus (
  id         INT(11)       PRIMARY KEY AUTO_INCREMENT,
  dish_name  VARCHAR(100)  NOT NULL,
  price      DECIMAL(8,2)  NOT NULL,
  available  TINYINT(1)    DEFAULT 1,
  menu_date  DATE          NOT NULL,
  image      VARCHAR(255)  DEFAULT NULL
);

-- 3. Commandes
CREATE TABLE orders (
  id          INT(11)      PRIMARY KEY AUTO_INCREMENT,
  user_id     INT(11)      NOT NULL,
  status      ENUM('en attente','en préparation','prête','servie','annulée') DEFAULT 'en attente',
  total_price DECIMAL(8,2) DEFAULT 0,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 4. Éléments de commande
CREATE TABLE order_items (
  id       INT(11)      PRIMARY KEY AUTO_INCREMENT,
  order_id INT(11)      NOT NULL,
  menu_id  INT(11)      NOT NULL,
  quantity INT(11)      NOT NULL DEFAULT 1,
  subtotal DECIMAL(8,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (menu_id)  REFERENCES menus(id)
);
```

---

### Règles Métier

-  Une commande validée doit contenir **au moins 1 plat**
-  Un plat avec `available = 0` ne peut **pas** être commandé
-  Une commande au statut **"servie"** ne peut plus être modifiée
-  Chaque menu est lié à **une date spécifique** (`menu_date`)

---

### Flux des Statuts de Commande

```
[en attente] ──► [en préparation] ──► [prête] ──► [servie]
      │
      └──► [annulée]
```

---

### Architecture Technique

<img width="598" height="334" alt="Arch_projet" src="https://github.com/user-attachments/assets/f8f79aab-a9e8-414d-bde4-2c9e75bdc459" />


---

## 📡 Routes API

### Auth — `/api/auth`

| Méthode | Endpoint         | Description                        | Auth     |
|---------|------------------|------------------------------------|----------|
| POST    | `/register`      | Inscription d'un nouvel utilisateur| –        |
| POST    | `/login`         | Connexion — retourne un JWT        | –        |
| GET     | `/me`            | Profil de l'utilisateur connecté   | JWT      |

---

### Menus — `/api/menus`

| Méthode | Endpoint    | Description                              | Auth              |
|---------|-------------|------------------------------------------|-------------------|
| GET     | `/today`    | Menu du jour (Android — public)          | –                 |
| GET     | `/`         | Menus filtrés par date (`?date=`)        | –                 |
| POST    | `/`         | Ajouter un menu (avec image `multipart`) | JWT · agent/admin |
| PUT     | `/:id`      | Modifier un menu ou sa disponibilité     | JWT · agent/admin |
| DELETE  | `/:id`      | Supprimer un menu                        | JWT · agent/admin |

---

### Commandes — `/api/orders`

| Méthode | Endpoint          | Description                                  | Auth |
|---------|-------------------|----------------------------------------------|------|
| POST    | `/`               | Créer une commande (avec `order_items`)      | –    |
| GET     | `/`               | Liste de toutes les commandes                | –    |
| GET     | `/stats`          | Statistiques du dashboard (nb commandes, CA) | –    |
| GET     | `/:id/items`      | Détail des plats d'une commande              | –    |
| PUT     | `/:id`            | Mettre à jour le statut (Web)                | –    |
| PUT     | `/:id/status`     | Mettre à jour le statut (Android)            | –    |

---

## 🚀 Démarrage

### Prérequis

| Outil         | Version minimale |
|---------------|-----------------|
| Node.js       | 18+             |
| MySQL         | 8+              |
| npm           | 9+              |
| Android Studio| Hedgehog+       |

---

### 1. Backend — `catine-api`

```bash
cd catine-api
npm install
```

Créer le fichier `.env` :

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=cantine_db
JWT_SECRET=your_jwt_secret_key
```

Initialiser la base de données :

```bash
mysql -u root -p -e "CREATE DATABASE cantine_db;"
mysql -u root -p cantine_db < schema.sql
```

Démarrer :

```bash
npm run dev     # développement (nodemon)
npm start       # production
```

> API disponible sur `http://localhost:3000`
> Images servies sur `http://localhost:3000/uploads/<filename>`

---

### 2. Frontend Web — `web-react`

```bash
cd web-react
npm install
```

Créer le fichier `.env` :

```env
VITE_API_URL=http://localhost:3000/api
```

Démarrer :

```bash
npm run dev
```

> Interface disponible sur `http://localhost:5173`

---

### 3. Application Android

1. Ouvrir le dossier `android/` dans **Android Studio**
2. Définir l'URL de base dans `RetrofitClient.java` :

```java
// Émulateur Android
private static final String BASE_URL = "http://10.0.2.2:3000/api/";

// Appareil physique — remplacer par l'IP locale de votre machine
// private static final String BASE_URL = "http://192.168.1.x:3000/api/";
```

3. **File > Sync Project with Gradle Files**
4. Lancer sur émulateur ou appareil physique **(API 24+)**

---

## 🛠️ Stack Technique

| Couche        | Technologie                                              |
|---------------|----------------------------------------------------------|
| Backend       | Node.js, Express 5, MySQL2, JWT, Bcrypt, Multer, Dotenv  |
| Web Frontend  | React 19, Vite, Tailwind CSS 4, React Router 7, Recharts |
| Mobile        | Android Java, Retrofit2, Gson, Glide, Room, Navigation   |
| Auth          | JWT Bearer Token (`Authorization: Bearer <token>`)       |
| Images        | Multer (upload) · Express static (serving)               |

---

## 🧑‍💻 Auteur

👤 **Agouram Hassan**  
⚛️ Projet React – TP Portfolio 
🎓 Instructor : **Mr. LACHGAR**  
📅 30 April 2026

Projet réalisé dans le cadre du cursus **Département Informatique — ENS Marrakech**
