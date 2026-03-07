<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
   
    public function authorize(): bool
    {
        return true;
    }

 /**
     * Aquí definimos las condiciones de la contraseña
     */
    public function rules(): array
    {
        return [
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
           'password' => [
                'required',
            'string',
            Password::min(8)
                ->mixedCase()
                ->numbers()
                ->symbols(),
            ],
       
        ];
    }

    public function messages(): array
{
    return [
        'email.unique' => 'Este correo ya está registrado en nuestro sistema.',
        'password.min' => 'La contraseña es muy corta, necesita al menos 8 caracteres.',
        'password.mixed'   => 'La contraseña debe tener al menos una mayúscula y una minúscula.',
        'password.symbols' => '¡Cuidado! Te falta un carácter especial (como @, #, $, !).',
        'password.numbers' => 'Debes incluir al menos un número.',
        //'password'  => 'La contraseña no cumple con los requisitos de seguridad (mayúsculas, números o símbolos).',
    ];
}
}
