# Micro Module Federation

Micro Frontend system built with **Module Federation**, **Vite**, **React 19**, **TypeScript**, **Tailwind CSS**, and **pnpm Turborepo**.

## Architecture

```
apps/
├── shell/          # Host application — routing, layout, error boundaries
├── auth/           # Remote — Login, Register, Forgot/Reset Password, Google Sign-In
├── todo/           # Remote — CRUD Todo (table, search, pagination, modals)
├── navbar/         # Remote — Navigation bar with user menu, theme toggle, language switcher
└── shared/         # Remote — Shared components, hooks, utils, services, API client
```

**Shell** is the Host. All other apps are Remotes. Each Remote exposes components via Module Federation, consumed by Shell.

## Tech Stack

- **pnpm** (Workspace Monorepo)
- **Turborepo** (Task orchestration + caching)
- **React 19** + **TypeScript** (Strict mode)
- **Vite** + **@module-federation/vite** (Build tool + Federation)
- **Tailwind CSS** (Utility-first CSS, prefix per app to avoid conflicts)
- **React Router v7** (Routing)
- **Axios** (HTTP client with interceptor for auth refresh)
- **React Hook Form** + **Zod** (Form state + validation)
- **@tanstack/react-query** (Server state, caching)
- **i18next** + **react-i18next** (Internationalization)

## Directory Structure

```
├── apps/
│   ├── shared/         # Shared library (exposed via Module Federation)
│   │   ├── src/
│   │   │   ├── api/          # Axios client, endpoints
│   │   │   ├── components/   # Button, Input, Modal, Toast, Table, Pagination, etc.
│   │   │   ├── constants/    # Error codes, app constants
│   │   │   ├── contexts/     # AuthContext, ToastContext, I18nContext, ThemeContext
│   │   │   ├── hooks/        # useDebounce, useLocalStorage, useTodos, etc.
│   │   │   ├── i18n/         # Translation resources (en, vi)
│   │   │   ├── layouts/      # Shared layout components
│   │   │   ├── schemas/      # Zod validation schemas
│   │   │   ├── services/     # authApi, todoApi
│   │   │   ├── types/        # TypeScript interfaces/types
│   │   │   ├── utils/        # formatDate, formatCurrency, storage helpers
│   │   │   └── index.ts      # Barrel exports
│   │   ├── vite.config.ts
│   │   └── package.json
│   ├── auth/           # Auth MFE (port 3001)
│   │   ├── src/pages/       # Login, Register, ForgotPassword, ResetPassword
│   │   └── ...
│   ├── todo/           # Todo MFE (port 3002)
│   │   ├── src/pages/       # TodoList
│   │   ├── src/components/  # TodoTable, TodoFilters, CreateTodoModal, EditTodoModal
│   │   └── ...
│   ├── navbar/         # Navbar MFE (port 3003)
│   │   ├── src/components/  # Navbar, UserMenu, MobileMenu
│   │   └── ...
│   └── shell/          # Shell/Host (port 3000)
│       ├── src/
│       │   ├── components/  # ErrorBoundary, AppLayout, GoogleCallback
│       │   ├── pages/       # NotFound
│       │   ├── App.tsx      # Route definitions, providers
│       │   ├── bootstrap.tsx # Dynamic bootstrap for Module Federation
│       │   └── main.tsx     # Entry point
│       └── ...
├── package.json          # Root scripts + workspaces
├── pnpm-workspace.yaml   # Workspace config
├── turbo.json            # Turborepo pipeline
└── tsconfig.json         # Root TypeScript config
```

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm 9

### Install

```bash
pnpm install
```

### Development

Start all apps concurrently:

```bash
pnpm dev
```

Each app runs on its own port:

| App     | Port |
|---------|------|
| Shell   | 3000 |
| Auth    | 3001 |
| Todo    | 3002 |
| Navbar  | 3003 |
| Shared  | 3004 |

### Build

```bash
pnpm build
```

Turborepo automatically builds shared first, then auth/todo/navbar, and finally shell.

### Preview

```bash
pnpm preview
```

### Lint

```bash
pnpm lint
```

### Test

```bash
pnpm test
```

## Module Federation

### Remote Exposes

**Shared** exposes the following modules (consumed by all other apps):

| Module        | Source                |
|---------------|-----------------------|
| Button        | `./src/components/Button.tsx` |
| Input         | `./src/components/Input.tsx` |
| Modal         | `./src/components/Modal.tsx` |
| Toast         | `./src/components/Toast.tsx` |
| Pagination    | `./src/components/Pagination.tsx` |
| Table         | `./src/components/Table.tsx` |
| AuthContext   | `./src/contexts/AuthContext.tsx` |
| ToastContext  | `./src/contexts/ToastContext.tsx` |
| I18nContext   | `./src/contexts/I18nContext.tsx` |
| ThemeContext  | `./src/contexts/ThemeContext.tsx` |
| apiClient     | `./src/api/client.ts` |
| authApi       | `./src/services/auth.ts` |
| todoApi       | `./src/services/todo.ts` |
| schemas       | `./src/schemas/index.ts` |
| types         | `./src/types/index.ts` |
| useDebounce   | `./src/hooks/useDebounce.ts` |
| useToast      | `./src/hooks/useToast.ts` |
| useTodos      | `./src/hooks/useTodos.ts` |
| formatDate    | `./src/utils/formatDate.ts` |
| ...           | and more |

**Auth** (port 3001) exposes: `./LoginPage`, `./RegisterPage`, `./ForgotPasswordPage`, `./ResetPasswordPage`

**Todo** (port 3002) exposes: `./TodoPage`

**Navbar** (port 3003) exposes: `./Navbar`

### Shared Dependencies

All shared dependencies (`react`, `react-dom`, `react-router`, `axios`, `react-hook-form`, `zod`, `@tanstack/react-query`, `i18next`, `react-i18next`) are configured as **singletons** to ensure only one instance is loaded.

### Lazy Loading

Remotes are loaded via `React.lazy` + `Suspense` with a `Spinner` fallback.

## Adding a New Remote

1. Create a new app directory under `apps/`
2. Set up `vite.config.ts` with `@module-federation/vite` plugin:
   - Define `remotes: { shared: 'shared@...' }`
   - Define `exposes` for the components to share
   - Configure shared dependencies
3. Set up `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`
4. Add the remote to Shell's `vite.config.ts` remotes
5. Add `TypeScript` type declarations for consumed remote modules
6. Import via `React.lazy(() => import('appName/ModuleName'))`

## Shared Library

The Shared app contains all reusable code:

- **Components**: Button, Input, TextArea, Select, Checkbox, Modal, ConfirmDialog, Toast, Spinner, Loading, Skeleton, EmptyState, ErrorState, Card, Dropdown, Table, Pagination, LanguageSwitcher, ProtectedRoute
- **Hooks**: useDebounce, useLocalStorage, useToast, useTodos, useCreateTodo, useUpdateTodo, useDeleteTodo
- **Contexts**: AuthProvider/AuthContext, ToastProvider/ToastContext, I18nProvider/I18nContext, ThemeProvider/ThemeContext
- **Utils**: formatDate, formatCurrency, storage (get/set/clear auth tokens)
- **Schemas**: Zod schemas for all forms (login, register, forgotPassword, resetPassword, createTodo, updateTodo)
- **API**: Axios client with auth interceptor, endpoint constants, typed API services

## Backend Integration

The backend runs at `http://localhost:8080`.

- Base URL is configured via `VITE_API_URL` environment variable
- All API calls go through the shared Axios client (`shared/api/client.ts`)
- Components never call Axios directly — always use `authApi` or `todoApi` from shared services
- Auth interceptor automatically attaches `Authorization: Bearer` header
- On 401, the interceptor attempts token refresh; on failure, redirects to `/login`

Environment files:
```
.env                # Shared defaults
.env.development    # Development overrides
.env.production     # Production overrides
```

## API Client

The API client is generated manually from the OpenAPI specification (`openapi.json`). The source of truth is:
```
http://localhost:8080/swagger/openapi.json
```

Types and endpoints are defined in:
- `shared/src/api/endpoints.ts` — all endpoint constants
- `shared/src/types/` — TypeScript interfaces matching API responses
- `shared/src/services/` — typed service functions

## Authentication Flow

1. User logs in via Login page or Google Sign-In
2. Backend returns `access_token` + `refresh_token` + `user`
3. Tokens are stored in `localStorage` (`shared/src/utils/storage.ts`)
4. `AuthContext` in shared tracks authentication state
5. `Axios interceptor` reads token from localStorage, auto-refreshes on 401
6. `ProtectedRoute` (shared) guards `/todos` — redirects to `/login` if unauthenticated

## Deployment

Each app builds to its own `dist/` directory and can be deployed independently.

Since Shell uses Module Federation, all Remotes must be:

1. Built (`pnpm build`)
2. Deployed to a static file server or CDN
3. Their URLs updated in Shell's `vite.config.ts` remotes configuration

For production, update environment variables in `.env.production`:

```
VITE_API_URL=https://api.example.com
```
