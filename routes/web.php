<?php

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\NotificationController;
use App\Notifications\DefectNotification;
use App\Models\User;
use App\Models\Defect;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DefectController; // 1. Added this import
use App\Http\Controllers\AssetController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Notifications\FaultAssigned;
use Illuminate\Support\Facades\Notification;
use App\Http\Controllers\AnalyticsController;

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


Route::middleware('auth', 'verified')->group(function () {
    
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    
    Route::get('/defects/create', [DefectController::class, 'create'])->name('defects.create');
    Route::post('/defects', [DefectController::class, 'store'])->name('defects.store');
    Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics.index');
    Route::get('/logs', function() {
    return Inertia::render('Logs/Index', [
        'logs' => \App\Models\ActivityLog::with('user')->latest()->paginate(20)
    ]);
})->name('logs.index');

    // --- NOTIFICATION READ (ONLY ONE ROUTE NEEDED) ---
    Route::post('/notifications/read', function () {
        Auth::user()->unreadNotifications->markAsRead();
        return back();
    })->name('notifications.read');

    // --- STEP 2: SUPERVISOR TO ENGINEER ---
    Route::patch('/defects/{defect}/assign', function (Request $request, Defect $defect) {
        $defect->update([
            'assigned_to' => $request->assigned_to,
            'status' => 'assigned', 
        ]);

        $engineer = User::find($request->assigned_to);
        if ($engineer) {
            $engineer->notify(new DefectNotification([
                'title' => '🛠️ Task Assigned',
                'message' => "Fault at {$defect->station_name} has been assigned to you.",
                'defect_id' => $defect->id
            ]));
        }
        return back()->with('message', "Engineer notified!");
    })->name('defects.assign');

    // --- STEP 3: ENGINEER TO REPORTER & SUPERVISOR ---
    Route::patch('/defects/{defect}/status', function (Request $request, Defect $defect) {
        if (Auth::user()->role === 'engineer' && $defect->assigned_to !== Auth::id()) {
            abort(403);
        }

        $defect->update(['status' => $request->status]);

        // Logic for different statuses
        if ($request->status === 'completed') {
            $title = '✅ Fault Resolved!';
            $msg = "The issue at {$defect->station_name} has been fixed.";
        } else {
            $title = '🔄 Status Update';
            $msg = "Engineer is now: " . strtoupper($request->status) . " on the fault at {$defect->station_name}.";
        }

        // Notify the original Reporter
        if ($defect->user) {
            $defect->user->notify(new DefectNotification([
                'title' => $title,
                'message' => $msg,
                'defect_id' => $defect->id
            ]));
        }

        // Also notify Supervisors so they know progress is being made
        $supervisors = User::whereIn('role', ['supervisor', 'manager'])->get();
        Notification::send($supervisors, new DefectNotification([
            'title' => "Engineer Update: {$request->status}",
            'message' => "Fault #{$defect->id} status changed by " . Auth::user()->name,
            'defect_id' => $defect->id
        ]));

        

    return back()->with('message', "Fault status updated to {$request->status}!");
})->name('defects.update-status');
Route::get('/assets', [\App\Http\Controllers\AssetController::class, 'index'])->name('assets.index');
Route::post('/assets', [\App\Http\Controllers\AssetController::class, 'store'])->name('assets.store');
});

require __DIR__.'/auth.php';