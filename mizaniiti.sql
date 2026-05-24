-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3307
-- Généré le : dim. 24 mai 2026 à 12:59
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `mizaniiti`
--

-- --------------------------------------------------------

--
-- Structure de la table `budgets`
--

CREATE TABLE `budgets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `categorie_id` bigint(20) UNSIGNED NOT NULL,
  `montant_initial` decimal(15,2) NOT NULL,
  `solde_restant` decimal(15,2) NOT NULL,
  `mois` int(11) NOT NULL,
  `annee` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `budgets`
--

INSERT INTO `budgets` (`id`, `user_id`, `categorie_id`, `montant_initial`, `solde_restant`, `mois`, `annee`, `created_at`, `updated_at`) VALUES
(1, 3, 2, 1500.00, 1100.00, 5, 2026, '2026-05-20 01:12:47', '2026-05-22 23:12:53'),
(2, 3, 3, 4000.00, 1000.00, 5, 2026, '2026-05-20 18:30:10', '2026-05-22 23:14:28'),
(8, 3, 1, 3000.00, 1000.00, 5, 2026, '2026-05-22 22:58:39', '2026-05-22 22:58:39'),
(15, 12, 2, 1500.00, 1300.00, 5, 2026, '2026-05-23 14:36:21', '2026-05-23 14:36:21'),
(16, 12, 5, 4000.00, 1000.00, 5, 2026, '2026-05-23 14:36:57', '2026-05-23 14:36:57');

-- --------------------------------------------------------

--
-- Structure de la table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `nom` varchar(255) NOT NULL,
  `type` enum('depense','revenu') NOT NULL,
  `icone` varchar(255) NOT NULL DEFAULT '?',
  `couleur` varchar(7) NOT NULL DEFAULT '#6366f1',
  `is_globale` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id`, `user_id`, `nom`, `type`, `icone`, `couleur`, `is_globale`, `created_at`, `updated_at`) VALUES
(1, NULL, 'Alimentation', 'depense', '🛒', '#ef4444', 1, '2026-05-20 01:08:06', '2026-05-20 01:08:06'),
(2, NULL, 'Transport', 'depense', '🚗', '#f97316', 1, '2026-05-20 01:08:06', '2026-05-20 01:08:06'),
(3, NULL, 'Logement', 'depense', '🏠', '#eab308', 1, '2026-05-20 01:08:06', '2026-05-20 01:08:06'),
(4, NULL, 'Santé', 'depense', '🏥', '#22c55e', 1, '2026-05-20 01:08:06', '2026-05-20 01:08:06'),
(5, NULL, 'Loisirs', 'depense', '🎮', '#8b5cf6', 1, '2026-05-20 01:08:06', '2026-05-20 01:08:06'),
(6, NULL, 'Éducation', 'depense', '📚', '#06b6d4', 1, '2026-05-20 01:08:06', '2026-05-20 01:08:06'),
(7, NULL, 'Salaire', 'revenu', '💼', '#10b981', 1, '2026-05-20 01:08:06', '2026-05-20 01:08:06'),
(8, NULL, 'Freelance', 'revenu', '💻', '#3b82f6', 1, '2026-05-20 01:08:06', '2026-05-20 01:08:06'),
(9, NULL, 'Investissement', 'revenu', '📈', '#6366f1', 1, '2026-05-20 01:08:06', '2026-05-20 01:08:06');

-- --------------------------------------------------------

--
-- Structure de la table `comptes`
--

CREATE TABLE `comptes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(255) NOT NULL,
  `type` enum('courant','epargne','especes') NOT NULL DEFAULT 'courant',
  `solde_initial` decimal(15,2) NOT NULL DEFAULT 0.00,
  `solde_actuel` decimal(15,2) NOT NULL DEFAULT 0.00,
  `devise` varchar(3) NOT NULL DEFAULT 'MAD',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `comptes`
--

INSERT INTO `comptes` (`id`, `user_id`, `nom`, `type`, `solde_initial`, `solde_actuel`, `devise`, `created_at`, `updated_at`) VALUES
(1, 2, 'Compte Principal', 'courant', 5000.00, 5000.00, 'MAD', '2026-05-20 01:08:06', '2026-05-20 01:08:06'),
(2, 3, 'Compte Principal', 'courant', 0.00, 34600.00, 'MAD', '2026-05-20 01:10:17', '2026-05-22 23:14:28'),
(3, 3, 'EPARGNE', 'epargne', 5000.00, 5000.00, 'MAD', '2026-05-20 01:12:20', '2026-05-20 01:12:20'),
(8, 6, 'Compte Principal', 'courant', 0.00, 30000.00, 'MAD', '2026-05-22 19:04:06', '2026-05-22 19:05:18'),
(19, 12, 'Compte Principal', 'courant', 0.00, 10300.00, 'MAD', '2026-05-23 14:30:33', '2026-05-23 14:34:44'),
(20, 12, 'Epargne', 'epargne', 5000.00, 5000.00, 'MAD', '2026-05-23 14:38:02', '2026-05-23 14:38:02');

-- --------------------------------------------------------

--
-- Structure de la table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000001_create_cache_table', 1),
(2, '0001_01_01_000002_create_jobs_table', 1),
(3, '2024_01_01_000001_create_users_table', 1),
(4, '2024_01_01_000002_create_comptes_table', 1),
(5, '2024_01_01_000003_create_categories_table', 1),
(6, '2024_01_01_000004_create_transactions_table', 1),
(7, '2024_01_01_000005_create_budgets_table', 1),
(8, '2026_05_19_230642_create_personal_access_tokens_table', 1);

-- --------------------------------------------------------

--
-- Structure de la table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(30, 'App\\Models\\User', 3, 'mizaniiti-token', '644ac81d539aad2b42a1aa19d111a6e4a44102f68bb21eb494b9819ee76e7c12', '[\"*\"]', '2026-05-22 15:55:03', NULL, '2026-05-22 15:49:52', '2026-05-22 15:55:03'),
(34, 'App\\Models\\User', 6, 'mizaniiti-token', '6b057d00b6dcbaa687ade4d0d1c89ad6ac225179f37489d639522625d05c2243', '[\"*\"]', '2026-05-22 19:05:43', NULL, '2026-05-22 19:04:06', '2026-05-22 19:05:43'),
(53, 'App\\Models\\User', 1, 'mizaniiti-token', '20515e408b1a98bb468da9b04489189d4c51cd9286f5a43513dda7a50e607697', '[\"*\"]', '2026-05-22 23:52:39', NULL, '2026-05-22 23:52:19', '2026-05-22 23:52:39'),
(64, 'App\\Models\\User', 1, 'mizaniiti-token', '4b49ddf86dd79acacea3f8f53f9b851892df13ccdb01ab53b50a7e6a586e404b', '[\"*\"]', '2026-05-23 22:30:00', NULL, '2026-05-23 22:29:12', '2026-05-23 22:30:00');

-- --------------------------------------------------------

--
-- Structure de la table `transactions`
--

CREATE TABLE `transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `compte_id` bigint(20) UNSIGNED NOT NULL,
  `categorie_id` bigint(20) UNSIGNED NOT NULL,
  `montant` decimal(15,2) NOT NULL,
  `type` enum('depense','revenu') NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `date_transaction` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `transactions`
--

INSERT INTO `transactions` (`id`, `user_id`, `compte_id`, `categorie_id`, `montant`, `type`, `description`, `date_transaction`, `created_at`, `updated_at`) VALUES
(1, 3, 2, 7, 20000.00, 'revenu', NULL, '2026-05-20', '2026-05-20 01:11:35', '2026-05-20 01:11:35'),
(2, 3, 2, 8, 10000.00, 'revenu', NULL, '2026-05-20', '2026-05-20 01:11:50', '2026-05-20 01:11:50'),
(3, 3, 2, 5, 10000.00, 'depense', NULL, '2026-05-20', '2026-05-20 14:18:50', '2026-05-20 14:18:50'),
(4, 3, 2, 7, 20000.00, 'revenu', NULL, '2026-04-22', '2026-05-22 13:39:59', '2026-05-22 13:39:59'),
(14, 6, 8, 7, 20000.00, 'revenu', NULL, '2026-05-22', '2026-05-22 19:05:00', '2026-05-22 19:05:00'),
(15, 6, 8, 8, 10000.00, 'revenu', NULL, '2026-05-22', '2026-05-22 19:05:18', '2026-05-22 19:05:18'),
(23, 3, 2, 1, 2000.00, 'depense', NULL, '2026-05-22', '2026-05-22 22:56:42', '2026-05-22 22:56:42'),
(24, 3, 2, 2, 400.00, 'depense', 'taxi', '2026-05-22', '2026-05-22 23:12:53', '2026-05-22 23:12:53'),
(25, 3, 2, 3, 3000.00, 'depense', NULL, '2026-05-22', '2026-05-22 23:14:28', '2026-05-22 23:14:28'),
(42, 12, 19, 7, 20000.00, 'revenu', NULL, '2026-05-23', '2026-05-23 14:32:03', '2026-05-23 14:32:03'),
(44, 12, 19, 3, 2500.00, 'depense', NULL, '2026-05-23', '2026-05-23 14:32:55', '2026-05-23 14:32:55'),
(45, 12, 19, 1, 4000.00, 'depense', NULL, '2026-05-23', '2026-05-23 14:33:43', '2026-05-23 14:33:43'),
(46, 12, 19, 2, 200.00, 'depense', NULL, '2026-05-23', '2026-05-23 14:34:15', '2026-05-23 14:34:15'),
(47, 12, 19, 5, 3000.00, 'depense', NULL, '2026-05-23', '2026-05-23 14:34:44', '2026-05-23 14:34:44');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `is_active`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Administrateur', 'admin@mizaniiti.com', '$2y$12$J8Gzl0RWgo4PZV8D.LQKXeO36.DaO.w9qHKb8VGNFIwhiht3i4Vyq', 'admin', 1, NULL, '2026-05-20 01:08:06', '2026-05-20 01:08:06'),
(2, 'Youssef Alami', 'user@mizaniiti.com', '$2y$12$TYKr4f1s5Pumx5Kuij.33uN3GAnNZFrtPgp5.mr9WeERzE7VwAiYu', 'user', 1, NULL, '2026-05-20 01:08:06', '2026-05-22 23:41:13'),
(3, 'Ilham Ajjellouli', 'ajjellouliilham1@gmail.com', '$2y$12$awvnHI0pCe1ZqB8F2Z/FyeLf7gQRWarxq7d.9KW3yMHu//zXsCuCy', 'user', 1, NULL, '2026-05-20 01:10:17', '2026-05-22 19:57:22'),
(6, 'nouhaila charkaoui', 'nouhaila@gmail.com', '$2y$12$upvq2/2A1UX4zgO/Bhb9sOYZl9J2fgitdCaOLcKQMaxXc5qcjwft2', 'user', 1, NULL, '2026-05-22 19:04:06', '2026-05-22 19:04:06'),
(12, 'Amine Ajje', 'amin@gmail.com', '$2y$12$uNePcwt46h318LyuXEVTKOT55IBYCqoBNSe65CfMoxHU2xVnYAOm6', 'user', 1, NULL, '2026-05-23 14:30:33', '2026-05-23 22:29:58');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `budgets`
--
ALTER TABLE `budgets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `budgets_user_id_foreign` (`user_id`),
  ADD KEY `budgets_categorie_id_foreign` (`categorie_id`);

--
-- Index pour la table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Index pour la table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Index pour la table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categories_user_id_foreign` (`user_id`);

--
-- Index pour la table `comptes`
--
ALTER TABLE `comptes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `comptes_user_id_foreign` (`user_id`);

--
-- Index pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Index pour la table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Index pour la table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Index pour la table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transactions_user_id_foreign` (`user_id`),
  ADD KEY `transactions_compte_id_foreign` (`compte_id`),
  ADD KEY `transactions_categorie_id_foreign` (`categorie_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `budgets`
--
ALTER TABLE `budgets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT pour la table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `comptes`
--
ALTER TABLE `comptes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT pour la table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `budgets`
--
ALTER TABLE `budgets`
  ADD CONSTRAINT `budgets_categorie_id_foreign` FOREIGN KEY (`categorie_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `budgets_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `comptes`
--
ALTER TABLE `comptes`
  ADD CONSTRAINT `comptes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_categorie_id_foreign` FOREIGN KEY (`categorie_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transactions_compte_id_foreign` FOREIGN KEY (`compte_id`) REFERENCES `comptes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transactions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
