<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function markAsRead(Request $request)
    {
        // This clears the red dot by setting 'read_at' in the database
        $request->user()->unreadNotifications->markAsRead();

        return back(); // Keeps the user on the same page
    }
}
