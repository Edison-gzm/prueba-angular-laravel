<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

    public function register(Request $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user'
        ]);

        return response()->json($user);
    }


    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->first();

        if(!$user || !Hash::check($request->password, $user->password)){
            return response()->json([
                'message' => 'Credenciales incorrectas'
            ],401);
        }

        return response()->json($user);
    }


    public function profile()
    {
        return response()->json(auth()->user());
    }


    public function logout()
    {
        return response()->json([
            'message' => 'Logout correcto'
        ]);
    }

}
