<?php
namespace App\Services;

use App\Models\User;

class UserService
{
    /**
     * Lógica para registrar un usuario y asignar rol inicial.
     * La contraseña se hashea una sola vez por el cast 'hashed' del modelo User.
     *
     * @param array $data
     * @return User
     */
    public function registerUser(array $data)
    {
        $role = User::count() === 0 ? 'admin' : 'user';

        return User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => $data['password'], // el modelo User tiene cast 'hashed', no usar Hash::make aquí
            'role'     => $role,
        ]);
    }
}
