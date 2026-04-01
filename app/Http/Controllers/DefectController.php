<?php

namespace App\Http\Controllers;

use App\Models\Defect;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DefectController extends Controller
{
    /**
     * Show the form to create a new defect.
     */
    public function create()
    {
        return Inertia::render('Defects/Create');
    }

    /**
     * Store a newly created defect in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'equipment_id' => 'required|string|max:50',
            'station_name' => 'required|string|max:100',
            'type'          => 'required|in:transformer,line,breaker,other',
            'priority'      => 'required|in:low,medium,high,critical',
            'description'   => 'required|string',
        ]);

        // This creates the record linked to the logged-in user
        $request->user()->defects()->create($validated);

        return redirect()->route('dashboard')->with('message', 'Fault reported successfully!');
    }
}
