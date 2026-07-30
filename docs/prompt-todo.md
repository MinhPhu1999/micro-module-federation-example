Tôi muốn xây dựng một dự án **Micro Frontend** sử dụng **Module Federation** với các yêu cầu sau.

# Mục tiêu

Xây dựng một hệ thống **Micro Frontend** theo mô hình **Host + Remote**, dễ mở rộng, dễ bảo trì và có khả năng tái sử dụng các component, hook, utility và service giữa các ứng dụng.

Chỉ xây dựng **Frontend**, Backend đã có sẵn.

---

# Công nghệ

- pnpm (Workspace)
- Turborepo
- ReactJS 19
- TypeScript
- Vite
- Module Federation (@module-federation/vite)
- Tailwind CSS
- React Router v7
- Axios
- React Hook Form
- Zod
- @hookform/resolvers/zod
- @tanstack/react-query
- ESLint
- Prettier

---

# Kiến trúc dự án

```
apps/
│
├── shell/          # Host Application
├── auth/           # Login, Register, Forgot/Reset Password, Google Sign-In
├── todo/           # CRUD Todo
├── navbar/         # Navbar
└── shared/         # Shared Library
```

Shell là Host.

Các app còn lại là Remote.

---

# Shared App

Shared App là nơi chứa toàn bộ các thành phần dùng chung.

```
shared/
│
├── components/
├── hooks/
├── utils/
├── services/
├── api/
├── constants/
├── schemas/
├── types/
├── layouts/
├── assets/
└── index.ts
```

Shared phải expose thông qua Module Federation.

Bao gồm các component:

- Button
- Input
- TextArea
- Select
- Checkbox
- Modal
- ConfirmDialog
- Toast
- Spinner
- Loading
- Skeleton
- EmptyState
- ErrorState
- Card
- Table
- Pagination

Hooks

- useDebounce
- useLocalStorage
- useToast

Utilities

- formatDate
- formatCurrency
- validation helpers
- storage helpers

---

# Backend

Backend đã được xây dựng.

OpenAPI Specification

```
http://localhost:8080/swagger/openapi.json
```

Base URL

```
http://localhost:8080
```

Yêu cầu

- Không tạo Backend.
- Không mock API.
- Sử dụng Backend hiện có.
- Đọc OpenAPI Specification để sinh API Client.
- Sinh đầy đủ TypeScript Models.
- Sử dụng Axios.
- Không hardcode endpoint.
- Base URL lấy từ

```
VITE_API_URL=http://localhost:8080
```

Toàn bộ API phải nằm trong

```
shared/api/
```

hoặc

```
shared/services/
```

Component không được gọi Axios trực tiếp.

---

# Authentication

Bao gồm

- Login (email + password)
- Register (name + email + password + confirm password)
- Forgot Password (gửi OTP qua email)
- Reset Password (nhập OTP + mật khẩu mới)
- Google Sign-In

## AuthPayload (từ API)

Khi login/register/google thành công, API trả về:

```json
{
  "token_type": "Bearer",
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "expires_at": "2026-07-29T...",
  "user": {
    "id": "665...",
    "email": "demo@example.com",
    "name": "Demo User",
    "picture": "https://...",
    "providers": ["email"],
    "created_at": "...",
    "updated_at": "...",
    "last_login_at": null
  }
}
```

## Flow

1. Login/Register/Google → nhận AuthPayload → lưu access_token + refresh_token vào localStorage
2. AuthContext trong shared quản lý trạng thái đăng nhập (user + isAuthenticated)
3. Protected Route trong Shell kiểm tra AuthContext trước khi render /todos
4. Navbar đọc AuthContext để hiển thị Avatar/Logout hay Login button

## Axios Interceptor

- Tự động thêm `Authorization: Bearer <access_token>` header
- Xử lý 401 → gọi `POST /api/v1/auth/refresh` với refresh_token
- Nếu refresh thành công → cập nhật token mới, retry request gốc
- Nếu refresh thất bại (401 INVALID_REFRESH_TOKEN) → clear token, logout, redirect /login
- Xử lý error codes mapping sang Toast message tiếng Việt

## Error Codes Mapping

| Error Code | HTTP Status | Toast Message |
|------------|-------------|---------------|
| BAD_REQUEST | 400 | "Dữ liệu không hợp lệ" |
| UNAUTHORIZED | 401 | "Phiên đăng nhập hết hạn" |
| EMAIL_ALREADY_EXISTS | 409 | "Email đã tồn tại" |
| ACCOUNT_LOCKED | 403 | "Tài khoản đang bị khóa, vui lòng kiểm tra email để đặt lại mật khẩu" |
| TODO_NOT_FOUND | 404 | "Không tìm thấy công việc" |
| INVALID_REFRESH_TOKEN | 401 | "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại" |
| GOOGLE_AUTH_UNAVAILABLE | 503 | "Google sign-in chưa được cấu hình" |
| GOOGLE_PROFILE_UNAVAILABLE | 502 | "Không thể đọc thông tin Google profile" |
| INTERNAL_SERVER_ERROR | 500 | "Lỗi hệ thống, vui lòng thử lại sau" |

---

# Form Standard

Toàn bộ Form trong hệ thống phải tuân theo quy chuẩn sau:

- React Hook Form
- Zod
- @hookform/resolvers/zod
- TypeScript
- Không sử dụng useState để quản lý dữ liệu Form
- Schema tách riêng trong

```
schemas/
```

- Types tách riêng trong

```
types/
```

- Form sử dụng Shared Components
- Hiển thị lỗi ngay dưới từng trường
- Disable nút Submit khi Form không hợp lệ
- Disable Submit khi đang gửi Request
- Loading khi Submit
- Validate cả Client và Server

Áp dụng cho

- Login
- Register
- Forgot Password
- Reset Password
- Create Todo
- Edit Todo

## Validation Constraints (từ OpenAPI)

| Schema | Field | Constraint |
|--------|-------|------------|
| Register | email | valid email format |
| Register | password | 8–72 ký tự |
| Register | name | optional |
| ResetPassword | otp | exactly 6 ký tự |
| ResetPassword | new_password | 8–72 ký tự |
| CreateTodo | title | required, max 160 ký tự |
| CreateTodo | description | optional, max 2000 ký tự |
| UpdateTodo | title | optional, max 160 ký tự |
| UpdateTodo | description | optional, max 2000 ký tự |
| UpdateTodo | completed | boolean |

Lưu ý:
- Confirm Password là UI-only validation (không gửi lên API), validate password === confirmPassword ở client
- Tất cả Zod schemas đặt trong `shared/schemas/`

---

# Toast Notification

Xây dựng một Shared Toast Component.

Toast phải hỗ trợ

- Success
- Error
- Warning
- Info

Toast sử dụng ở toàn bộ project.

Ví dụ

- Login thành công
- Login thất bại
- Register thành công
- Register thất bại
- Create Todo thành công
- Update Todo thành công
- Delete Todo thành công
- Lỗi từ Backend

Toast được quản lý thông qua Context hoặc Custom Hook.

Ví dụ

```
const { success, error, warning, info } = useToast();
```

---

# Auth App

Bao gồm

- Login
- Register
- Forgot Password
- Reset Password
- Google Sign-In

## Login

Sử dụng

- React Hook Form
- Zod

Validate

- Email (valid format)
- Password (8–72 ký tự)

API: `POST /api/v1/auth/login`

Error handling

- 400 BAD_REQUEST → Toast "Dữ liệu không hợp lệ"
- 401 UNAUTHORIZED → Toast "Email hoặc mật khẩu không đúng"
- 403 ACCOUNT_LOCKED → Toast "Tài khoản đang bị khóa do yêu cầu reset password, vui lòng kiểm tra email"

Sau khi Login thành công

- Lưu access_token + refresh_token vào localStorage (shared/storage helpers)
- Cập nhật AuthContext trong shared
- Hiển thị Toast Success
- Chuyển sang /todos

## Register

Sử dụng

- React Hook Form
- Zod

Validate

- Name (optional, nhưng nếu có thì không empty)
- Email (valid format)
- Password (8–72 ký tự)
- Confirm Password (phải khớp với Password — UI-only, không gửi lên API)

API: `POST /api/v1/auth/register`

Error handling

- 400 BAD_REQUEST → Toast "Dữ liệu không hợp lệ"
- 409 EMAIL_ALREADY_EXISTS → Toast "Email đã tồn tại"

Sau khi Register thành công

- Toast Success
- Chuyển sang /login

## Forgot Password

Sử dụng

- React Hook Form
- Zod

Validate

- Email (valid format)

API: `POST /api/v1/auth/forgot-password`

Sau khi gửi thành công

- Toast Success "OTP đã được gửi đến email của bạn"
- Chuyển sang /reset-password

## Reset Password

Nhập OTP từ email + mật khẩu mới.

Sử dụng

- React Hook Form
- Zod

Validate

- Email (valid format, pre-filled từ Forgot Password)
- OTP (exactly 6 ký tự, chỉ số)
- New Password (8–72 ký tự)
- Confirm New Password (khớp với New Password)

API: `POST /api/v1/auth/reset-password`

Sau khi thành công

- Toast Success "Mật khẩu đã được đặt lại"
- Chuyển sang /login

Error handling

- 400 BAD_REQUEST → Toast "OTP không hợp lệ hoặc đã hết hạn"

## Google Sign-In

Bước 1: Gọi `GET /api/v1/auth/google/url` → nhận `data.url`.

Bước 2: `window.location.href = data.url` → chuyển hướng đến Google OAuth.

Bước 3: Google redirect về `/api/v1/auth/google/callback?state=...&code=...`.

Bước 4: Shell xử lý callback → nhận AuthPayload → lưu token → redirect /todos.

Cách tích hợp

- Page Login có nút "Sign in with Google"
- Khi click → fetch google/url → redirect browser
- Callback route `/auth/google/callback` được Shell định nghĩa
- Không cần page riêng cho callback, Shell xử lý bằng useEffect + redirect

Error handling

- 503 GOOGLE_AUTH_UNAVAILABLE → Toast "Google sign-in chưa được cấu hình"
- 502 GOOGLE_PROFILE_UNAVAILABLE → Toast "Không thể đọc thông tin Google profile"

---

# Todo App

Bao gồm

- Danh sách Todo
- Chi tiết Todo
- Thêm Todo
- Sửa Todo
- Xóa Todo

## Danh sách

Hiển thị

- Table
- Search (tìm theo title + description, case-insensitive)
- Pagination

Query params API: `?pageSize=10&pageNumber=1&completed=true&search=...`

Lưu ý: API query dùng `pageNumber`/`pageSize`, response meta dùng `page`/`limit` — cần mapping đúng.

- Loading (Skeleton)
- Empty State
- Error State

## Thêm Todo

Khi nhấn nút Add

Hiển thị Modal.

Form sử dụng

- React Hook Form
- Zod

Validate (theo OpenAPI)

- Title: required, max 160 ký tự
- Description: optional, max 2000 ký tự

Sau khi tạo thành công

- Đóng Modal
- Toast Success
- Refresh danh sách

Nếu lỗi

- Toast Error

## Sửa Todo

Mở Modal.

Load dữ liệu hiện tại (title, description, completed).

Lưu ý: Todo model có `completed_at` (nullable) — nếu completed = false thì completed_at = null, nếu completed = true thì completed_at = server set.

Sử dụng

- React Hook Form
- Zod

Sau khi cập nhật

- Đóng Modal
- Refresh danh sách
- Toast Success

Nếu lỗi

- Toast Error

## Xóa Todo

Hiển thị Confirm Dialog.

Nếu xác nhận

- gọi API

Sau khi thành công

- Toast Success
- Refresh danh sách

Nếu lỗi

- Toast Error

---

# Navbar

Là một Remote App riêng.

Bao gồm

- Logo
- Menu
- User Avatar
- Logout

Navbar luôn hiển thị trong Shell.

---

# Routing

Shell quản lý toàn bộ Routing.

```
/
├── login
├── register
├── forgot-password
├── reset-password
├── auth/google/callback
└── todos          (protected)
```

Remote chỉ expose Component.

## Auth Guard

Route `/todos` là protected:

```tsx
// Shell dùng ProtectedRoute wrapper
<Route
  path="/todos"
  element={
    <ProtectedRoute>
      <TodoPage />
    </ProtectedRoute>
  }
/>
```

`ProtectedRoute` kiểm tra AuthContext:

- Nếu chưa authenticated → redirect `/login`
- Nếu đang loading auth → hiển thị Spinner
- Nếu authenticated → render children

AuthContext được expose từ Shared App qua Module Federation.

---

# Auth State Sharing (giữa các MFE)

## Cơ chế

Auth state được chia sẻ giữa các Remote thông qua:

1. **localStorage** — lưu access_token, refresh_token, user JSON
2. **AuthContext (React Context)** — expose từ Shared App qua Module Federation
3. **Axios Interceptor** — tự động đọc token từ localStorage

## AuthContext (trong shared)

```tsx
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthContextValue extends AuthState {
  login: (payload: AuthPayload) => void
  logout: () => void
  updateUser: (user: User) => void
}
```

## Provider placement

`AuthProvider` nằm trong Shell, bọc toàn bộ ứng dụng:

```tsx
// Shell/App.tsx
<AuthProvider>
  <ToastProvider>
    <Navbar />
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/todos" element={<ProtectedRoute><TodoPage /></ProtectedRoute>} />
    </Routes>
  </ToastProvider>
</AuthProvider>
```

## Khởi tạo

Khi Shell mount, AuthContext đọc token từ localStorage:

- Có token → gọi `GET /api/v1/auth/me` để lấy user info
- Nếu 401 → token hết hạn → gọi `/auth/refresh`
- Nếu refresh thất bại → clear token, user = null
- Không có token → user = null, isAuthenticated = false

## Các Remote sử dụng

- **Navbar** đọc `isAuthenticated`, `user` → hiển thị Avatar / Login button
- **Todo** đọc `isAuthenticated` → ProtectedRoute kiểm tra trước khi render
- **Auth** viết `login()`, `logout()` → cập nhật context

---

# Module Federation

Shell là Host.

Remote

- auth
- todo
- navbar
- shared

## Shared Exposes

### Auth Remote

```ts
exposes: {
  './LoginPage': './src/pages/Login.tsx',
  './RegisterPage': './src/pages/Register.tsx',
  './ForgotPasswordPage': './src/pages/ForgotPassword.tsx',
  './ResetPasswordPage': './src/pages/ResetPassword.tsx',
}
```

### Todo Remote

```ts
exposes: {
  './TodoPage': './src/pages/TodoList.tsx',
}
```

### Navbar Remote

```ts
exposes: {
  './Navbar': './src/components/Navbar.tsx',
}
```

### Shared Remote

```ts
exposes: {
  './Button': './src/components/Button.tsx',
  './Input': './src/components/Input.tsx',
  './TextArea': './src/components/TextArea.tsx',
  './Select': './src/components/Select.tsx',
  './Checkbox': './src/components/Checkbox.tsx',
  './Modal': './src/components/Modal.tsx',
  './ConfirmDialog': './src/components/ConfirmDialog.tsx',
  './Toast': './src/components/Toast.tsx',
  './Spinner': './src/components/Spinner.tsx',
  './Skeleton': './src/components/Skeleton.tsx',
  './EmptyState': './src/components/EmptyState.tsx',
  './ErrorState': './src/components/ErrorState.tsx',
  './Card': './src/components/Card.tsx',
  './Table': './src/components/Table.tsx',
  './Pagination': './src/components/Pagination.tsx',
  './AuthContext': './src/contexts/AuthContext.tsx',
  './ProtectedRoute': './src/components/ProtectedRoute.tsx',
  './ToastProvider': './src/contexts/ToastContext.tsx',
  './apiClient': './src/api/client.ts',
  './authApi': './src/api/auth.ts',
  './todoApi': './src/api/todo.ts',
  './useDebounce': './src/hooks/useDebounce.ts',
  './useLocalStorage': './src/hooks/useLocalStorage.ts',
  './useToast': './src/hooks/useToast.ts',
  './schemas': './src/schemas/index.ts',
  './types': './src/types/index.ts',
}
```

## Shared Dependencies (singleton)

- react
- react-dom
- react-router
- axios
- react-hook-form
- zod
- @tanstack/react-query

Tất cả đều là singleton.

Remote phải được Lazy Load (`React.lazy` + `Suspense`).

Có Loading/Skeleton khi Remote đang tải.

---

# Tailwind CSS

Tất cả App đều sử dụng Tailwind CSS.

## PostCSS Config

Mỗi app có `postcss.config.js` riêng:

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## CSS Conflict Prevention

Để tránh xung đột CSS giữa các Remote, sử dụng Tailwind CSS `prefix`:

```js
// tailwind.config.js
export default {
  prefix: 'tw-',
  content: ['./src/**/*.{ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
}
```

Mỗi Remote app có prefix riêng (VD: `auth-`, `todo-`, `navbar-`, `sh-`).

Riêng Shell không cần prefix vì là Host, chịu trách nhiệm CSS chính.

## Chạy độc lập

Mỗi App có `tailwind.config.js` và `postcss.config.js` riêng để có thể chạy standalone.

---

# State Management

Không sử dụng Redux nếu không cần.

Ưu tiên

- **React Context** — Auth state, Toast, UI states
- **Custom Hook** — Business logic tái sử dụng
- **@tanstack/react-query** — Server state (API data) và caching

## TanStack Query Patterns

```tsx
// shared/api/todo.ts — khai báo query key + API call
export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (params: TodoListParams) => [...todoKeys.lists(), params] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: string) => [...todoKeys.details(), id] as const,
}

// shared/hooks/useTodos.ts — custom hook cho từng page
export function useTodos(params: TodoListParams) {
  return useQuery({
    queryKey: todoKeys.list(params),
    queryFn: () => todoApi.list(params),
  })
}

export function useCreateTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: todoApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
    },
  })
}
```

**Lưu ý:** Không dùng `useState`/`useEffect` để fetch API. Luôn dùng TanStack Query.

---

# Error Handling

## Error Boundary

Mỗi Remote app bọc trong Error Boundary riêng:

```
Shell
├── ErrorBoundary (global)
│   ├── ErrorBoundary (auth remote)
│   │   └── Auth pages
│   ├── ErrorBoundary (todo remote)
│   │   └── Todo pages
│   └── ErrorBoundary (navbar remote)
│       └── Navbar
```

Fallback UI: Hiển thị ErrorState component + nút "Thử lại" reload remote.

## Axios Interceptor

Xem mục Authentication → Axios Interceptor.

## Global Error Handler

- `window.onerror` cho runtime errors không catch được
- `window.onunhandledrejection` cho Promise rejections
- Log error ra console trong development

## Error Codes Mapping

Xem bảng error codes trong mục Authentication.

---

# Coding Convention

## TypeScript

- Strict Mode
- Define types trong `shared/types/`, tách riêng từng file theo domain
- Không dùng `any`, hạn chế `as` casting
- Export type kèm `export type` cho isolatedModules

## Component

- Functional Component + React Hooks
- Không sử dụng Class Component
- **File naming**: PascalCase cho component files (`Button.tsx`, `LoginPage.tsx`)
- **Export**: Named export cho components (`export const Button = ...`)
- Mỗi component một file
- Component nhỏ, chỉ làm một việc (Single Responsibility)
- Props define bằng TypeScript interface, đặt trong cùng file hoặc `types/`

## Hooks

- File naming: camelCase, prefix `use` (`useDebounce.ts`, `useToast.ts`)
- Custom hooks trong `hooks/` theo từng app
- Shared hooks trong `shared/hooks/`
- Tuân thủ Rules of Hooks

## Utils / Helpers

- File naming: camelCase (`formatDate.ts`, `storage.ts`)
- Pure functions, không side effects
- Unit test bắt buộc cho utils

## Import Order

1. React / third-party libraries
2. Shared library (`@/...` hoặc từ remote)
3. Internal modules (`../...` hoặc `./...`)
4. CSS/assets

## General

- SOLID
- DRY
- KISS
- Clean Architecture
- Tách nhỏ Component
- Không hardcode dữ liệu (dùng constants, env)
- Không để magic number/string trong code

---

# Cấu trúc của mỗi App

```
src/
│
├── assets/
├── components/
├── pages/
├── layouts/
├── hooks/
├── routes/
├── services/
├── schemas/
├── types/
├── utils/
├── App.tsx
├── main.tsx
├── vite-env.d.ts
│
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── postcss.config.js
├── tailwind.config.js
└── .env
```

---

# Environment

```
.env
.env.development
.env.production
```

Ví dụ

```
VITE_API_URL=http://localhost:8080
```

---

# Monorepo

Sử dụng **pnpm Workspace** kết hợp **Turborepo** để quản lý monorepo.

## pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
```

## Turborepo

Sử dụng Turborepo để:

- Cache build output giữa các lần chạy
- Orchestrate task execution theo đúng thứ tự (build shared trước, shell sau cùng)
- Chạy script song song giữa các app

### turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

## package.json (root)

```json
{
  "name": "micro-module-federation",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "preview": "turbo run preview",
    "lint": "turbo run lint",
    "format": "prettier --write \"apps/**/*.{ts,tsx,json}\""
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "prettier": "^3.0.0"
  },
  "packageManager": "pnpm@9.0.0"
}
```

---

# Vite Configuration

Mỗi App có file `vite.config.ts` riêng.

## Port

```ts
// apps/auth/vite.config.ts
export default defineConfig({
  server: {
    port: 3001, // auth: 3001, todo: 3002, navbar: 3003, shared: 3004, shell: 3000
  },
})
```

## Module Federation Plugin

```ts
// apps/auth/vite.config.ts
import { federation } from '@module-federation/vite'

export default defineConfig({
  plugins: [
    federation({
      name: 'auth',
      filename: 'remoteEntry.js',
      exposes: {
        './LoginPage': './src/pages/Login.tsx',
        './RegisterPage': './src/pages/Register.tsx',
        './ForgotPasswordPage': './src/pages/ForgotPassword.tsx',
        './ResetPasswordPage': './src/pages/ResetPassword.tsx',
      },
      shared: ['react', 'react-dom', 'react-router', 'axios', 'react-hook-form', 'zod', '@tanstack/react-query'],
    }),
  ],
})
```

```ts
// apps/shell/vite.config.ts — Host consumes remotes
federation({
  name: 'shell',
  remotes: {
    auth: 'auth@http://localhost:3001/remoteEntry.js',
    todo: 'todo@http://localhost:3002/remoteEntry.js',
    navbar: 'navbar@http://localhost:3003/remoteEntry.js',
    shared: 'shared@http://localhost:3004/remoteEntry.js',
  },
})
```

## Proxy

Khi chạy standalone, dùng Vite proxy để tránh CORS:

```ts
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
```

---

# TypeScript Configuration

## Root tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

## Path Aliases

Mỗi App dùng path alias `@/` cho `src/`:

```json
// apps/auth/tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

```ts
// apps/auth/vite.config.ts
import path from 'path'

export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
})
```

---

# Testing

## Framework

- **Vitest** (unit test, integration test)
- **React Testing Library** (component test)
- **MSW** (mock API cho test, không dùng trong production)

## Scripts

Mỗi app có:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Root test command

```json
// package.json root
"scripts": {
  "test": "turbo run test"
}
```

## Coverage

- Mỗi App tự quản lý coverage report riêng
- Turborepo cache kết quả test nếu không có thay đổi

---

# Scripts

```
pnpm install

pnpm dev

pnpm build

pnpm preview

pnpm test

pnpm lint
```

Có script chạy đồng thời toàn bộ các App thông qua Turborepo.

---

# README

Sinh README đầy đủ bao gồm

- Kiến trúc Micro Frontend
- Cấu trúc thư mục
- Monorepo (pnpm workspace + Turborepo)
- Module Federation
- Cách chạy (pnpm + turborepo)
- Cách Build (pnpm + turborepo)
- Cách chạy test (vitest + turbo)
- Cách thêm Remote mới
- Cách chia sẻ Shared Library
- Cách tích hợp Backend
- Cách sinh API Client từ OpenAPI
- Cách Deploy

---

# Kết quả mong muốn

Hãy tạo toàn bộ source code hoàn chỉnh.

Bao gồm

- Toàn bộ cấu trúc thư mục
- pnpm-workspace.yaml
- turbo.json
- Source code của tất cả các App
- Cấu hình Module Federation
- Cấu hình Vite (port, proxy, plugin federation)
- Cấu hình TypeScript (strict, path alias @/)
- Cấu hình Tailwind CSS + PostCSS (prefix chống xung đột)
- Cấu hình Testing (Vitest + React Testing Library + MSW)
- Routing
- Shared Library
- Shared Components
- Shared Hooks
- Shared Utilities
- Toast Component (Context + Hook)
- Modal Component
- Confirm Dialog Component
- API Client sinh từ OpenAPI (shared/api + shared/services)
- TanStack Query integration (useQuery, useMutation, query keys)
- AuthContext + AuthGuard + Auth State Sharing
- Authentication (Login, Register, Forgot Password, Reset Password, Google Sign-In)
- Error Codes Mapping + Toast message tương ứng
- CRUD Todo (Table, Search, Pagination, Modal, ConfirmDialog)
- README

Mã nguồn phải đạt chất lượng production-ready, dễ mở rộng, tuân thủ best practices của React 19, Vite, Module Federation và Micro Frontend.