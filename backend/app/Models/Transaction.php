<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'compte_id',
        'categorie_id',
        'montant',
        'type',
        'description',
        'date_transaction',
    ];

    protected $casts = [
        'montant'          => 'float',
        'date_transaction' => 'date:Y-m-d',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function compte()
    {
        return $this->belongsTo(Compte::class);
    }

    public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }
}