<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;


/*
|--------------------------------------------------------------------------
|--- RUTAS PÚBLICAS DE AUTENTICACIÓN ---
|--------------------------------------------------------------------------
*/

Route::prefix('auth')->group(function () {

    Route::post('/register', [AuthController::class, 'register']);

    Route::post('/login', [AuthController::class, 'login']);

    Route::get('/profile', [AuthController::class, 'profile']);

    Route::post('/logout', [AuthController::class, 'logout']);
    
});


/*
|--------------------------------------------------------------------------
| PRODUCT ROUTES
|--------------------------------------------------------------------------
*/

  Route::apiResource('products', ProductController::class);

  /*
|--------------------------------------------------------------------------
| --- RUTAS PROTEGIDAS (REQUIEREN TOKEN) ---
|--------------------------------------------------------------------------
*/
  Route::middleware('auth:sanctum')->group(function () {

   // Perfil y Logout (Cualquier usuario logueado)
    Route::get('/auth/profile', [AuthController::class, 'profile']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Catálogo y Compra (Puntos 1.B y 3.C de la prueba)
    Route::get('products', [ProductController::class, 'index']);
    Route::post('products/buy', [ProductController::class, 'buy']);

    /* --- BLOQUE EXCLUSIVO PARA ADMINS --- */

    // Aquí usamos el middleware que verifica el campo 'role' en la BD
    Route::middleware('admin')->group(function () {
        
        // CRUD completo de Productos (Solo Admin)
        Route::post('products', [ProductController::class, 'store']);
        Route::put('products/{id}', [ProductController::class, 'update']);
        Route::delete('products/{id}', [ProductController::class, 'destroy']);
        
        // User Management 
        Route::apiResource('users', UserController::class);
        
        // Dashboard Stats (Opcional para el panel principal)
        Route::get('admin/dashboard', [AuthController::class, 'dashboardStats']);
    });
});