<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Compte;
use App\Models\Budget;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::where('transactions.user_id', $request->user()->id)
            ->with(['categorie', 'compte'])
            ->orderBy('date_transaction', 'desc');

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('compte_id')) {
            $query->where('compte_id', $request->compte_id);
        }

        if ($request->filled('categorie_id')) {
            $query->where('categorie_id', $request->categorie_id);
        }

        if ($request->filled('date_debut')) {
            $query->whereDate('date_transaction', '>=', $request->date_debut);
        }

        if ($request->filled('date_fin')) {
            $query->whereDate('date_transaction', '<=', $request->date_fin);
        }

        $transactions = $query->paginate(20);

        return response()->json($transactions);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'compte_id'        => 'required|exists:comptes,id',
            'categorie_id'     => 'required|exists:categories,id',
            'montant'          => 'required|numeric|min:0.01',
            'type'             => 'required|in:depense,revenu',
            'description'      => 'nullable|string|max:500',
            'date_transaction' => 'required|date',
        ]);

        // Vérifier que le compte appartient à l'utilisateur
        $compte = Compte::where('user_id', $request->user()->id)
            ->findOrFail($validated['compte_id']);

        $transaction = Transaction::create([
            'user_id'          => $request->user()->id,
            'compte_id'        => $validated['compte_id'],
            'categorie_id'     => $validated['categorie_id'],
            'montant'          => $validated['montant'],
            'type'             => $validated['type'],
            'description'      => $validated['description'] ?? null,
            'date_transaction' => $validated['date_transaction'],
        ]);

        // Mettre à jour le solde du compte
        if ($validated['type'] === 'revenu') {
            $compte->solde_actuel += $validated['montant'];
        } else {
            $compte->solde_actuel -= $validated['montant'];
        }
        $compte->save();

        // Mettre à jour le budget correspondant si existant
        $mois = date('n', strtotime($validated['date_transaction']));
        $annee = date('Y', strtotime($validated['date_transaction']));

        $budget = Budget::where('user_id', $request->user()->id)
            ->where('categorie_id', $validated['categorie_id'])
            ->where('mois', $mois)
            ->where('annee', $annee)
            ->first();

        if ($budget && $validated['type'] === 'depense') {
            $budget->solde_restant -= $validated['montant'];
            $budget->save();
        }

        $transaction->load(['categorie', 'compte']);

        return response()->json($transaction, 201);
    }

    public function show(Request $request, $id)
    {
        $transaction = Transaction::where('user_id', $request->user()->id)
            ->with(['categorie', 'compte'])
            ->findOrFail($id);

        return response()->json($transaction);
    }

    public function update(Request $request, $id)
{
    $transaction = Transaction::where('user_id', $request->user()->id)
        ->findOrFail($id);

    $validated = $request->validate([
        'compte_id'        => 'required|exists:comptes,id',
        'categorie_id'     => 'required|exists:categories,id',
        'montant'          => 'required|numeric|min:0.01',
        'type'             => 'required|in:depense,revenu',
        'description'      => 'nullable|string|max:500',
        'date_transaction' => 'required|date',
    ]);

    // Inverser l'ancien effet sur le solde du compte
    $ancienCompte = $transaction->compte;
    if ($transaction->type === 'revenu') {
        $ancienCompte->solde_actuel -= $transaction->montant;
    } else {
        $ancienCompte->solde_actuel += $transaction->montant;
    }
    $ancienCompte->save();

    // Appliquer le nouveau effet sur le nouveau compte
    $nouveauCompte = Compte::where('user_id', $request->user()->id)
        ->findOrFail($validated['compte_id']);
    if ($validated['type'] === 'revenu') {
        $nouveauCompte->solde_actuel += $validated['montant'];
    } else {
        $nouveauCompte->solde_actuel -= $validated['montant'];
    }
    $nouveauCompte->save();

    // Mettre à jour la transaction
    $transaction->update($validated);
    $transaction->load(['categorie', 'compte']);

    return response()->json($transaction);
}

    public function destroy(Request $request, $id)
    {
        $transaction = Transaction::where('user_id', $request->user()->id)
            ->findOrFail($id);

        // Inverser l'effet sur le solde du compte
        $compte = $transaction->compte;
        if ($transaction->type === 'revenu') {
            $compte->solde_actuel -= $transaction->montant;
        } else {
            $compte->solde_actuel += $transaction->montant;
        }
        $compte->save();

        // Inverser sur le budget si depense
        if ($transaction->type === 'depense') {
            $mois  = $transaction->date_transaction->format('n');
            $annee = $transaction->date_transaction->format('Y');

            $budget = Budget::where('user_id', $request->user()->id)
                ->where('categorie_id', $transaction->categorie_id)
                ->where('mois', $mois)
                ->where('annee', $annee)
                ->first();

            if ($budget) {
                $budget->solde_restant += $transaction->montant;
                $budget->save();
            }
        }

        $transaction->delete();

        return response()->json(['message' => 'Transaction supprimée avec succès.']);
    }

    // Statistiques pour le dashboard
    public function stats(Request $request)
    {
        $userId = $request->user()->id;
        $mois   = $request->get('mois', date('n'));
        $annee  = $request->get('annee', date('Y'));

        $totalRevenus = Transaction::where('user_id', $userId)
            ->where('type', 'revenu')
            ->whereMonth('date_transaction', $mois)
            ->whereYear('date_transaction', $annee)
            ->sum('montant');

        $totalDepenses = Transaction::where('user_id', $userId)
            ->where('type', 'depense')
            ->whereMonth('date_transaction', $mois)
            ->whereYear('date_transaction', $annee)
            ->sum('montant');

        // Dépenses par catégorie pour le mois
        $depensesParCategorie = Transaction::where('transactions.user_id', $userId)
            ->where('transactions.type', 'depense')
            ->whereMonth('date_transaction', $mois)
            ->whereYear('date_transaction', $annee)
            ->join('categories', 'transactions.categorie_id', '=', 'categories.id')
            ->selectRaw('categories.nom, categories.couleur, categories.icone, SUM(transactions.montant) as total')
            ->groupBy('categories.id', 'categories.nom', 'categories.couleur', 'categories.icone')
            ->orderByDesc('total')
            ->get();

        // Évolution sur les 6 derniers mois
        $evolution = [];
        for ($i = 5; $i >= 0; $i--) {
            $m = date('n', strtotime("-$i months"));
            $y = date('Y', strtotime("-$i months"));
            $label = date('M Y', strtotime("-$i months"));

            $revenus  = Transaction::where('user_id', $userId)
                ->where('type', 'revenu')
                ->whereMonth('date_transaction', $m)
                ->whereYear('date_transaction', $y)
                ->sum('montant');

            $depenses = Transaction::where('user_id', $userId)
                ->where('type', 'depense')
                ->whereMonth('date_transaction', $m)
                ->whereYear('date_transaction', $y)
                ->sum('montant');

            $evolution[] = [
                'mois'     => $label,
                'revenus'  => (float) $revenus,
                'depenses' => (float) $depenses,
            ];
        }

        // Dernières transactions
        $dernieres = Transaction::where('user_id', $userId)
            ->with(['categorie', 'compte'])
            ->orderBy('date_transaction', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'total_revenus'          => (float) $totalRevenus,
            'total_depenses'         => (float) $totalDepenses,
            'solde_net'              => (float) ($totalRevenus - $totalDepenses),
            'depenses_par_categorie' => $depensesParCategorie,
            'evolution'              => $evolution,
            'dernieres_transactions' => $dernieres,
        ]);
    }
}