<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;


//---------------------------------------------------------------------

Route::prefix('auth')->group(function () {

    Route::post('/register', [AuthController::class, 'register']);

    Route::post('/login', [AuthController::class, 'login']);

    Route::get('/profile', [AuthController::class, 'profile']);

    Route::post('/logout', [AuthController::class, 'logout']);
    
});


//----------------------------------------------------------
  Route::apiResource('products', ProductController::class);
    


//---------------------------------------------------
 
 Route::middleware('auth:sanctum')->group(function () {

    // Perfil y Logout (Cualquier usuario logueado)
    Route::get('/auth/profile', [AuthController::class, 'profile']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // BLOQUE EXCLUSIVO PARA ADMINS 
    Route::middleware('admin')->group(function () {
        
       // 1. Ruta para listar usuarios (la que estamos probando)
    Route::get('users', [UserController::class, 'index']); 
    
    // 2. Otras rutas manuales
    Route::post('users', [UserController::class, 'store']);
    Route::put('users/{id}', [UserController::class, 'update']);
    Route::patch('users/{id}/role', [UserController::class, 'updateRole']);
    Route::delete('users/{id}', [UserController::class, 'destroy']);

    // 3. CRUD de Productos
    Route::post('products', [ProductController::class, 'store']);
    Route::put('products/{id}', [ProductController::class, 'update']);
    Route::delete('products/{id}', [ProductController::class, 'destroy']);
    
    // 4. Dashboard
    Route::get('admin/dashboard', [AuthController::class, 'dashboardStats']);
    
    });
});