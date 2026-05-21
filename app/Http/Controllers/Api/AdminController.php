<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Transaction;
use App\Models\Budget;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    // Statistiques globales
    public function stats()
    {
        $totalUsers        = User::where('role', 'user')->count();
        $totalTransactions = Transaction::count();
        $totalRevenus      = Transaction::where('type', 'revenu')->sum('montant');
        $totalDepenses     = Transaction::where('type', 'depense')->sum('montant');
        $totalBudgets      = Budget::count();

        // Nouveaux utilisateurs ce mois
        $nouveauxUtilisateurs = User::where('role', 'user')
            ->whereMonth('created_at', date('n'))
            ->whereYear('created_at', date('Y'))
            ->count();

        return response()->json([
            'total_users'             => $totalUsers,
            'total_transactions'      => $totalTransactions,
            'total_revenus'           => (float) $totalRevenus,
            'total_depenses'          => (float) $totalDepenses,
            'total_budgets'           => $totalBudgets,
            'nouveaux_utilisateurs'   => $nouveauxUtilisateurs,
        ]);
    }

    // Liste des utilisateurs
    public function users(Request $request)
    {
        $users = User::withCount(['transactions', 'budgets', 'comptes'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($users);
    }

    // Activer / Désactiver un utilisateur
    public function toggleUser($id)
    {
        $user = User::findOrFail($id);

        if ($user->role === 'admin') {
            return response()->json(['message' => 'Impossible de modifier un administrateur.'], 403);
        }

        $user->is_active = !$user->is_active;
        $user->save();

        $statut = $user->is_active ? 'activé' : 'désactivé';

        return response()->json([
            'message' => "Utilisateur $statut avec succès.",
            'user'    => $user,
        ]);
    }

    // Changer le rôle
    public function changeRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|in:user,admin',
        ]);

        $user = User::findOrFail($id);
        $user->role = $request->role;
        $user->save();

        return response()->json([
            'message' => 'Rôle mis à jour avec succès.',
            'user'    => $user,
        ]);
    }

    // Supprimer un utilisateur
    public function destroyUser($id)
    {
        $user = User::findOrFail($id);

        if ($user->role === 'admin') {
            return response()->json(['message' => 'Impossible de supprimer un administrateur.'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé avec succès.']);
    }

    // Toutes les transactions (admin)
    public function allTransactions(Request $request)
    {
        $transactions = Transaction::with(['user', 'categorie', 'compte'])
            ->orderBy('date_transaction', 'desc')
            ->paginate(20);

        return response()->json($transactions);
    }
}