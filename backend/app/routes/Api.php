<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;


//---------------------------------------------------------------------

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);   
});


//---------------------------------------------------
 
 Route::middleware('auth:sanctum')->group(function () {

    //profile and logout
    Route::get('/auth/profile', [AuthController::class, 'profile']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    //Prodcuto-users
    Route::get('products', [ProductController::class, 'index']);
    Route::get('products/{id}', [ProductController::class, 'show']);
    Route::post('products/buy', [ProductController::class, 'buy']);


  //---------------------------------------------------------------
    Route::middleware('admin')->group(function () {
        
     
    Route::get('users', [UserController::class, 'index']); 
    
   //CRUD de Admin
    Route::post('users', [UserController::class, 'store']);
    Route::get('users/{id}', [UserController::class, 'show']);
    Route::put('users/{id}', [UserController::class, 'update']);
    Route::patch('users/{id}/role', [UserController::class, 'updateRole']);
    Route::delete('users/{id}', [UserController::class, 'destroy']);

    //CRUD de Products/admin
    Route::post('products', [ProductController::class, 'store']);
    Route::put('products/{id}', [ProductController::class, 'update']);
    Route::delete('products/{id}', [ProductController::class, 'destroy']);
    

    Route::get('admin/dashboard', [AuthController::class, 'dashboardStats']);
    
    
    });
});