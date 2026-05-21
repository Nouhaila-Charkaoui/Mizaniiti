<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comptes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('nom');
            $table->enum('type', ['courant', 'epargne', 'especes'])->default('courant');
            $table->decimal('solde_initial', 15, 2)->default(0.00);
            $table->decimal('solde_actuel', 15, 2)->default(0.00);
            $table->string('devise', 3)->default('MAD');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comptes');
    }
};