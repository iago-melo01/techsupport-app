# TechSupport Pro - Frontend

Frontend do sistema de gerenciamento de chamados TechSupport Pro.

## Tecnologias

- React 19 + TypeScript
- Vite
- TanStack Query v5
- Axios
- React Router DOM v6
- TailwindCSS
- Radix UI
- Lucide React

## Pré-requisitos

- Node.js 18+ 
- npm ou yarn

## Instalação

1. Instale as dependências:

```bash
npm install
```

2. Configure as variáveis de ambiente:

Copie o arquivo `.env-example` para `.env` e ajuste se necessário:

```bash
cp .env-example .env
```

As variáveis padrão são:
- `VITE_API_URL=http://localhost:8000/api` (URL do backend Laravel)
- `VITE_APP_URL=http://localhost:5173` (URL do frontend)

## Executar

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── Modules/          # Módulos de negócio (Feature-based)
│   │   ├── Auth/        # Autenticação
│   │   └── User/        # Usuário/Profile
│   ├── Lib/             # Serviços core (DataService, Token, etc)
│   ├── Router/          # Configuração de rotas
│   ├── Context/         # Contextos React (AuthContext)
│   ├── Components/      # Componentes reutilizáveis
│   ├── Layouts/         # Layouts da aplicação
│   ├── Ui/              # Componentes de UI base
│   └── Types/           # TypeScript types
```

## Funcionalidades Implementadas

### Autenticação
- Login com email e senha
- Gerenciamento de token JWT
- Refresh token automático
- Proteção de rotas

### Perfil
- Visualização de informações do usuário autenticado
- Dados: nome, email, role, UUID

## Endpoints do Backend Utilizados

- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Dados do usuário autenticado

## Próximos Passos

- Dashboard
- Módulo de Tickets
- Módulo de Categorias
- Gestão de usuários (Admin)
