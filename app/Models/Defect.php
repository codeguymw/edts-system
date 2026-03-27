<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Defect extends Model
{
   use HasFactory;

    protected $fillable = [
        'user_id',
        'equipment_id',
        'station_name',
        'type',
        'description',
        'priority',
        'status',
        'user_id',      // The person reporting
        'assigned_to'
    ];

    // Link the defect back to the user who reported it
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function engineer(): BelongsTo
    {
        // This says: 'assigned_to' in this table points to 'id' in the Users table
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
