<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class AuthService 
{
    public function login(string $email, string $password, string $throttleKey) {
        $credentials = [
        'email' => $email,
        'password' => $password
    ];

        $token = Auth::guard('api')->attempt($credentials);

        if(!$token = Auth::guard('api')->attempt($credentials)){
            RateLimiter::hit($throttleKey, 60); //DecaySeconds é o tempo que essa chave
            //permanecerá no redis, após isso, ela será excluida e o usuario podera fazer 
            //uma outra tentativa de login sem ser bloqueado

            throw ValidationException::withMessages([
                    'email' => 'As credenciais estão inválidas'
                ]);
        }

        RateLimiter::clear($throttleKey);

        $user = Auth::guard('api')->user();

        $refreshToken = $this->generateRefreshToken($user);
        return [
            'access_token' => $token,
            'refresh_token' => $refreshToken,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60,
            'user' => [
                'uuid' => $user->uuid,
                'name' => $user->name, 
                'email' => $user->email,
                'role' => $user->role,
            ],

        ];
    }

    private function generateRefreshToken(User $user) {


    }


}