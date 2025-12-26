# ✅ Checklist de Implementação JWT

Use este checklist para acompanhar o progresso da implementação.

## Fase 1: Configuração Inicial

- [ ] 1.1. Verificar instalação do pacote `tymon/jwt-auth` no `composer.json`
- [ ] 1.2. Verificar existência do arquivo `config/jwt.php`
- [ ] 1.3. Gerar chave JWT: `php artisan jwt:secret`
- [ ] 1.4. Verificar variável `JWT_SECRET` no `.env`
- [ ] 1.5. Verificar guard `api` configurado em `config/auth.php`
- [ ] 1.6. Verificar default guard como `api` em `config/auth.php`

## Fase 2: User Model

- [ ] 2.1. Adicionar `use Tymon\JWTAuth\Contracts\JWTSubject;` no User
- [ ] 2.2. Implementar interface: `class User extends Authenticatable implements JWTSubject`
- [ ] 2.3. Implementar método `getJWTIdentifier()` retornando `$this->getKey()`
- [ ] 2.4. Implementar método `getJWTCustomClaims()` com claims customizados (role, uuid, etc.)

## Fase 3: Form Requests

- [ ] 3.1. Criar diretório `app/Http/Requests/Auth/`
- [ ] 3.2. Criar `LoginRequest.php` com validação de email e password
- [ ] 3.3. Adicionar mensagens de validação em português
- [ ] 3.4. (Opcional) Criar `RegisterRequest.php` se necessário

## Fase 4: AuthController

- [ ] 4.1. Corrigir imports no `AuthController` (adicionar ApiResponse, JWTException, etc.)
- [ ] 4.2. Implementar método `login()` completo
- [ ] 4.3. Implementar método `me()` completo
- [ ] 4.4. Implementar método `refresh()` completo
- [ ] 4.5. Implementar método `logout()` completo
- [ ] 4.6. Testar todos os métodos manualmente

## Fase 5: Rotas

- [ ] 5.1. Criar rota `POST /api/login` com rate limiting
- [ ] 5.2. Criar rota `POST /api/refresh` com rate limiting
- [ ] 5.3. Criar rota `GET /api/me` protegida com `auth:api`
- [ ] 5.4. Criar rota `POST /api/logout` protegida com `auth:api`
- [ ] 5.5. Atualizar rota `/api/user` existente para usar `auth:api`
- [ ] 5.6. Remover referências a `auth:sanctum` se existirem

## Fase 6: Middleware e Exceções

- [ ] 6.1. Decidir: manter `CheckTokenExpiration` ou remover (recomendado: remover)
- [ ] 6.2. Se manter, corrigir erro de sintaxe (`!accessToken` → `!$accessToken`)
- [ ] 6.3. Atualizar `bootstrap/app.php` com tratamento de exceções JWT
- [ ] 6.4. Testar respostas de erro (token inválido, expirado, etc.)

## Fase 7: Testes Manuais

- [ ] 7.1. Testar login com credenciais válidas
- [ ] 7.2. Testar login com credenciais inválidas (deve retornar 401)
- [ ] 7.3. Testar `/api/me` sem token (deve retornar 401)
- [ ] 7.4. Testar `/api/me` com token válido (deve retornar dados do usuário)
- [ ] 7.5. Testar `/api/refresh` com token válido
- [ ] 7.6. Testar `/api/logout` com token válido
- [ ] 7.7. Testar acesso após logout (deve falhar)

## Fase 8: Testes Automatizados (Opcional mas Recomendado)

- [ ] 8.1. Criar `tests/Feature/Auth/LoginTest.php`
- [ ] 8.2. Testar login com credenciais válidas
- [ ] 8.3. Testar login com credenciais inválidas
- [ ] 8.4. Testar rate limiting no login
- [ ] 8.5. Criar `tests/Feature/Auth/MeTest.php`
- [ ] 8.6. Testar acesso sem autenticação
- [ ] 8.7. Testar acesso com token válido
- [ ] 8.8. Criar `tests/Feature/Auth/RefreshTest.php`
- [ ] 8.9. Criar `tests/Feature/Auth/LogoutTest.php`

## Fase 9: Documentação e Cleanup

- [ ] 9.1. Remover middleware `CheckTokenExpiration` do alias em `bootstrap/app.php` (se não for usar)
- [ ] 9.2. Remover Sanctum do `composer.json` (se não for usar)
- [ ] 9.3. Atualizar documentação do projeto
- [ ] 9.4. Adicionar variáveis JWT no `.env.example`
- [ ] 9.5. Revisar código final e aplicar PSR-12

## Fase 10: Produção

- [ ] 10.1. Configurar HTTPS
- [ ] 10.2. Revisar configurações de CORS
- [ ] 10.3. Configurar rate limiting adequado
- [ ] 10.4. Testar todos os fluxos em ambiente de staging
- [ ] 10.5. Documentar processo de rollback se necessário

---

## 📝 Notas Importantes

- **Não commitar** o arquivo `.env` (deve estar no `.gitignore`)
- **Gerar nova chave JWT** em cada ambiente (dev, staging, production)
- **Testar** todos os endpoints antes de considerar completo
- **Documentar** qualquer customização feita

---

**Última atualização:** Dezembro 2024





