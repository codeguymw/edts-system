<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use Illuminate\Http\Request;
use Inertia\Inertia;
// THIS IS THE CRITICAL LINE BELOW:
use Illuminate\Support\Facades\Auth;

class AssetController extends Controller
{
    public function index()
    {
        // This gets the assets and COUNTS how many faults each had in the last 30 days
        $assets = Asset::withCount(['defects as failures' => function ($query) {
            $query->where('created_at', '>=', now()->subMonth());
        }])->get();

        return Inertia::render('Assets/Index', [
            'assets' => $assets
        ]);
    }

    public function store(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user || ($user->role !== 'supervisor' && $user->role !== 'manager')) {
            abort(403);
        }

        $request->validate([
            'asset_code' => 'required|unique:assets',
            'name' => 'required',
            'type' => 'required',
            'location' => 'required',
        ]);

        Asset::create($request->all());

        return back()->with('message', 'Asset added successfully!');
    }
}