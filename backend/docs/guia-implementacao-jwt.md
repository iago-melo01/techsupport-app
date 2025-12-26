# Guia Completo: Implementação de Autenticação JWT

## 📋 Estado Atual do Projeto

### ✅ O que já está configurado:

1. **Pacote JWT instalado**: `tymon/jwt-auth` já está no `composer.json`
2. **Configuração JWT publicada**: Arquivo `config/jwt.php` existe
3. **Guard configurado**: Guard `api` com driver `jwt` em `config/auth.php`
4. **Default guard**: Configurado para usar `api`
5. **User Model**: Já tem `HasUuids` trait
6. **Helper ApiResponse**: Criado e funcional
7. **Middleware básico**: `CheckTokenExpiration` existe (mas precisa correção)

### ❌ O que ainda precisa ser feito:

1. **User Model**: Falta implementar interface `JWTSubject`
2. **Chave JWT**: Precisa gerar `JWT_SECRET` no `.env`
3. **AuthController**: Está incompleto, falta implementar métodos
4. **Form Requests**: Não existem (validação de login/register)
5. **Rotas**: Falta definir rotas de autenticação
6. **Middleware**: `CheckTokenExpiration` tem erro de sintaxe
7. **Tratamento de exceções**: Não configurado
8. **Testes**: Não existem

---

## 🎯 Conceitos Fundamentais que Você Precisa Entender

### 1. O que é JWT?

**JWT (JSON Web Token)** é um padrão aberto (RFC 7519) que define uma forma compacta e segura de transmitir informações entre partes como um objeto JSON.

**Estrutura do JWT:**
```
header.payload.signature
```

- **Header**: Tipo do token e algoritmo de assinatura
- **Payload**: Dados (claims) como ID do usuário, expiração, etc.
- **Signature**: Assinatura para verificar integridade

**Exemplo de token:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### 2. Guard vs Provider vs Driver

#### Guard
**O que é:** Define **COMO** o usuário é autenticado em cada requisição.

**Exemplos:**
- `session`: Autenticação via cookies/sessão (web tradicional)
- `jwt`: Autenticação via token JWT (APIs)
- `token`: Autenticação via token simples

**No seu projeto:**
```php
'guards' => [
    'api' => [
        'driver' => 'jwt',        // ← Como: via JWT
        'provider' => 'users',    // ← De onde: provider 'users'
    ]
]
```

#### Provider
**O que é:** Define **DE ONDE** vêm os dados do usuário (banco de dados).

**No seu projeto:**
```php
'providers' => [
    'users' => [
        'driver' => 'eloquent',                    // ← Como buscar: Eloquent ORM
        'model' => App\Models\User::class,         // ← Qual modelo: User
    ]
]
```

#### Driver
**O que é:** O mecanismo técnico usado pelo guard.

**Exemplos:**
- `session`: Usa cookies e sessão do Laravel
- `jwt`: Usa tokens JWT (tymon/jwt-auth)
- `database`: Busca direto no banco (não usado normalmente)

### 3. Fluxo de Autenticação JWT

```mermaid
sequenceDiagram
    participant Client as Cliente (Frontend)
    participant API as API Laravel
    participant JWT as JWT Service
    participant DB as Database

    Client->>API: POST /api/login (email, password)
    API->>DB: Buscar usuário por email
    DB-->>API: Dados do usuário
    API->>API: Verificar senha (Hash::check)
    API->>JWT: Gerar token JWT
    JWT-->>API: Token gerado
    API-->>Client: { access_token, refresh_token, user }

    Note over Client: Token armazenado (localStorage/cookie)

    Client->>API: GET /api/me (Header: Authorization: Bearer {token})
    API->>JWT: Validar token
    JWT->>DB: Buscar usuário do token
    DB-->>JWT: Dados do usuário
    JWT-->>API: Usuário autenticado
    API-->>Client: { user data }

    Client->>API: POST /api/refresh (refresh_token)
    API->>JWT: Validar refresh token
    JWT-->>API: Token válido
    API->>JWT: Gerar novo access token
    JWT-->>API: Novo token
    API-->>Client: { access_token, refresh_token }

    Client->>API: POST /api/logout (Bearer token)
    API->>JWT: Invalidar token (blacklist)
    JWT-->>API: Token invalidado
    API-->>Client: { message: "Logout realizado" }
```

### 4. Access Token vs Refresh Token

#### Access Token
- **Tempo de vida curto**: 30 minutos a 1 hora (no seu projeto: 30 min)
- **Usado em todas as requisições**: Header `Authorization: Bearer {token}`
- **Contém dados do usuário**: ID, role, etc.
- **Expira rapidamente**: Para limitar danos se roubado

#### Refresh Token
- **Tempo de vida longo**: 1-2 semanas (no seu projeto: 14 dias)
- **Usado apenas para renovar**: Endpoint `/api/refresh`
- **Não contém dados sensíveis**: Apenas referência para renovação
- **Armazenado de forma mais segura**: HttpOnly cookie (se possível)

**Por que dois tokens?**
- Segurança: Se access token for roubado, expira rápido
- UX: Usuário não precisa fazer login toda hora
- Controle: Você pode revogar refresh tokens individualmente

---

## 📝 Checklist de Implementação

### Fase 1: Configuração Básica ✅ (Já feito parcialmente)

- [x] Instalar `tymon/jwt-auth`
- [x] Publicar configuração (`config/jwt.php`)
- [x] Configurar guard `api` com driver `jwt`
- [ ] Gerar `JWT_SECRET` no `.env`
- [ ] Implementar `JWTSubject` no User model

### Fase 2: Model e Interface

- [ ] Adicionar interface `JWTSubject` no User
- [ ] Implementar método `getJWTIdentifier()`
- [ ] Implementar método `getJWTCustomClaims()`

### Fase 3: Form Requests (Validação)

- [ ] Criar `LoginRequest`
- [ ] Criar `RegisterRequest` (se necessário)

### Fase 4: Controller

- [ ] Implementar método `login()`
- [ ] Implementar método `me()`
- [ ] Implementar método `refresh()`
- [ ] Implementar método `logout()`

### Fase 5: Rotas

- [ ] Definir rotas públicas (login, refresh)
- [ ] Definir rotas protegidas (me, logout)
- [ ] Adicionar rate limiting nas rotas de login

### Fase 6: Middleware e Exceções

- [ ] Corrigir `CheckTokenExpiration` (ou usar middleware do JWT)
- [ ] Configurar tratamento de exceções JWT
- [ ] Atualizar `bootstrap/app.php` se necessário

### Fase 7: Testes

- [ ] Teste de login com credenciais válidas
- [ ] Teste de login com credenciais inválidas
- [ ] Teste de acesso protegido sem token
- [ ] Teste de acesso protegido com token válido
- [ ] Teste de refresh token
- [ ] Teste de logout

---

## 🔧 Implementação Passo a Passo

### Passo 1: Gerar JWT Secret

Execute no terminal:
```bash
php artisan jwt:secret
```

Isso irá:
- Gerar uma chave aleatória
- Adicionar `JWT_SECRET=...` no arquivo `.env`
- A chave é usada para assinar e validar tokens

### Passo 2: Atualizar User Model

O modelo `User` precisa implementar a interface `Tymon\JWTAuth\Contracts\JWTSubject`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable, HasUuids;

    // ... código existente ...

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     * 
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey(); // Retorna o ID do usuário (ou UUID)
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     * 
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [
            'role' => $this->role,
            'uuid' => $this->uuid,
            // Adicione outros claims que desejar
        ];
    }
}
```

**Explicação:**
- `getJWTIdentifier()`: Retorna o que será usado como `sub` (subject) no token (geralmente ID ou UUID)
- `getJWTCustomClaims()`: Dados extras que você quer incluir no token (role, uuid, etc.)

### Passo 3: Criar Form Requests

#### LoginRequest

Criar: `app/Http/Requests/Auth/LoginRequest.php`

```php
<?php

declare(strict_types=1);

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Qualquer um pode tentar fazer login
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:8'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'O email é obrigatório.',
            'email.email' => 'O email deve ser um endereço válido.',
            'password.required' => 'A senha é obrigatória.',
            'password.min' => 'A senha deve ter pelo menos 8 caracteres.',
        ];
    }
}
```

### Passo 4: Implementar AuthController

#### Estrutura completa do AuthController

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    /**
     * Login do usuário e geração de tokens
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');

        try {
            // Tentar autenticar e gerar token
            if (! $token = auth()->attempt($credentials)) {
                return ApiResponse::error('Credenciais inválidas', 401);
            }
        } catch (JWTException $e) {
            return ApiResponse::error('Não foi possível criar o token', 500);
        }

        $user = auth()->user();

        return ApiResponse::success('Login realizado com sucesso', 200, [
            'data' => [
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => auth()->factory()->getTTL() * 60, // em segundos
                'user' => [
                    'uuid' => $user->uuid,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
            ],
        ]);
    }

    /**
     * Retorna os dados do usuário autenticado
     */
    public function me(): JsonResponse
    {
        $user = auth()->user();

        return ApiResponse::success('Dados do usuário', 200, [
            'data' => [
                'uuid' => $user->uuid,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status,
            ],
        ]);
    }

    /**
     * Renova o access token usando o refresh token
     */
    public function refresh(): JsonResponse
    {
        try {
            $token = auth()->refresh();
            $user = auth()->user();

            return ApiResponse::success('Token renovado com sucesso', 200, [
                'data' => [
                    'access_token' => $token,
                    'token_type' => 'bearer',
                    'expires_in' => auth()->factory()->getTTL() * 60,
                    'user' => [
                        'uuid' => $user->uuid,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                    ],
                ],
            ]);
        } catch (JWTException $e) {
            return ApiResponse::error('Token inválido ou expirado', 401);
        }
    }

    /**
     * Logout e invalidação do token
     */
    public function logout(): JsonResponse
    {
        try {
            auth()->logout();

            return ApiResponse::success('Logout realizado com sucesso');
        } catch (JWTException $e) {
            return ApiResponse::error('Erro ao fazer logout', 500);
        }
    }
}
```

**Pontos importantes:**
- `auth()->attempt()`: Tenta autenticar e retorna token se sucesso
- `auth()->user()`: Retorna usuário autenticado do token
- `auth()->refresh()`: Gera novo token baseado no atual
- `auth()->logout()`: Invalida o token atual (blacklist)

### Passo 5: Definir Rotas

Atualizar `routes/api.php`:

```php
<?php

use App\Http\Controllers\Auth\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Rotas públicas (sem autenticação)
Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1'); // Limite de 5 tentativas por minuto

Route::post('/refresh', [AuthController::class, 'refresh'])
    ->middleware('throttle:10,1'); // Limite de 10 por minuto

// Rotas protegidas (requerem autenticação)
Route::middleware('auth:api')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Exemplo de rota protegida existente
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:api');
```

**Explicação das rotas:**
- `/api/login`: POST com email e password → retorna tokens
- `/api/refresh`: POST com refresh token → retorna novo access token
- `/api/me`: GET com Bearer token → retorna dados do usuário
- `/api/logout`: POST com Bearer token → invalida o token

### Passo 6: Corrigir/Atualizar Middleware

O middleware `CheckTokenExpiration` tem um erro. Você pode:

**Opção 1:** Remover e usar o middleware do JWT diretamente

O `tymon/jwt-auth` já fornece middleware próprio. Basta usar `auth:api` nas rotas.

**Opção 2:** Corrigir o middleware existente

```php
<?php

namespace App\Http\Middleware;

use App\Helpers\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class CheckTokenExpiration
{
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $token = $request->bearerToken();

            if (!$token) {
                return ApiResponse::error('Token não encontrado', 401);
            }

            // Tentar autenticar o token
            JWTAuth::parseToken()->authenticate();

        } catch (JWTException $e) {
            return ApiResponse::error('Token inválido ou expirado', 401);
        }

        return $next($request);
    }
}
```

**Mas recomendo:** Remover esse middleware e usar apenas `auth:api` do Laravel/JWT.

### Passo 7: Tratamento de Exceções JWT

Atualizar `bootstrap/app.php`:

```php
->withExceptions(function (Exceptions $exceptions): void {
    $exceptions->render(function (Tymon\JWTAuth\Exceptions\TokenExpiredException $e, $request) {
        if ($request->is('api/*')) {
            return ApiResponse::error('Token expirado', 401);
        }
    });

    $exceptions->render(function (Tymon\JWTAuth\Exceptions\TokenInvalidException $e, $request) {
        if ($request->is('api/*')) {
            return ApiResponse::error('Token inválido', 401);
        }
    });

    $exceptions->render(function (Tymon\JWTAuth\Exceptions\JWTException $e, $request) {
        if ($request->is('api/*')) {
            return ApiResponse::error('Erro ao processar token', 401);
        }
    });
})
```

---

## 🧪 Testando a Implementação

### Teste Manual com cURL ou Postman

#### 1. Login
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "password123"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "token_type": "bearer",
    "expires_in": 1800,
    "user": {
      "uuid": "...",
      "name": "Teste",
      "email": "teste@example.com",
      "role": "user"
    }
  }
}
```

#### 2. Acessar rota protegida (me)
```bash
curl -X GET http://localhost:8000/api/me \
  -H "Authorization: Bearer {seu_token_aqui}"
```

#### 3. Refresh token
```bash
curl -X POST http://localhost:8000/api/refresh \
  -H "Authorization: Bearer {refresh_token_aqui}"
```

#### 4. Logout
```bash
curl -X POST http://localhost:8000/api/logout \
  -H "Authorization: Bearer {seu_token_aqui}"
```

---

## 🔒 Segurança: Boas Práticas

### 1. HTTPS Obrigatório em Produção
```php
// Adicionar no AppServiceProvider
if (app()->environment('production')) {
    URL::forceScheme('https');
}
```

### 2. Expiração de Tokens
- Access token: 30 minutos (já configurado no seu `config/jwt.php`)
- Refresh token: 14 dias (já configurado)

### 3. Rate Limiting
Já implementado nas rotas de login e refresh:
```php
->middleware('throttle:5,1') // 5 tentativas por minuto
```

### 4. Blacklist de Tokens
Já habilitado no `config/jwt.php`:
```php
'blacklist_enabled' => env('JWT_BLACKLIST_ENABLED', true),
```

### 5. Não Logar Tokens
Nunca faça:
```php
Log::info('Token:', ['token' => $token]); // ❌ NUNCA FAÇA ISSO
```

### 6. CORS Configurado
Configure adequadamente no `config/cors.php` para permitir apenas origens confiáveis.

---

## 📚 Recursos e Referências

### Documentação Oficial
- [tymon/jwt-auth GitHub](https://github.com/tymondesigns/jwt-auth)
- [Laravel Authentication](https://laravel.com/docs/authentication)

### Conceitos Importantes
- [JWT.io](https://jwt.io/) - Ferramenta para decodificar tokens
- [RFC 7519 - JWT](https://tools.ietf.org/html/rfc7519)

### Testes
Use [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/) para testar as rotas.

---

## ❓ FAQ - Perguntas Frequentes

### Q: O token expira muito rápido?
A: Ajuste `JWT_TTL` no `.env` (em minutos). Recomendação: 30-60 minutos para access token.

### Q: Como invalidar um token antes de expirar?
A: Use `auth()->logout()`. O token será adicionado à blacklist.

### Q: Posso ter múltiplos guards?
A: Sim! Você pode ter `web` (session) e `api` (jwt) ao mesmo tempo.

### Q: Como incluir mais dados no token?
A: Adicione em `getJWTCustomClaims()` no User model. Mas cuidado: tokens grandes são mais lentos.

### Q: Refresh token também expira?
A: Sim, mas tem tempo maior (14 dias por padrão). Após expirar, usuário precisa fazer login novamente.

---

## ✅ Próximos Passos Após Implementação

1. **Criar testes automatizados** (Feature tests)
2. **Implementar reset de senha** (se necessário)
3. **Adicionar verificação de email** (opcional)
4. **Implementar refresh token rotation** (mais segurança)
5. **Adicionar logs de auditoria** (quem fez login, quando, etc.)
6. **Configurar monitoring** (alertas para tentativas de login suspeitas)

---

**Última atualização:** Dezembro 2024
**Laravel Version:** 12.x
**JWT Package:** tymon/jwt-auth 2.2





