<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CompteController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\BudgetController;
use App\Http\Controllers\Api\CategorieController;
use App\Http\Controllers\Api\AdminController;
use Illuminate\Support\Facades\Route;

// ─── Routes publiques ───────────────────────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// ─── Routes authentifiées ───────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // Comptes bancaires
    Route::apiResource('comptes', CompteController::class);

    // Catégories
    Route::get('/categories',        [CategorieController::class, 'index']);
    Route::post('/categories',       [CategorieController::class, 'store']);
    Route::delete('/categories/{id}',[CategorieController::class, 'destroy']);

    // Transactions
    Route::apiResource('transactions', TransactionController::class);
    Route::get('/stats', [TransactionController::class, 'stats']);

    // Budgets
    Route::apiResource('budgets', BudgetController::class);

    // ─── Routes Admin uniquement ────────────────────────────────────
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/stats',                          [AdminController::class, 'stats']);
        Route::get('/users',                          [AdminController::class, 'users']);
        Route::patch('/users/{id}/toggle',            [AdminController::class, 'toggleUser']);
        Route::patch('/users/{id}/role',              [AdminController::class, 'changeRole']);
        Route::delete('/users/{id}',                  [AdminController::class, 'destroyUser']);
        Route::get('/transactions',                   [AdminController::class, 'allTransactions']);
    });
});