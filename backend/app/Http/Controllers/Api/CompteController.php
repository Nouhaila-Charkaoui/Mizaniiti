<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Compte;
use Illuminate\Http\Request;

class CompteController extends Controller
{
    public function index(Request $request)
    {
        $comptes = Compte::where('user_id', $request->user()->id)
            ->withCount('transactions')
            ->get();

        return response()->json($comptes);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom'           => 'required|string|max:255',
            'type'          => 'required|in:courant,epargne,especes',
            'solde_initial' => 'required|numeric|min:0',
            'devise'        => 'sometimes|string|size:3',
        ]);

        $compte = Compte::create([
            'user_id'       => $request->user()->id,
            'nom'           => $validated['nom'],
            'type'          => $validated['type'],
            'solde_initial' => $validated['solde_initial'],
            'solde_actuel'  => $validated['solde_initial'],
            'devise'        => $validated['devise'] ?? 'MAD',
        ]);

        return response()->json($compte, 201);
    }

    public function show(Request $request, $id)
    {
        $compte = Compte::where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json($compte);
    }

    public function update(Request $request, $id)
    {
        $compte = Compte::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $validated = $request->validate([
            'nom'    => 'sometimes|string|max:255',
            'type'   => 'sometimes|in:courant,epargne,especes',
            'devise' => 'sometimes|string|size:3',
        ]);

        $compte->update($validated);

        return response()->json($compte);
    }

    public function destroy(Request $request, $id)
    {
        $compte = Compte::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $compte->delete();

        return response()->json(['message' => 'Compte supprimé avec succès.']);
    }
}