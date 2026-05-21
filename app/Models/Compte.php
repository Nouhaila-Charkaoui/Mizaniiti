<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Compte extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nom',
        'type',
        'solde_initial',
        'solde_actuel',
        'devise',
    ];

    protected $casts = [
        'solde_initial' => 'float',
        'solde_actuel'  => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}