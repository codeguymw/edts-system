<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

class Defect extends Model
{
   use HasFactory;

        protected $fillable = [
        'user_id',
        'station_name',
        'type',
        'priority',
        'description',
        'status',
        'assigned_to',
        'asset_id',
        'equipment_id',
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

    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }

    protected static function booted()
    {
        // ... keep your existing equipment_id logic here ...

        static::created(function ($defect) {
            \App\Models\ActivityLog::create([
                'user_id' => auth::id() ?? $defect->user_id,
                'action' => 'Reported New Fault',
                'details' => "Asset: " . ($defect->asset->asset_code ?? $defect->equipment_id),
            ]);
        });

        static::updated(function ($defect) {
            if ($defect->isDirty('status')) {
                \App\Models\ActivityLog::create([
                    'user_id' => auth::id(),
                    'action' => 'Status Changed to ' . strtoupper($defect->status),
                    'details' => "Fault #" . $defect->id . " updated.",
                ]);
            }
        });
    }
}
