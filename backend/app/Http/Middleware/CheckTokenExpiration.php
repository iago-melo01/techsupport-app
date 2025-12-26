<?php

namespace App\Http\Middleware;

use App\Helpers\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckTokenExpiration
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $accessToken = $request->bearerToken();

        return match(true){ // retorna o caso que a condicão for true
            // se não houver token, retorna erro 401
            !accessToken => ApiResponse::error('Token não encontrado', 401),

            

        }
        return $next($request);
    }
}
