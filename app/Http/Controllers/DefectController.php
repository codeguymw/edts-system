<?php

namespace App\Http\Controllers;

use App\Models\Defect;
use App\Models\User;
use App\Notifications\DefectNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Asset;
class DefectController extends Controller
{
    /**
     * Show the form to create a new defect.
     */
    public function create()
    {
        return Inertia::render('Defects/Create', [
            // Fetch assets so the reporter can pick one from the dropdown
            'assets' => Asset::all(['id', 'name', 'asset_code'])
        ]);
    }

    /**
     * Store a newly created defect in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'station_name' => 'required|string|max:255',
            'type'         => 'required|string',
            'priority'     => 'required|string',
            'description'  => 'required|string',
            'asset_id'     => 'nullable|exists:assets,id',
            'equipment_id' => 'nullable',
        ]);

        $validated['user_id'] = auth::id();
        $validated['status'] = 'pending';

       \App\Models\Defect::create($validated);

        // This creates the record linked to the logged-in user
       $defect = $request->user()->defects()->create($validated);

       $supervisors = User::where('role', 'supervisor')->get(); 
        foreach ($supervisors as $supervisor) {
            $supervisor->notify(new DefectNotification([
                'title' => '🚨 New Fault Reported',
                'message' => "A new {$validated['priority']} priority fault was reported at {$validated['station_name']}.",
                'defect_id' => $defect->id
            ]));
        }

        return redirect()->route('dashboard')->with('message', 'Fault reported successfully!');
    }
}
