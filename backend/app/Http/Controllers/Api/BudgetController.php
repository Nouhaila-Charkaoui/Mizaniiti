<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Budget;
use App\Models\Transaction;
use Illuminate\Http\Request;

class BudgetController extends Controller
{
    public function index(Request $request)
    {
        $mois  = $request->get('mois', date('n'));
        $annee = $request->get('annee', date('Y'));

        $budgets = Budget::where('user_id', $request->user()->id)
            ->where('mois', $mois)
            ->where('annee', $annee)
            ->with('categorie')
            ->get();

        // Ajouter le pourcentage consommé
        $budgets->transform(function ($budget) {
            $depense = $budget->montant_initial - $budget->solde_restant;
            $pourcentage = $budget->montant_initial > 0
                ? round(($depense / $budget->montant_initial) * 100, 1)
                : 0;

            $budget->montant_depense = $depense;
            $budget->pourcentage     = $pourcentage;

            if ($pourcentage >= 90) {
                $budget->statut = 'danger';
            } elseif ($pourcentage >= 70) {
                $budget->statut = 'warning';
            } else {
                $budget->statut = 'ok';
            }

            return $budget;
        });

        return response()->json($budgets);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'categorie_id'    => 'required|exists:categories,id',
            'montant_initial' => 'required|numeric|min:1',
            'mois'            => 'required|integer|between:1,12',
            'annee'           => 'required|integer|min:2020',
        ]);

        // Vérifier si un budget existe déjà pour cette catégorie/mois/année
        $existing = Budget::where('user_id', $request->user()->id)
            ->where('categorie_id', $validated['categorie_id'])
            ->where('mois', $validated['mois'])
            ->where('annee', $validated['annee'])
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Un budget existe déjà pour cette catégorie ce mois-ci.'], 422);
        }

        // Calculer les dépenses déjà effectuées ce mois pour cette catégorie
        $depensesExistantes = Transaction::where('user_id', $request->user()->id)
            ->where('categorie_id', $validated['categorie_id'])
            ->where('type', 'depense')
            ->whereMonth('date_transaction', $validated['mois'])
            ->whereYear('date_transaction', $validated['annee'])
            ->sum('montant');

        $budget = Budget::create([
            'user_id'         => $request->user()->id,
            'categorie_id'    => $validated['categorie_id'],
            'montant_initial' => $validated['montant_initial'],
            'solde_restant'   => $validated['montant_initial'] - $depensesExistantes,
            'mois'            => $validated['mois'],
            'annee'           => $validated['annee'],
        ]);

        $budget->load('categorie');

        return response()->json($budget, 201);
    }

    public function update(Request $request, $id)
    {
        $budget = Budget::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $validated = $request->validate([
            'montant_initial' => 'required|numeric|min:1',
        ]);

        $depense = $budget->montant_initial - $budget->solde_restant;
        $budget->montant_initial = $validated['montant_initial'];
        $budget->solde_restant   = $validated['montant_initial'] - $depense;
        $budget->save();

        $budget->load('categorie');

        return response()->json($budget);
    }

    public function destroy(Request $request, $id)
    {
        $budget = Budget::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $budget->delete();

        return response()->json(['message' => 'Budget supprimé avec succès.']);
    }
}