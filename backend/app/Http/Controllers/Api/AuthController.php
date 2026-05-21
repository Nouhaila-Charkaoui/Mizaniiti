<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Compte;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role'     => 'user',
        ]);

        // Créer un compte par défaut pour le nouvel utilisateur
        Compte::create([
            'user_id'       => $user->id,
            'nom'           => 'Compte Principal',
            'type'          => 'courant',
            'solde_initial' => 0.00,
            'solde_actuel'  => 0.00,
            'devise'        => 'MAD',
        ]);

        $token = $user->createToken('mizaniiti-token')->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants sont incorrects.'],
            ]);
        }

        if (!$user->is_active) {
            return response()->json(['message' => 'Votre compte est désactivé.'], 403);
        }

        $token = $user->createToken('mizaniiti-token')->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté avec succès.']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function updateProfile(Request $request)
{
    $user = $request->user();

    $validated = $request->validate([
        'name'     => 'required|string|max:255',
        'email'    => 'required|email|unique:users,email,' . $user->id,
        'password' => 'nullable|string|min:8|confirmed',
    ]);

    $user->name  = $validated['name'];
    $user->email = $validated['email'];
    if (!empty($validated['password'])) {
        $user->password = bcrypt($validated['password']);
    }
    $user->save();

    return response()->json($user);
}
}