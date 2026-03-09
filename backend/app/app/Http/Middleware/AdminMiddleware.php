<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Comprueba que el usuario esté autenticado y tenga rol admin; si no, devuelve 401 o 403.
     *
     * @param Request $request
     * @param Closure $next
     * @return Response
     */
    public function handle($request, Closure $next)
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        if (auth()->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Acceso denegado. Se requiere rol de Administrador.'
            ], 403);
        }
        return $next($request);
    }
}
