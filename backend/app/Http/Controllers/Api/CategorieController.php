<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categorie;
use Illuminate\Http\Request;

class CategorieController extends Controller
{
    public function index(Request $request)
    {
        // Retourner les catégories globales + celles de l'utilisateur
        $categories = Categorie::where('is_globale', true)
            ->orWhere('user_id', $request->user()->id)
            ->get();

        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom'     => 'required|string|max:255',
            'type'    => 'required|in:depense,revenu',
            'icone'   => 'sometimes|string|max:10',
            'couleur' => 'sometimes|string|max:7',
        ]);

        $categorie = Categorie::create([
            'user_id'    => $request->user()->id,
            'nom'        => $validated['nom'],
            'type'       => $validated['type'],
            'icone'      => $validated['icone'] ?? '📁',
            'couleur'    => $validated['couleur'] ?? '#6366f1',
            'is_globale' => false,
        ]);

        return response()->json($categorie, 201);
    }

    public function destroy(Request $request, $id)
    {
        $categorie = Categorie::where('user_id', $request->user()->id)
            ->where('is_globale', false)
            ->findOrFail($id);

        $categorie->delete();

        return response()->json(['message' => 'Catégorie supprimée.']);
    }
}