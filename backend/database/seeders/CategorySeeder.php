<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'uuid' => Str::uuid(),
                'name' => 'Hardware',
                'description' => 'Problemas relacionados a equipamentos físicos: computadores, impressoras, monitores, teclados, mouses, etc.'
            ],
            [
                'uuid' => Str::uuid(),
                'name' => 'Software',
                'description' => 'Questões relacionadas a aplicativos, sistemas operacionais, instalação de programas, configurações de software, etc.'
            ],
            [
                'uuid' => Str::uuid(),
                'name' => 'Rede',
                'description' => 'Problemas de conectividade, internet, WiFi, cabos de rede, configurações de rede, acesso a servidores, etc.'
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
