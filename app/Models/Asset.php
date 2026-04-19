<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany; // Add this import

class Asset extends Model
{
    use HasFactory;

    protected $fillable = [
        'asset_code',
        'name',
        'type',
        'location',
        'status',
    ];

    /**
     * An Asset can have many defects (faults).
     */
    public function defects(): HasMany
    {
        // This tells Laravel that the 'defects' table has an 'asset_id' column
        return $this->hasMany(Defect::class);
    }
}