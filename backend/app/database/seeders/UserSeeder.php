<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Usuarios de prueba para poder iniciar sesión en cualquier entorno.
     * Contraseña para todos: Password1!
     */
    public function run(): void
    {
        $users = [
            [
                'name'     => 'Administrador',
                'email'    => 'admin@prueba.com',
                'password' => Hash::make('Password1!'),
                'role'     => 'admin',
            ],
            [
                'name'     => 'Usuario Demo',
                'email'    => 'usuario@prueba.com',
                'password' => Hash::make('Password1!'),
                'role'     => 'user',
            ],
            [
                'name'     => 'María García',
                'email'    => 'maria@prueba.com',
                'password' => Hash::make('Password1!'),
                'role'     => 'user',
            ],
        ];

        foreach ($users as $data) {
            User::updateOrCreate(
                ['email' => $data['email']],
                $data
            );
        }
    }
}
