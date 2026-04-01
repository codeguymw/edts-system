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
        Schema::create('defects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Who reported it
            $table->string('equipment_id'); // e.g., TX-45-CENTRAL
            $table->string('station_name'); // e.g., Kanengo Substation
            $table->enum('type', ['transformer', 'line', 'breaker', 'other']);
            $table->text('description');
            $table->enum('priority', ['low', 'medium', 'high', 'critical'])->default('medium');
            $table->enum('status', ['pending', 'assigned', 'working', 'completed', 'in_progress', 'repaired', 'verified'])->default('pending');
            $table->string('location_coords')->nullable(); // For GPS if needed later
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('defects');
    }
};
