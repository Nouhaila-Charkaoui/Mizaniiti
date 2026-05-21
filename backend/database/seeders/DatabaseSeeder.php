<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Categorie;
use App\Models\Compte;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        $admin = User::create([
            'name'     => 'Administrateur',
            'email'    => 'admin@mizaniiti.com',
            'password' => Hash::make('password'),
            'role'     => 'admin',
        ]);

        // User de test
        $user = User::create([
            'name'     => 'Youssef Alami',
            'email'    => 'user@mizaniiti.com',
            'password' => Hash::make('password'),
            'role'     => 'user',
        ]);

        // Catégories globales
        $cats = [
            ['nom' => 'Alimentation',   'type' => 'depense', 'icone' => '🛒', 'couleur' => '#ef4444', 'is_globale' => true],
            ['nom' => 'Transport',      'type' => 'depense', 'icone' => '🚗', 'couleur' => '#f97316', 'is_globale' => true],
            ['nom' => 'Logement',       'type' => 'depense', 'icone' => '🏠', 'couleur' => '#eab308', 'is_globale' => true],
            ['nom' => 'Santé',          'type' => 'depense', 'icone' => '🏥', 'couleur' => '#22c55e', 'is_globale' => true],
            ['nom' => 'Loisirs',        'type' => 'depense', 'icone' => '🎮', 'couleur' => '#8b5cf6', 'is_globale' => true],
            ['nom' => 'Éducation',      'type' => 'depense', 'icone' => '📚', 'couleur' => '#06b6d4', 'is_globale' => true],
            ['nom' => 'Salaire',        'type' => 'revenu',  'icone' => '💼', 'couleur' => '#10b981', 'is_globale' => true],
            ['nom' => 'Freelance',      'type' => 'revenu',  'icone' => '💻', 'couleur' => '#3b82f6', 'is_globale' => true],
            ['nom' => 'Investissement', 'type' => 'revenu',  'icone' => '📈', 'couleur' => '#6366f1', 'is_globale' => true],
        ];

        foreach ($cats as $cat) {
            Categorie::create(array_merge($cat, ['user_id' => null]));
        }

        // Compte pour l'utilisateur de test
        Compte::create([
            'user_id'       => $user->id,
            'nom'           => 'Compte Principal',
            'type'          => 'courant',
            'solde_initial' => 5000.00,
            'solde_actuel'  => 5000.00,
            'devise'        => 'MAD',
        ]);
    }
}