<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{

    /**
     * Lista usuarios creados en los últimos 12 meses (solo recientes).
     *
     * @return JsonResponse Lista de usuarios ordenados por fecha descendente
     */
    public function index(): JsonResponse
    {
        $users = User::where('created_at', '>=', now()->subYear())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($users, 200);
    }

    /**
     * Obtiene un usuario por su ID.
     *
     * @param int|string $id ID del usuario
     * @return JsonResponse Usuario encontrado o 404
     */
    public function show($id): JsonResponse
    {
        // Buscamos el usuario o lanzamos un error 404 si no existe
        $user = User::findOrFail($id);

        return response()->json([
            'message' => 'Usuario encontrado con éxito',
            'user' => $user
        ], 200);
    }

    /**
     * Crea un usuario desde el panel de administración (nombre, email, contraseña, rol).
     *
     * @param Request $request name, email, password (con reglas fuertes), role (admin|user)
     * @return JsonResponse Usuario creado con código 201
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
            'password' => $validated['password'], // el modelo User tiene cast 'hashed'
            'role' => $validated['role'],
        ]);

        return response()->json(['message' => 'Usuario creado por administrador', 'user' => $user], 201);
    }

    /**
     * Actualiza nombre, email y/o rol de un usuario.
     *
     * @param Request $request name, email, role (todos opcionales)
     * @param int|string $id ID del usuario
     * @return JsonResponse Usuario actualizado
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

    /**
     * Cambia solo el rol de un usuario (admin o user).
     *
     * @param Request $request role (required, admin|user)
     * @param int|string $id ID del usuario
     * @return JsonResponse Usuario con rol actualizado
     */
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


    

    /**
     * Elimina un usuario. No permite que un admin se elimine a sí mismo.
     *
     * @param int|string $id ID del usuario
     * @return JsonResponse Mensaje de confirmación o 403 si intenta borrarse
     */
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