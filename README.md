# TechSupport Pro

Sistema web de gerenciamento de chamados (Service Desk) para estudo de **backend em Laravel** e frontend em React. O backend foi desenvolvido manualmente com foco em boas práticas Laravel; o **frontend foi construído principalmente com auxílio de IA**, servindo como interface para a API.

A aplicação centraliza solicitações de suporte técnico, substitui fluxos informais (WhatsApp/e-mail) por um fluxo estruturado e garante controle de acesso por perfil (RBAC).

---

## Sobre o projeto

- **Backend:** Projeto de estudo em **Laravel** (API REST, JWT, Policies, Services, migrations).
- **Frontend:** SPA em React + TypeScript, em grande parte desenvolvida com suporte de IA, integrada à API.

A especificação do sistema está em [`backend/docs/documento-visao.md`](backend/docs/documento-visao.md) (problema, atores, requisitos funcionais e não funcionais, regras de negócio).

---

## O sistema em resumo

### Problema que resolve

- **Falta de histórico:** não se sabe o que foi resolvido.
- **Sobrecarga:** técnicos recebem demandas duplicadas.
- **Falta de privacidade:** risco de um colaborador ver dados de outro.
- **Falta de prioridade:** problemas críticos se misturam com os simples.

### Atores (roles)

| Perfil | Descrição |
|--------|-----------|
| **User** | Colaborador que abre chamados e acompanha os próprios tickets. |
| **Technician** | Técnico de suporte; visualiza todos os chamados, assume e edita tickets. |
| **Admin** | Administrador; acesso total (tickets, usuários, categorias). |

### Funcionalidades principais

- **Autenticação:** login (e-mail/senha), JWT, refresh token em cookie, logout.
- **Tickets:** criar chamado (título, categoria, descrição), listar (paginado), editar status/técnico/categoria (admin/technician).
- **Dashboard:** métricas e gráficos para admin/technician.
- **Usuários:** listagem e criação de usuários (admin).
- **Categorias:** listagem para criação de tickets; gestão de categorias (admin).

### Ciclo de vida do ticket

Status utilizados: **Open**, **Closed**, **Reviewing**, **Solved**. O ticket possui `user_id` (autor) e `technician_id` (opcional; técnico que assumiu).

---

## Stack técnico

| Camada | Tecnologias |
|--------|-------------|
| **Backend** | PHP 8.2+, Laravel 12, JWT (`tymon/jwt-auth`), Eloquent, MySQL |
| **Frontend** | React 19, TypeScript, Vite, TanStack Query v5, Axios, React Router v6, TailwindCSS, Radix UI, Lucide React |

A API é RESTful, responde em JSON e as rotas internas são protegidas por autenticação e autorização (Policies).

---

## Estrutura do projeto

```
projeto-chamados-it/
├── backend/          # API Laravel
│   ├── app/
│   │   ├── Http/     # Controllers, Middleware, Requests, Resources
│   │   ├── Models/   # User, Ticket, Category
│   │   ├── Policies/ # TicketPolicy, UserPolicy, CategoryPolicy
│   │   ├── Services/ # Auth, Ticket, User, Category
│   │   └── Traits/   # HasUuid, HasRoles
│   ├── database/     # migrations, seeders
│   ├── routes/       # api, auth, ticket, user, category
│   └── docs/         # documento-visao.md
└── frontend/         # SPA React
    └── src/
        ├── Modules/  # Auth, Ticket, User, Dashboard (feature-based)
        ├── Lib/      # DataService (Axios), Token, AuthService, Env
        ├── Router/   # rotas, RequireAuth, RequireAdmin, RequireAdminOrTechnician
        ├── Context/  # AuthContext
        ├── Components/ # Header, Sidebar, Loading
        └── Layouts/  # AuthenticatedLayout, GuestLayout
```

---

## Como o código funciona

### Backend (Laravel)

1. **Autenticação**
   - Login em `AuthController` → `AuthService`: valida credenciais, verifica `status`, gera JWT e refresh token.
   - Refresh token é enviado em **cookie** (`refresh_token`); o access token em JSON.
   - Rotas protegidas usam `auth:api` (guard JWT). Middleware e `AuthService` cuidam de rate limit e validação de token.

2. **Autorização (Policies)**
   - `TicketPolicy`: `before` libera tudo para admin; `create` para admin/user; `viewAny` para admin/technician; `update` para admin/technician.
   - Os controllers chamam `$this->authorize('create', Ticket::class)`, `authorize('viewAny', ...)`, `authorize('update', $ticket)`, etc., antes de executar a ação.

3. **API e regras de negócio**
   - **Controllers** recebem a requisição, delegam para **Services** (ex.: `TicketService::store`, `update`, `getAll`) e retornam JSON via `ApiResponse::success`.
   - **Form Requests** (`StoreTicketRequest`, `UpdateTicketRequest`) validam entrada.
   - **TicketService** usa `category_uuid` / `technician_uuid` e converte para `category_id` / `technician_id`; `user_id` vem do `auth('api')->user()` na criação.

4. **Rotas**
   - `routes/api.php` inclui `auth`, `user`, `ticket`, `category`.
   - Tickets: `GET /tickets` (lista), `POST /tickets/create` (criar), `PUT /tickets/{uuid}/update` (atualizar). Todas exigem `auth:api`.

### Frontend (React)

1. **Autenticação e token**
   - **AuthContext** usa `getToken()` (localStorage). Se há token, dispara a query `getAuthUserQuery` (`GET /auth/me`) para obter o usuário.
   - O evento `token-changed` atualiza o contexto quando o token é alterado (login/logout/refresh).

2. **Chamadas à API**
   - **DataService** (Axios) usa `baseURL` da env (`VITE_API_URL`). Em toda requisição, o interceptor de **request** adiciona o header `Authorization: Bearer <token>`.
   - Em **response**, se receber **401** (e a rota não for `/auth/refresh`), tenta **refresh**: `POST /auth/refresh` (cookie com refresh token), obtém novo access token, atualiza localStorage e reenvia a requisição original. Se o refresh falhar, faz logout (redireciona para login).

3. **Rotas e guards**
   - **RequireAuth:** verifica se existe token; caso contrário, redireciona para login.
   - **RequireAdmin:** exige `user.role === 'admin'`; senão, redireciona (ex.: dashboard).
   - **RequireAdminOrTechnician:** exige `admin` ou `technician`; usado na rota de listagem de chamados (`/chamados`).
   - **Sidebar** exibe itens conforme a role (Dashboard e Chamados para não-user; Tickets para admin/technician; Usuários só para admin).

4. **Módulos e dados**
   - **TanStack Query** para queries (`getTicketsListQuery`, `getCategoriesQuery`, `getAuthUserQuery`, etc.) e mutations (`login`, `logout`, `storeTicket`, `updateTicket`, etc.).
   - Cada módulo (Auth, Ticket, User, Dashboard) concentra páginas, componentes, services (queries/mutations) e types.

---

## Como rodar

### Backend

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
# Configurar DB no .env (MySQL)
php artisan migrate
php artisan db:seed
php artisan serve
```

API em `http://localhost:8000`. Rotas da API em `/api` (ex.: `/api/auth/login`, `/api/tickets`).

### Frontend

```bash
cd frontend
cp .env-example .env
npm install
npm run dev
```

Ajustar `.env` se necessário:

- `VITE_API_URL=http://localhost:8000/api`
- `VITE_APP_URL=http://localhost:5173`

Frontend em `http://localhost:5173`.

### Usuários de teste (seed)

Exemplos (consulte `UserSeeder` para a lista completa):

- Admin: `admin@example.com` / `password123`
- Técnico: `technician@example.com` / `technician123`
- User: `email@gmail.com` / `iago0406`

---

## Documentação de visão

O escopo, atores, requisitos e regras de negócio estão detalhados em **[`backend/docs/documento-visao.md`](backend/docs/documento-visao.md)**. Este README descreve a implementação atual; eventuais diferenças em relação ao documento (ex.: nomenclatura *Agent* vs *Technician*) seguem o que está no código.

---

## Licença

MIT.
