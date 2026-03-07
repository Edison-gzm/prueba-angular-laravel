<?php
namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserService
{
    /**
     * Lógica para registrar un usuario y asignar rol inicial.
     * @param array 
     * @return User 
     */
    public function registerUser(array $data)
    {
        //verificamos si es el primer usuario
        $role = User::count() === 0 ? 'admin' : 'user';

        return User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'role'     => $role,
        ]);
    }
}
