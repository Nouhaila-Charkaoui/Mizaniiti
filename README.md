Mizaniiti — ميزانيتي
Application web de gestion financière personnelle, réalisée dans le cadre du contrôle pratique de développement web à l'ENSA El Jadida.
Filière : 2ITE (S2) — Année universitaire : 2025/2026
Réalisé par : Nouhaila Charkaoui & Ilham Ajjellouli

Pourquoi ce projet ?
L'idée est venue d'un constat assez simple : gérer ses finances au quotidien c'est compliqué quand tout est éparpillé entre notes et fichiers Excel. On voulait quelque chose de centralisé, facile à utiliser, et qui donne une vraie visibilité sur ses dépenses en temps réel. Mizaniiti c'est ça — une application pensée pour redonner le contrôle à l'utilisateur.

Stack technique
CoucheTechnologiesFrontendReact 18, Vite, Tailwind CSS, Axios, RechartsBackendLaravel 12, PHP 8.2AuthLaravel Sanctum (token Bearer)Base de donnéesMySQL

Fonctionnalités
Espace utilisateur

Authentification sécurisée — le token est vérifié côté serveur à chaque ouverture de session
Dashboard avec graphiques mensuels, répartition par catégorie et solde net
Gestion des transactions (revenus & dépenses) avec mise à jour automatique du solde
Budgets par catégorie avec barre de progression (vert / orange / rouge)
Gestion de plusieurs comptes (courant, épargne, espèces)
Modification du profil (nom, email, mot de passe)

Panneau admin

Statistiques globales de la plateforme
Liste de tous les utilisateurs
Activation / désactivation des comptes
Changement de rôle
Suppression des utilisateurs (les admins sont protégés)


Architecture & bonnes pratiques
Le frontend et le backend sont complètement séparés et communiquent uniquement via des requêtes HTTP. Côté Laravel, on a un controller par ressource avec validation des données et un middleware CheckRole pour protéger les routes admin. Côté React, l'authentification est centralisée dans un AuthContext, les routes sont protégées par un composant ProtectedRoute, et tous les appels API passent par un client Axios centralisé.

Installation
Prérequis

PHP 8.2+, Composer
Node.js 18+, npm
MySQL / XAMPP

Backend
bashcd backend
composer install
cp .env.example .env
php artisan key:generate
Configurer .env :
DB_DATABASE=mizaniiti
DB_USERNAME=root
DB_PASSWORD=
bashphp artisan migrate --seed
php artisan serve
API disponible sur http://localhost:8000
Frontend
bashcd frontend
npm install
npm run dev
Application disponible sur http://localhost:5173

Comptes de test
RôleEmailMot de passeAdminadmin@mizaniiti.compasswordUseruser@mizaniiti.compassword

API — Routes principales
Publiques
MethodEndpointDescriptionPOST/api/registerCréer un comptePOST/api/loginConnexion
Authentifiées
MethodEndpointDescriptionGET/api/meUtilisateur connectéPOST/api/logoutDéconnexionPUT/api/profileModifier le profilGET/api/transactionsListe des transactionsPOST/api/transactionsCréer une transactionPUT/api/transactions/{id}Modifier une transactionDELETE/api/transactions/{id}Supprimer une transactionGET/api/budgetsListe des budgetsPOST/api/budgetsCréer un budgetPUT/api/budgets/{id}Modifier un budgetDELETE/api/budgets/{id}Supprimer un budgetGET/api/comptesListe des comptesPOST/api/comptesCréer un comptePUT/api/comptes/{id}Modifier un compteDELETE/api/comptes/{id}Supprimer un compteGET/api/statsStatistiques dashboard
Admin uniquement
MethodEndpointDescriptionGET/api/admin/statsStats globalesGET/api/admin/usersListe des utilisateursPATCH/api/admin/users/{id}/toggleActiver / désactiverPATCH/api/admin/users/{id}/roleChanger le rôleDELETE/api/admin/users/{id}Supprimer un utilisateurGET/api/admin/transactionsToutes les transactions

Base de données
5 tables : users, comptes, categories, transactions, budgets
Le fichier mizaniiti.sql contient la structure complète et des données de test.PartagerContenupdfMizaniiti-Global.zipzipMizaniiti-Global.zipzipFitTrack — Gym Membership Management System
A full-stack web application for managing gym memberships. Members can register, track their membership status, and manage their accounts. Admins have full control over users and membership assignments — all through a clean, role-based interface.

FeatupastedMizaniiti — ميزانيتي
Plateforme FinTech de Gestion Financière Personnelle
Projet réalisé dans le cadre du contrôle pratique de développement web École Nationale des Sciences Appliquées d'El Jadida (ENSAJ) **Filière : 2ITE (S2) — Année Universitaire : 2025/2026 *Réalisé par : Nouhaila Charkaoui & Ipasted
