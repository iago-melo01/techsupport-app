# Autenticação no Laravel (API) com JWT — roteiro de estudos

> Objetivo: entender **como a autenticação do Laravel funciona por dentro** (guards, providers, middleware, session vs token) e como aplicar isso em **APIs** usando **JWT** (com um pacote de JWT no ecossistema Laravel).

## 1) Pré-requisitos (fundamentos que você precisa dominar)

### HTTP/REST (essencial)
- **Headers**: `Authorization`, `Accept`, `Content-Type`, `Cookie`.
- **Status codes**: `200/201/204`, `400/401/403/404`, `422`, `429`, `500`.
- **CORS** e **preflight** (`OPTIONS`) em APIs.
- **Autenticação vs Autorização**: autenticar (quem é) ≠ autorizar (o que pode fazer).

### Segurança (essencial)
- **Hash de senha**: `bcrypt/argon2` (nunca armazenar senha em texto).
- **CSRF**: relevante em sessão/cookie (web), geralmente não é o mecanismo de proteção principal em JWT “stateless”.
- **XSS**: se você guardar token em `localStorage`, XSS vira crítico.
- **Rate limiting** e proteção contra brute force.
- **Rotação/revogação de tokens** quando necessário.

### PHP/Laravel (base)
- Middlewares, Service Container/DI, config/cache (`php artisan config:cache`), `.env`.
- Eloquent básico: `User`, `password` hashed, `find`, `where`, `create`.
- Requests/Responses: `Request`, `JsonResponse`, validação.

## 2) Como a autenticação do Laravel funciona (o coração do assunto)

### Conceitos-chave
- **Guard**: “como” o usuário é autenticado em cada request (ex.: `session`, `token`, `jwt`).
- **Provider**: “de onde” vem o usuário (ex.: Eloquent `users`).
- **Middleware `auth`**: força autenticação usando um guard (ex.: `auth:web`).

Arquivos e pontos para estudar:
- `config/auth.php`: defaults, guards e providers.
- `app/Models/User.php`: o que o modelo expõe (casts, hidden, etc.).
- Middlewares de autenticação no framework (conceito; você não precisa decorar internals, mas precisa entender o pipeline).

### Sessão (web) vs Token (API)
- **Session (stateful)**:
  - Backend mantém estado (session id).
  - Browser manda cookie automaticamente.
  - CSRF geralmente é necessário.
- **Token (stateless)**:
  - Cada request carrega credenciais (geralmente `Authorization: Bearer ...`).
  - Backend não precisa manter sessão (depende do tipo de token e estratégia de revogação).

## 3) JWT: o que é e o que NÃO é

### Estrutura e claims
- JWT tem 3 partes: `header.payload.signature`.
- Claims comuns:
  - `sub` (subject: id do usuário)
  - `iat` (issued at), `exp` (expires), `nbf` (not before)
  - `iss`, `aud` (quando aplicável)

### O que JWT resolve
- Autenticação stateless para APIs.
- Escala horizontal mais simples (sem sticky sessions), dependendo do desenho.

### Armadilhas comuns
- **“JWT é seguro por si só”**: não é. Segurança depende de storage do token, HTTPS, expiração, rotação etc.
- **Revogação**: JWT puro não “desloga” sozinho (a menos que você implemente blacklist/allowlist/versão de token).
- **Tamanho do token**: não coloque dados sensíveis no payload.

## 4) Ecossistema Laravel: opções de autenticação para APIs

### Opção A — Sanctum (já está no projeto)
Use quando:
- Você quer **SPA** (cookie + CSRF) ou **API tokens** simples (personal access tokens).

Prós:
- Oficial, simples, ótimo para a maioria dos casos.

Contras:
- Não é JWT (se seu requisito é “tem que ser JWT”, você vai para a opção B).

### Opção B — JWT (com pacote)
Use quando:
- Você precisa de **JWT** por integração/infra/requisito.

Pacotes conhecidos (pesquise e escolha 1):
- `tymon/jwt-auth` (popular no ecossistema).
- Alternativas existem; avalie suporte à versão do Laravel/PHP e manutenção ativa.

> Critério de escolha: compatibilidade com Laravel 12/PHP 8.2, manutenção recente, suporte a refresh token, integração com guard, documentação e issues.

## 5) O que estudar para implementar JWT “do jeito Laravel”

### 5.1 Guard `jwt` e middleware
Você precisa entender:
- Como registrar um **guard** novo no `config/auth.php` (ex.: `api` com driver `jwt`).
- Como usar rotas protegidas com middleware:
  - `Route::middleware('auth:api')->group(...)`
- Como o Laravel injeta o usuário autenticado:
  - `auth()->user()`, `Auth::user()`, `$request->user()`

### 5.2 Fluxos principais (você deve saber explicar e implementar)
- **Login**:
  - valida credenciais (email/senha)
  - emite `access_token` (JWT)
  - retorna JSON com token e expiração
- **Me**:
  - retorna o usuário autenticado
- **Refresh**:
  - troca token expirando por um novo (se sua estratégia usar refresh)
- **Logout**:
  - invalida token (depende da estratégia do pacote: blacklist, token version, etc.)

### 5.3 Onde colocar cada coisa (boas práticas)
- **Form Requests** para validação (`LoginRequest`, `RegisterRequest`).
- **AuthController** enxuto.
- **Service** (ex.: `AuthService`) para lógica de emissão/refresh/revogação.
- **Policies/Gates** para autorização.

## 6) Checklist de segurança para JWT em produção

- **HTTPS obrigatório**.
- **Expiração curta** para access token (ex.: 5–30 min).
- **Refresh token** (se aplicável) com expiração maior e rotação.
- **Rate limit** em endpoints sensíveis (`login`, `refresh`).
- **Logs** sem vazar token (nunca logar `Authorization`).
- **CORS** bem configurado (origens permitidas).
- **Armazenamento do token no front**:
  - Evitar `localStorage` quando possível (risco de XSS).
  - Se for usar cookie, precisa desenhar com cuidado (HttpOnly/SameSite/CSRF).

## 7) Testes que você precisa saber fazer

### Feature tests (mínimo)
- `POST /api/login`:
  - credenciais inválidas -> `401`
  - válidas -> `200` com `access_token`
- `GET /api/me`:
  - sem token -> `401`
  - com token -> `200` com usuário

### Testes de autorização
- Rotas com permissões/roles (Policies).
- Cenários `403` (autenticado mas sem permissão).

## 8) Roteiro de estudo (ordem sugerida)

1. **Laravel Auth básico**: guards, providers, middleware `auth`.
2. **Sessão vs token**: quando usar cada um.
3. **Sanctum**: entenda por quê ele resolve muitos casos.
4. **JWT teórico**: claims, expiração, revogação, refresh.
5. **JWT no Laravel**: instalar pacote, configurar guard, criar endpoints, proteger rotas.
6. **Segurança**: armazenamento, rate limit, CORS, logs.
7. **Testes**: feature tests para login/me/refresh/logout.

## 9) Referências (para leitura)

- Documentação oficial do Laravel:
  - Autenticação, autorização (Policies/Gates), middleware, requests/validation.
- Documentação do pacote JWT que você escolher (ex.: `tymon/jwt-auth`).
- OWASP:
  - tópicos de autenticação, gestão de sessão e XSS.

---

## Próximo passo (se você quiser)

Se você me disser **qual pacote JWT** você quer usar (ex.: `tymon/jwt-auth`) e **qual tipo de front** (SPA, mobile, server-rendered), eu consigo:
- ajustar essa doc para o seu caso,
- e (se você quiser) já implementar o fluxo completo no seu `backend` (rotas, controller, requests, middleware, testes).







