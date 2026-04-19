<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->string('asset_code')->unique(); // e.g., TX-BL-001
            $table->string('name');                 // e.g., Blantyre Transformer
            $table->string('type');                 // transformer, breaker, line
            $table->string('location');
            $table->enum('status', ['operational', 'faulty', 'maintenance'])->default('operational');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
