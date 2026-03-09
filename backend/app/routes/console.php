<?php

use App\Models\User;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('user:reset-password {email : Email del usuario} {password : Nueva contraseña (mín. 8, mayúscula, minúscula, número, símbolo)}', function () {
    $user = User::whereRaw('LOWER(email) = ?', [strtolower($this->argument('email'))])->first();
    if (! $user) {
        $this->error('No se encontró ningún usuario con ese email.');
        return 1;
    }
    $user->password = Hash::make($this->argument('password'));
    $user->save();
    $this->info('Contraseña actualizada para: ' . $user->email);
    return 0;
})->purpose('Restablecer contraseña de un usuario por email (útil para recuperar acceso admin)');
