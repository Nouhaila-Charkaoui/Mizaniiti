# Mizaniiti — ميزانيتي
### **Plateforme FinTech de Gestion Financière Personnelle**

> **Projet réalisé dans le cadre du contrôle pratique de développement web**
> **École Nationale des Sciences Appliquées d'El Jadida (ENSAJ)**
> **Filière : 2ITE (S2) — Année Universitaire : 2025/2026
> **Réalisé par : **Nouhaila Charkaoui** & **Ilham Ajjellouli***

---

##  Genèse du Projet & Vision

L'idée de **Mizaniiti**  est née d'un constat simple et humain : gérer ses finances personnelles au quotidien est un casse-tête. Entre les notes volantes, les fichiers Excel complexes et le manque de visibilité, on finit souvent le mois sans savoir où est parti notre argent. 

En tant que futures ingénieures, nous avons voulu concevoir une solution **User-Centric** : centraliser, automatiser et sécuriser la gestion financière en un seul endroit. Mizaniiti n'est pas qu'un simple projet académique, c'est un outil pensé pour redonner le contrôle de leur portefeuille aux utilisateurs, avec une expérience fluide et sans friction.

---

## 🛠️ Stack Technique & Choix Architecturaux

Nous avons opté pour une **Architecture Découplée ** stricte pour garantir la scalabilité et la maintenabilité du système.

Frontend : Nous utilisons React,  Tailwind CSS. Ce choix permet d'offrir une interface ultra-réactive (SPA), moderne et parfaitement adaptée à tous les écrans (Responsive).

Communication : L'interaction entre le frontend et le backend est gérée par Axios, ce qui permet une gestion asynchrone des requêtes HTTP avec des intercepteurs pour la gestion sécurisée des tokens.

Data Visualization : L'intégration de Recharts nous a permis de créer des graphiques dynamiques pour une interprétation immédiate et visuelle des tendances financières.

Backend (API) : Le cœur du projet repose sur Laravel et PHP. Nous avons privilégié la robustesse du framework MVC pour construire des routes RESTful performantes et structurées.

Sécurité & Authentification : Nous utilisons Laravel Sanctum pour assurer une authentification par Token Bearer à la fois sécurisée et légère.

Base de Données : Nous travaillons avec MySQL pour sa fiabilité relationnelle, garantissant une cohérence totale de vos transactions financières.

---

## Fonctionnalités Clés

### Espace Utilisateur (Rôle: `user`)
* **Sécurité à l'ouverture :** Le token est vérifié côté serveur à chaque session via les hooks React (`useEffect`) pour empêcher les accès non autorisés.
* **Dashboard Dynamique :** Visualisation en temps réel de l'évolution sur 6 mois, répartition des dépenses par catégorie, et calcul instantané du solde net.
* **Gestion Multi-comptes :** CRUD complet pour séparer vos comptes (Courant, Épargne, Espèces).
* **Algorithme d'Alerte Budget :** Système intelligent de progression (Vert / Orange  / Rouge ) qui passe au rouge dès que les dépenses dépassent les limites fixées pour éviter le surendettement.
* **Expérience Fluide :** Grâce à la gestion d'état , l'ajout d'une transaction met à jour le solde et les graphiques **sans rechargement de page**.

###  Panneau Administrateur (Rôle: `admin`)
* **Vue Globale :** Statistiques consolidées de la plateforme (Nombre total d'utilisateurs, volume des transactions, revenus globaux).
* **Modération & Contrôle :** Gestion complète des comptes (Activation/Désactivation instantanée, modification des rôles, suppression sécurisée).

---

## architecture du Code & Bonnes Pratiques

Le projet respecte une séparation rigoureuse des responsabilités  :
*Côté Backend (Laravel) : Utilisation de controllers dédiés par ressource avec validation stricte des données entrantes via le mécanisme natif
$request-validate(), et intégration d'un middleware personnalisé CheckRole pour sécuriser les routes sensibles.
* **Côté Frontend (React) :** Centralisation de l'état d'authentification via un `AuthContext`, protection des routes via un composant `ProtectedRoute`, et isolation des appels API dans un dossier dédié.

##  Installation & Lancement Quickstart

## ⚙️ Installation et lancement

### Prérequis
- PHP 8.2+, Composer, Node.js 18+, MySQL,Xampp

### Backend
--bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

--Modifier .env :

DB_DATABASE=mizaniyati
DB_USERNAME=root
DB_PASSWORD=

--bash
php artisan migrate
php artisan db:seed
php artisan serve

API disponible sur http://localhost:8000

### Frontend
--bash
cd frontend
npm install
npm run dev
L'application est disponible sur http://localhost:5173

###Comptes de Test (Jury)
++ Administrateur            admin@mizaniiti.com        password
++ Utilisateur               user@mizaniiti.com         password
