<?php

namespace App\Http\Controllers;

use App\Models\Defect;
use App\Models\Asset;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AnalyticsController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $role = $user->role; // Assuming you have a 'role' column in users table

        // 1. GLOBAL STATS (Everyone can see these for the "General Public" feel)
        $publicStats = [
            'total_resolved' => Defect::where('status', 'completed')->count(),
            'total_active'   => Defect::whereIn('status', ['pending', 'working', 'assigned'])->count(),
        ];

        // 2. ROLE-BASED DATA
        $data = [];

        if ($role === 'supervisor') {
            // Supervisor: Birds-eye view of everything
            $data = [
                'total_faults' => Defect::count(),
                'by_priority'  => Defect::selectRaw('priority, count(*) as count')->groupBy('priority')->get(),
                'by_status'    => Defect::selectRaw('status, count(*) as count')->groupBy('status')->get(),
                'recent_activity' => Defect::with(['user', 'asset'])->latest()->take(10)->get(),
            ];
        } 
        elseif ($role === 'engineer') {
            // Engineer: Only faults assigned to them
            $data = [
                'my_tasks'          => Defect::where('assigned_to', $user->id)->whereIn('status', ['assigned', 'working'])->count(),
                'completed_by_me'   => Defect::where('assigned_to', $user->id)->where('status', 'completed')->count(),
                'system_open_faults' => Defect::whereIn('status', ['pending', 'assigned'])->count(),
                'critical_alerts'   => Defect::where('priority', 'critical')->where('status', '!=', 'completed')->count(),
                'task_list'         => Defect::where('assigned_to', $user->id)->with('asset')->latest()->get(),
            ];
        } 
        else {
            // Reporter: Their own history + Public visibility
            $data = [
                'my_logs'       => Defect::where('user_id', $user->id)->count(),
                'my_fixed'      => Defect::where('user_id', $user->id)->where('status', 'completed')->count(),
                'my_history'    => Defect::where('user_id', $user->id)->with('asset')->latest()->get(),
            ];
        }

        return Inertia::render('Analytics/Index', [
            'role' => $role,
            'publicStats' => $publicStats,
            'roleData' => $data
        ]);
    }
}