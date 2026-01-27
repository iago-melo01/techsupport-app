<?php

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Cookie;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Hash;

class AuthService
{

    private const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token';
    private const REFRESH_TOKEN_COOKIE_LIFETIME = 20160; //14 dias em minutos

    public function login(array $credentials): JsonResponse
    {
        //retorna o valor de 'throttleKey' e remove ele do array credentials
        $throttleKey = Arr::pull($credentials, 'throttleKey');


        if ($throttleKey && RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            throw ValidationException::withMessages([
                'email' => 'Você fez muitas tentativas de login. Tente novamente em ' . ceil($seconds / 60) . ' minutos',
            ]);
        }


        $user = User::where('email', $credentials['email'])->first();


        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            RateLimiter::hit($throttleKey, 60);
            throw ValidationException::withMessages([
                'email' => 'As credenciais estão inválidas',
            ]);
        }

        if ($user->status !== 'active') {
            throw ValidationException::withMessages([
                'email' => 'Conta desativada'
            ]);
        }


        try {
            $token = JWTAuth::fromUser($user);
        } catch (JWTException $e) {
            throw ValidationException::withMessages([
                'email' => 'Erro ao processar autenticação. Tente novamente.',
            ]);
        }


        RateLimiter::clear($throttleKey);


        $refreshToken = $this->generateRefreshToken($user);


        $response = $this->respondWithToken($token, $user, $refreshToken);

        return $response;
    }



    /**
     * Atualiza o access token usando o refresh token do cookie
     * 
     * @return JsonResponse Resposta com novo access token e refresh token atualizado
     * @throws ValidationException Se o refresh token não existir ou estiver inválido/expirado
     */
    public function refresh(): JsonResponse
    {
        try {
            // 1. Verifica se o refresh token existe no cookie
            $refreshToken = request()->cookie(self::REFRESH_TOKEN_COOKIE_NAME);

            if (!$refreshToken) {
                throw ValidationException::withMessages([
                    'refresh_token' => 'Token de atualização não encontrado'
                ]);
            }

            // define o token no guard de validacao
            JWTAuth::setToken($refreshToken);


            // se o token for invalido, lança excecao automaticamente
            $payload = JWTAuth::getPayload();

            $tokenType = $payload->get('type');

            if ($tokenType == null || $tokenType !== 'refresh') {
                throw ValidationException::withMessages([
                    'refresh_token' => 'Tipo de token inválido. Use um refresh token.'
                ]);
            }

            $userId = $payload->get('sub');
            // pega o usuario do token
            $user = User::find($userId);

            if (!$user) {
                throw ValidationException::withMessages([
                    'refresh_token' => 'Usuário não encontrado para o token fornecido'
                ]);
            }

            // 5. Gera novo access token (refresh do token atual)
            $newToken = JWTAuth::fromUser($user);

            // 6. Gera novo refresh token (rotação de tokens para maior segurança)
            $newRefreshToken = $this->generateRefreshToken($user);

            // 7. Retorna novo access token e atualiza o refresh token no cookie
            return $this->respondWithToken($newToken, $user, $newRefreshToken);
        } catch (JWTException $e) {
            throw ValidationException::withMessages([
                'refresh_token' => 'Token inválido ou expirado. Faça login novamente.'
            ]);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'refresh_token' => 'Erro ao atualizar token. Tente fazer login novamente.'
            ]);
        }
    }

    /**
     * Gera um refresh token com TTL maior que o access token
     * 
     * @param User $user Usuário para gerar o token
     * @return string Refresh token JWT
     */
    private function generateRefreshToken(User $user): string
    {
        // Obtém o refresh TTL em minutos
        $refreshTtl = config('jwt.refresh_ttl', 20160); // 14 dias por padrão

        // Obtém os claims customizados do modelo User
        $customClaims = $user->getJWTCustomClaims();

        // Prepara os claims do token
        $claims = [
            'sub' => $user->getKey(), // Subject (ID do usuário)
            'type' => 'refresh', // Tipo do token
        ];

        // Adiciona os claims customizados do modelo
        $claims = array_merge($claims, $customClaims);

        // Usa o factory para criar o Payload com TTL customizado
        // O factory calcula automaticamente iss, iat, exp, nbf, jti
        $payload = JWTAuth::factory()
            ->setTTL($refreshTtl)
            ->customClaims($claims)
            ->make();

        // Codifica o payload em um token JWT
        return JWTAuth::manager()->encode($payload)->get();
    }

    /**
     * Retorna resposta formatada com access token em JSON e refresh token em cookie HttpOnly
     * 
     * @param string $token Access token JWT
     * @param User $user Usuário autenticado
     * @param string $refreshToken Refresh token JWT
     * @return JsonResponse Resposta JSON com cookie
     */
    private function respondWithToken(string $token, User $user, string $refreshToken): JsonResponse
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60, // em segundos
            'user' => [
                'uuid' => $user->uuid,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ])->cookie(
            self::REFRESH_TOKEN_COOKIE_NAME,
            $refreshToken,
            self::REFRESH_TOKEN_COOKIE_LIFETIME, // minutos
            '/', // path
            null, // domain (null = domínio atual)
            config('session.secure', false), // secure (HTTPS em produção)
            true, // httpOnly (não acessível via JavaScript)
            false, // raw
            config('session.same_site', 'lax') // sameSite: 'lax', 'strict' ou 'none'
        );
    }

    private function clearRefreshTokenCookie(): Cookie
    {
        return cookie(
            self::REFRESH_TOKEN_COOKIE_NAME,
            null, //valor null remove o cookie do navegador
            -1,  //-1 remove imediatamente
            '/', // path
            null, // domain (null = domínio atual)
            config('session.secure', false), // secure (HTTPS em produção)
            true, // httpOnly (não acessível via JavaScript)
            false, // raw
            config('session.same_site', 'lax') // sameSite: 'lax', 'strict' ou 'none'
        );
    }
    public function logout(): JsonResponse
    {

        try {
            $token = JWTAuth::getToken();

            if ($token) {
                //invalida o token na cache definida (nessa caso é a tabela do banco cache)
                //será removido do banco quando o token expirar
                JWTAuth::invalidate($token);
            }

            $refreshToken = request()->cookie(self::REFRESH_TOKEN_COOKIE_NAME);

            if ($refreshToken) {
                try {
                    JWTAuth::setToken($refreshToken);
                    JWTAuth::invalidate();
                } catch (JWTException $e) {
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Logout realizado com sucesso',
            ])->cookie($this->clearRefreshTokenCookie());
        } catch (JWTException $e) {
            // se o token ja foi invalidado ou não existe, ainda assim limpa o cookie

            return response()->json([
                'success' => true,
                'message' => 'Logout realizado com sucesso',
            ])->cookie($this->clearRefreshTokenCookie());
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'logout' => 'Erro ao realizar logout. Tente novamente.'
            ]);
        }
    }

    public function me(): JsonResponse
    {
        try {
            $user = Auth::guard('api')->user();

            if (!$user) {
                throw ValidationException::withMessages([
                    'auth' => 'Usuário não autenticado'
                ]);
            }

            return response()->json([
                'success' => true,
                'user' => [
                    'uuid' => $user->uuid,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ]
            ]);
        } catch (JWTException $e) {
            throw ValidationException::withMessages([
                'auth' => 'Token inválido ou expirado. Faça Login Novamente'
            ]);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'auth' => 'Erro ao recuperar dados do usuário.'
            ]);
        }
    }
}
