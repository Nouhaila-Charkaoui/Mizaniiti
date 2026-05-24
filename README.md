# Mizaniiti — ميزانيتي

Application web de gestion financière personnelle, réalisée dans le cadre du contrôle pratique de développement web à l'ENSA El Jadida.

Filière : 2ITE (S2) — Année universitaire : 2025/2026
Réalisé par : Nouhaila Charkaoui & Ilham Ajjellouli

---

## Pourquoi ce projet ?

L'idée est venue d'un constat assez simple : gérer ses finances au quotidien c'est compliqué quand tout est éparpillé entre notes et fichiers Excel. On voulait quelque chose de centralisé, facile à utiliser, et qui donne une vraie visibilité sur ses dépenses en temps réel. Mizaniiti c'est ça — une application pensée pour redonner le contrôle à l'utilisateur.

---

## Stack technique

| Couche | Technologies |
|--------|-------------|
| Frontend | React , Vite, Tailwind CSS, Axios, Recharts |
| Backend | Laravel , PHP  |
| Auth | Laravel Sanctum (token Bearer) |
| Base de données | MySQL |

---

## Fonctionnalités

### Espace utilisateur
- Authentification sécurisée — le token est vérifié côté serveur à chaque ouverture de session
- Dashboard avec graphiques mensuels, répartition par catégorie et solde net
- Gestion des transactions (revenus & dépenses) avec mise à jour automatique du solde
- Budgets par catégorie avec barre de progression (vert / orange / rouge)
- Gestion de plusieurs comptes (courant, épargne, espèces)
- Modification du profil (nom, email, mot de passe)

### Panneau admin
- Statistiques globales de la plateforme
- Liste de tous les utilisateurs
- Activation / désactivation des comptes
- Changement de rôle
- Suppression des utilisateurs (les admins sont protégés)

---

## Architecture & bonnes pratiques

Le frontend et le backend sont complètement séparés et communiquent uniquement via des requêtes HTTP. Côté Laravel, on a un controller par ressource avec validation des données et un middleware `CheckRole` pour protéger les routes admin. Côté React, l'authentification est centralisée dans un `AuthContext`, les routes sont protégées par un composant `ProtectedRoute`, et tous les appels API passent par un client Axios centralisé.

---
## Structure du projet

```
Mizaniiti/
├── backend/                          # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   └── Api/
│   │   │   │       ├── AuthController.php
│   │   │   │       ├── TransactionController.php
│   │   │   │       ├── BudgetController.php
│   │   │   │       ├── CompteController.php
│   │   │   │       ├── CategorieController.php
│   │   │   │       └── AdminController.php
│   │   │   └── Middleware/
│   │   │       └── CheckRole.php
│   │   └── Models/
│   │       ├── User.php
│   │       ├── Transaction.php
│   │       ├── Budget.php
│   │       ├── Compte.php
│   │       └── Categorie.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
│       └── api.php
│
├── frontend/
│   └── src/
│       ├── api/
│       │   └── api.js
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── SettingsContext.jsx
│       ├── components/
│       │   ├── Layout.jsx
│       │   ├── Sidebar.jsx
│       │   ├── Navbar.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── Profile.jsx
│       │   └── Parametres.jsx
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Transactions.jsx
│       │   ├── Budgets.jsx
│       │   ├── Comptes.jsx
│       │   └── AdminPanel.jsx
│       ├── App.jsx
│       └── main.jsx
│
├└── README.md
```

## Installation

### Prérequis
- PHP +, Composer
- Node.js +, npm
- MySQL / XAMPP

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Configurer `.env` :

```
DB_DATABASE=mizaniiti
DB_USERNAME=root
DB_PASSWORD=
```

```bash
php artisan migrate --seed
php artisan serve
```

API disponible sur `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Application disponible sur `http://localhost:5173`

---

## Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@mizaniiti.com | password |
| User | user@mizaniiti.com | password |

---


## Base de données

5 tables : `users`, `comptes`, `categories`, `transactions`, `budgets`
## Améliorations futures

- Export des transactions en CSV ou PDF
- Transactions récurrentes (loyer, salaire...)
- Notifications par email pour les alertes budgets
- Support multi-devises (EUR, USD...)
- Amélioration du responsive mobile

