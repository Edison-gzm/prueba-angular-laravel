<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\UserService;
use App\Http\Requests\RegisterRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cookie;

class AuthController extends Controller
{
    /**
     * @var UserService
     */
    protected $userService;

    /**
     * Constructor para inyectar el servicio de usuario.
     * * @param UserService $userService
     */
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Registro de nuevo usuario con validación segura.
     *
     * @param RegisterRequest $request
     * @return JsonResponse
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        // El Request ya validó la contraseña (mínimo 8, mayúscula, símbolo) 
        $user = $this->userService->registerUser($request->validated());

        return response()->json([
            'message' => 'Usuario creado con éxito',
            'user' => $user
        ], 201);
    }

    /**
     * Inicio de sesión.
     * El email se busca sin importar mayúsculas/minúsculas y sin espacios.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function login(Request $request): JsonResponse
    {
        $email = trim((string) $request->input('email', ''));
        $password = $request->input('password', '');

        if ($email === '' || $password === '') {
            return response()->json([
                'message' => 'Credenciales incorrectas',
            ], 401);
        }

        $user = User::whereRaw('LOWER(email) = ?', [strtolower($email)])->first();

        if (! $user || ! Hash::check($password, $user->password)) {
            return response()->json([
                'message' => 'Credenciales incorrectas',
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        // Cookie HttpOnly con el token para mayor seguridad en el navegador
        $cookie = Cookie::make(
            'auth_token',          // nombre
            $token,                // valor
            60 * 24,               // minutos (1 día)
            '/',                   // path
            null,                  // domain
            false,                 // secure (true en producción con HTTPS)
            true,                  // httpOnly
            false,                 // raw
            'lax'                  // sameSite
        );

        return response()
            ->json([
                'user' => $user,
                'token' => $token,
            ])
            ->withCookie($cookie);
    }

    /**
     * Devuelve el perfil del usuario autenticado.
     *
     * @return JsonResponse Usuario actual
     */
    public function profile(): JsonResponse
    {
        $user = auth()->user();

        return response()->json([
            'message' => 'profile correcto',
            'user'    => $user,
        ], 200);
    }


    /**
     * Cierra sesión: revoca el token y elimina la cookie de autenticación.
     *
     * @return JsonResponse Mensaje de logout
     */
    public function logout(): JsonResponse
    {
        // Revocamos el token actual si existe
        $user = auth()->user();
        if ($user && $user->currentAccessToken()) {
            $user->currentAccessToken()->delete();
        }

        // Eliminamos la cookie HttpOnly en el navegador
        $forgetCookie = Cookie::forget('auth_token');

        return response()
            ->json([
                'message' => 'Logout correcto',
            ])
            ->withCookie($forgetCookie);
    }
    
}


  


