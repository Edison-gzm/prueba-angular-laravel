<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{

    public function index(): JsonResponse
    {
       $users = User::all();
       return response()->json($users, 200);

    }

    /**
     * Crear un usuario manualmente desde el Admin (C del CRUD).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => [
            'required',
             Password::min(8)
            ->letters()      // Al menos una letra 
            ->mixedCase()    // Mayúsculas y minúsculas 
            ->numbers()      // Al menos un número 
            ->symbols(),     // Al menos un carácter especial 
            ] ,

            'role' => 'required|in:admin,user',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return response()->json(['message' => 'Usuario creado por administrador', 'user' => $user], 201);
    }

    /**
     * Actualizar datos y ROL de un usuario (U del CRUD).
     */
    public function update(Request $request, $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'string|max:255',
            'email' => 'email|unique:users,email,' . $user->id,
            'role' => 'in:admin,user', // Aquí el admin cambia el rol
        ]);

        $user->update($validated);

        return response()->json(['message' => 'Usuario actualizado con éxito', 'user' => $user]);
    }

    public function updateRole(Request $request, $id): JsonResponse
    {
    
    $user = User::findOrFail($id);

    $request->validate([
        'role' => 'required|string|in:admin,user'
    ]);

    $user->role = $request->role;
    $user->save();

    return response()->json([
        'mensaje' => 'Rol actualizado correctamente',
        'usuario' => $user
    ], 200);
    }   


    

    public function destroy($id): JsonResponse
    {
        $user = User::findOrFail($id);

        // Seguridad: El admin no debe poder borrarse a sí mismo
        if (auth()->id() === $user->id) {
            return response()->json(['message' => 'No puedes eliminar tu propia cuenta de administrador.'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'Usuario eliminado correctamente']);
    }
}