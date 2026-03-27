<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Defect;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $faults = [
            [
                'equipment_id' => 'EQ-101',
                'station_name' => 'Lilongwe Central',
                'type' => 'Electrical',
                'description' => 'Transformer overheating in Sector B.',
                'priority' => 'High',
                'status' => 'pending',
            ],
            [
                'equipment_id' => 'EQ-205',
                'station_name' => 'Blantyre North',
                'type' => 'Mechanical',
                'description' => 'Cooling fan making unusual grinding noise.',
                'priority' => 'Medium',
                'status' => 'pending',
            ],
            [
                'equipment_id' => 'EQ-099',
                'station_name' => 'Mzuzu Station',
                'type' => 'Software',
                'description' => 'Sensor synchronization timeout on main board.',
                'priority' => 'Low',
                'status' => 'pending',
            ],
        ];

        foreach ($faults as $fault) {
            Defect::create($fault);
        }
    }
}
