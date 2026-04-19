<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AssetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void {
        $assets = [
            ['asset_code' => 'TX-LL-01', 'name' => 'City Center Transformer', 'type' => 'Transformer', 'location' => 'Lilongwe'],
            ['asset_code' => 'TX-LL-02', 'name' => 'Area 18 Substation', 'type' => 'Transformer', 'location' => 'Lilongwe'],
            ['asset_code' => 'LN-BT-09', 'name' => 'Blantyre Main Line', 'type' => 'Line', 'location' => 'Blantyre'],
            ['asset_code' => 'BR-MZ-04', 'name' => 'Mzuzu North Breaker', 'type' => 'Breaker', 'location' => 'Mzuzu'],
            ['asset_code' => 'TX-ZA-05', 'name' => 'Zomba Market Transformer', 'type' => 'Transformer', 'location' => 'Zomba'],
            ['asset_code' => 'LN-LL-12', 'name' => 'Area 47 Feeder Line', 'type' => 'Line', 'location' => 'Lilongwe'],
            // You can keep adding more here until you hit your 12!
        ];

        foreach ($assets as $asset) {
            // This checks if asset_code exists. 
            // If YES: Updates the record. If NO: Creates a new one.
            \App\Models\Asset::updateOrCreate(
                ['asset_code' => $asset['asset_code']], 
                $asset
            );
        }
    }
}
