<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'uuid' => Str::uuid(),
                'name' => 'Iago',
                'email' => 'email@gmail.com',
                'password' => 'iago0406',
                'role' => 'user',
                'status' => 'active',
            ],
            [
                'uuid' => Str::uuid(),
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'password' => 'password123',
                'role' => 'admin',
                'status' => 'active',
            ],
            [
                'uuid' => Str::uuid(),
                'name' => 'Usuário Teste',
                'email' => 'teste@example.com',
                'password' => 'teste123',
                'role' => 'user',
                'status' => 'active',
            ],
            [
                'uuid' => Str::uuid(),
                'name' => 'João Silva',
                'email' => 'joao@example.com',
                'password' => 'senha123',
                'role' => 'user',
                'status' => 'active',
            ],
            [
                'uuid' => Str::uuid(),
                'name' => 'Técnico',
                'email' => 'technician@example.com',
                'password' => 'technician123',
                'role' => 'technician',
                'status' => 'active',
            ],
        ];

        foreach ($users as $userData) {
            // Verifica se o usuário já existe
            $existingUser = User::where('email', $userData['email'])->first();
            
            if (!$existingUser) {
                User::create($userData);
                $this->command->info("Usuário criado: {$userData['email']} (Role: {$userData['role']})");
            } else {
                $this->command->warn("Usuário já existe: {$userData['email']}");
            }
        }
    }
}

