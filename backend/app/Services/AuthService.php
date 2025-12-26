<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;
class AuthService 
{

    private const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token';
    private const REFRESH_TOKEN_COOKIE_LIFETIME = 20160; //14 dias em minutos

    public function store(array $credentials): JsonResponse
    {
        //retorna o valor de 'throttleKey' e remove ele do array credentials
        $throttleKey = Arr::pull($credentials, 'throttleKey');
    
        if($throttleKey && RateLimiter::tooManyAttempts($throttleKey, 5)){
            $seconds = RateLimiter::availableIn($throttleKey);
            throw ValidationException::withMessages([
                'email' => 'Você fez muitas tentativas de login. Tente novamente em ' . ceil($seconds / 60) . ' minutos',
            ]);
        }
        
        try {
            $token = Auth::guard('api')->attempt($credentials);
        } catch (JWTException $e) {
            throw ValidationException::withMessages([
                'email' => 'Erro ao processar autenticação. Tente novamente.',
            ]);
        }
        
        if(!$token){
            RateLimiter::hit($throttleKey, 60); //DecaySeconds é o tempo que essa chave
            //permanecerá no redis, após isso, ela será excluida e o usuario podera fazer 
            //uma outra tentativa de login sem ser bloqueado

            throw ValidationException::withMessages([
                    'email' => 'As credenciais estão inválidas'
                ]);
        }

        RateLimiter::clear($throttleKey);

        $user = Auth::guard('api')->user();

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => 'Erro ao recuperar dados do usuário.',
            ]);
        }

        $refreshToken = $this->generateRefreshToken($user);
        
        return $this->respondWithToken($token, $user, $refreshToken);
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

            // 2. Define o token no guard para validação
            JWTAuth::setToken($refreshToken);

            // 3. Valida o token e verifica se está ativo (não expirado)
            // O getPayload() lança exceção automaticamente se o token for inválido ou expirado
            $payload = JWTAuth::getPayload();
            
            // Verificação adicional de expiração
            $exp = $payload->get('exp');
            if ($exp && $exp < time()) {
                throw ValidationException::withMessages([
                    'refresh_token' => 'Token de atualização expirado'
                ]);
            }

            // 4. Obtém o usuário do token validado
            $user = Auth::guard('api')->user();
            
            if (!$user) {
                throw ValidationException::withMessages([
                    'refresh_token' => 'Usuário não encontrado para o token fornecido'
                ]);
            }

            // 5. Gera novo access token (refresh do token atual)
            // O método refresh() do JWTAuth valida e gera novo token automaticamente
            $newToken = JWTAuth::refresh();

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
        // Cria token com TTL de refresh (14 dias por padrão) e claim customizado
        return JWTAuth::customClaims([
            'type' => 'refresh',
        ])->setTTL(config('jwt.refresh_ttl'))->fromUser($user);
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
            config('jwt.refresh_ttl'), // minutos
            '/', // path
            null, // domain (null = domínio atual)
            config('session.secure', false), // secure (HTTPS em produção)
            true, // httpOnly (não acessível via JavaScript)
            false, // raw
            config('session.same_site', 'lax') // sameSite: 'lax', 'strict' ou 'none'
        );
    }
}
