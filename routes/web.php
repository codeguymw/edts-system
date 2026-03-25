<?php

use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Defect;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DefectController; // 1. Added this import
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;

Route::get('/', function () {
    return redirect()->route('login');
});

// Dashboard Route
Route::get('/dashboard', function () {
    $user = Auth::user();
    
    // Logic: 
    // Reporters see their own reports.
    // Engineers see only what is assigned to them.
    // Supervisors see EVERYTHING.
    
    if ($user->role === 'reporter') {
        $defects = Defect::where('user_id', $user->id)->latest()->get();
    } elseif ($user->role === 'engineer') {
        $defects = Defect::where('assigned_to', $user->id)->latest()->get();
    } else {
        // CHANGE HERE: Added 'engineer' to 'with' so the dashboard can count their tasks
        $defects = Defect::with(['user', 'engineer'])->latest()->get();
    }

    // 2. ONLY for Supervisors: Fetch a list of all Engineers
    $engineers = ($user->role === 'supervisor' || $user->role === 'manager') 
        ? User::where('role', 'engineer')->get(['id', 'name']) 
        : [];

    return Inertia::render('Dashboard', [
        'defects' => $defects,
        'engineers' => $engineers,
    ]); 
})->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware('auth')->group(function () {
    
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    
    Route::get('/defects/create', [DefectController::class, 'create'])->name('defects.create');
    Route::post('/defects', [DefectController::class, 'store'])->name('defects.store');
});

Route::patch('/defects/{defect}/assign', function (Request $request, App\Models\Defect $defect) {
    $defect->update([
        'assigned_to' => $request->assigned_to,
        'status' => 'assigned', // Lifecycle moves to 'assigned'
    ]);

    return back()->with('message', "Fault has been assigned and the Engineer has been notified.");
})->name('defects.assign');

// 2. The Engineer uses THIS 'defects.update-status' to do the work:
Route::patch('/defects/{defect}/status', function (Request $request, Defect $defect) {
    // Basic Security: Ensure only the person assigned can move it to 'working' or 'completed'
    if (auth::user()->role === 'engineer' && $defect->assigned_to !== auth::id()) {
        abort(403, 'This fault is not assigned to you.');
    }

    $defect->update([
        'status' => $request->status // Expecting 'working' or 'completed'
    ]);

    return back()->with('message', "Fault status updated to {$request->status}!");
})->name('defects.update-status');

require __DIR__.'/auth.php';