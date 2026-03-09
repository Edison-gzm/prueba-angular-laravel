<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    /**
     * Indica si la petición de registro está autorizada (siempre true para registro público).
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Reglas de validación: nombre, email único y contraseña con mayúsculas, minúsculas, números y símbolos.
     *
     * @return array<string, mixed>
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

    /**
     * Mensajes personalizados para los errores de validación del registro.
     *
     * @return array<string, string>
     */
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
