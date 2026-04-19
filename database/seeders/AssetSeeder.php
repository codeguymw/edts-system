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
            // Add as many as you want here...
        ];

        foreach ($assets as $asset) {
            \App\Models\Asset::create($asset);
        }
    }
}
