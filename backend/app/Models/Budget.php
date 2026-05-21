<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Budget extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'categorie_id',
        'montant_initial',
        'solde_restant',
        'mois',
        'annee',
    ];

    protected $casts = [
        'montant_initial' => 'float',
        'solde_restant'   => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }
}