<?php

namespace App\Http\Controllers;

use App\Models\User; 
use App\Services\UserService;      
use App\Http\Requests\RegisterRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

/*
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Requests\RegisterRequest;
use Illuminate\Support\Facades\Hash;
*/
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
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function login(Request $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

  //_______________________________________________

      public function profile(){
        return response()->json([
            'message' => 'Profile token verificado'
        ]);
    }


    public function logout(){
        return response()->json([
            'message' => 'Logout correcto'
        ]);
    }
    
}


  


