# Phase 5: Navbar + Shell (Host)

> Master spec: `prompt-todo.md` (không sửa)
>
> Điều kiện: Phase 1–4 đã hoàn thành và verify OK.
>
> Mục tiêu: Xây dựng Navbar remote + Shell host — tích hợp toàn bộ hệ thống.

---

## 1. Files cần tạo / sửa

```
apps/navbar/src/
│
├── components/
│   ├── Navbar.tsx
│   ├── MobileMenu.tsx
│   └── UserMenu.tsx
│
├── App.tsx              (standalone placeholder)
├── main.tsx             (giữ nguyên)

Sửa:
  apps/navbar/vite.config.ts   (thêm exposes: ./Navbar)

apps/shell/src/
│
├── components/
│   ├── AppLayout.tsx          (Navbar + Outlet)
│   ├── GoogleCallback.tsx     (xử lý Google OAuth callback)
│   └── ErrorBoundary.tsx
│
├── pages/
│   ├── Home.tsx               (redirect / → /todos)
│   └── NotFound.tsx           (404)
│
├── App.tsx                    (routing + providers)
├── main.tsx                   (giữ nguyên + global error handlers)
├── bootstrap.tsx              (lazy load entry cho MF)

Sửa:
  apps/shell/vite.config.ts    (host config: remotes + shared)

shared/src/
  client.ts                    (thêm overridable logout handler)
```

---

## 2. Rules từ Master cần tuân thủ

### Navbar (master:403-415)
- Remote App riêng
- Logo, Menu, User Avatar, Logout
- **Luôn hiển thị trong Shell (layout)**
- Đọc AuthContext để biết trạng thái login

### Routing (master:419-586)
- Shell quản lý toàn bộ routing
- Routes: /login, /register, /forgot-password, /reset-password, /auth/google/callback, /todos (protected)
- Remote chỉ expose Component (không routing riêng)
- Auth Guard: ProtectedRoute kiểm tra AuthContext

### Auth State Sharing (master:588-642)
- AuthProvider ở Shell, bọc toàn bộ app
- Navbar đọc `isAuthenticated`, `user` từ useAuth
- Google callback xử lý ở Shell

### Error Handling (master:794-765)
- Mỗi Remote bọc trong Error Boundary riêng
- Global Error Boundary cho Shell
- Fallback: ErrorState + nút "Thử lại"

### Module Federation (master:590-695)
- Shell là Host, có remotes config
- Shared deps singleton
- Remote lazy load với Suspense
- Loading/Skeleton khi remote đang tải

### Tailwind prefix (master:718-778)
- Navbar: `navbar-`
- Shell: **không có prefix** (host)

### Coding Convention (master:769-830)
- PascalCase files
- Named export
- Import order: react → remote components → shared → internal

---

## 3. Spec chi tiết

### 3.1 Navbar App

#### Component: `components/Navbar.tsx`

```tsx
// Expose name: ./Navbar
// Import từ: shared/AuthContext (qua Module Federation)

import { useAuth } from 'shared/AuthContext'
import { useTheme } from 'shared/ThemeContext'
import { Button } from 'shared/Button'
import { LanguageSwitcher } from 'shared/LanguageSwitcher'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MobileMenu } from './MobileMenu'
import { UserMenu } from './UserMenu'

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="navbar-bg-white navbar-shadow navbar-h-16 navbar-flex navbar-items-center navbar-px-6 navbar-border-b">
      {/* Logo */}
      <div className="navbar-flex navbar-items-center navbar-gap-2 navbar-cursor-pointer" onClick={() => navigate('/')}>
        <span className="navbar-text-xl navbar-font-bold navbar-text-blue-600">MicroFE</span>
      </div>

      {/* Spacer */}
      <div className="navbar-flex-1" />

      {/* Desktop navigation */}
      <div className="navbar-hidden md:navbar-flex navbar-items-center navbar-gap-4">
        {isAuthenticated ? (
          <>
            <span
              className="navbar-cursor-pointer navbar-text-gray-700 hover:navbar-text-blue-600"
              onClick={() => navigate('/todos')}
            >
              {t('nav.work')}
            </span>
            <LanguageSwitcher />
            <button
              onClick={toggleTheme}
              className="navbar-p-2 navbar-rounded hover:navbar-bg-gray-100"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <UserMenu user={user} onLogout={handleLogout} />
          </>
        ) : (
          <>
            <LanguageSwitcher />
            <button
              onClick={toggleTheme}
              className="navbar-p-2 navbar-rounded hover:navbar-bg-gray-100"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <Button size="sm" onClick={() => navigate('/login')}>{t('auth.login')}</Button>
          </>
        )}
      </div>

      {/* Mobile menu button */}
      <button className="md:navbar-hidden navbar-p-2" onClick={() => setMobileOpen(!mobileOpen)}>
        ☰
      </button>

      {mobileOpen && (
        <MobileMenu
          isAuthenticated={isAuthenticated}
          user={user}
          onNavigate={(path) => { navigate(path); setMobileOpen(false) }}
          onLogout={handleLogout}
        />
      )}
    </nav>
  )
}
```

#### Component: `components/UserMenu.tsx`

Dropdown menu khi click vào avatar:

```tsx
import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { User } from 'shared/types'

interface UserMenuProps {
  user: User | null
  onLogout: () => void
}

export const UserMenu = ({ user, onLogout }: UserMenuProps) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="navbar-relative">
      <button
        onClick={() => setOpen(!open)}
        className="navbar-flex navbar-items-center navbar-gap-2 navbar-cursor-pointer"
      >
        {user?.picture ? (
          <img src={user.picture} alt="" className="navbar-w-8 navbar-h-8 navbar-rounded-full" />
        ) : (
          <div className="navbar-w-8 navbar-h-8 navbar-rounded-full navbar-bg-blue-500 navbar-flex navbar-items-center navbar-justify-center navbar-text-white navbar-text-sm">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        )}
        <span className="navbar-text-sm navbar-text-gray-700">{user?.name || user?.email}</span>
      </button>

      {open && (
        <div className="navbar-absolute navbar-right-0 navbar-mt-2 navbar-w-48 navbar-bg-white navbar-rounded-md navbar-shadow-lg navbar-border navbar-z-50">
          <div className="navbar-px-4 navbar-py-2 navbar-border-b">
            <p className="navbar-text-sm navbar-font-medium">{user?.name}</p>
            <p className="navbar-text-xs navbar-text-gray-500">{user?.email}</p>
          </div>
          <button
            onClick={onLogout}
            className="navbar-w-full navbar-text-left navbar-px-4 navbar-py-2 navbar-text-sm navbar-text-red-600 hover:navbar-bg-gray-50"
          >
            {t('auth.logout')}
          </button>
        </div>
      )}
    </div>
  )
}
```

#### Component: `components/MobileMenu.tsx`

```tsx
import { useTranslation } from 'react-i18next'
import type { User } from 'shared/types'

interface MobileMenuProps {
  isAuthenticated: boolean
  user: User | null
  onNavigate: (path: string) => void
  onLogout: () => void
}

export const MobileMenu = ({ isAuthenticated, user, onNavigate, onLogout }: MobileMenuProps) => {
  const { t } = useTranslation()
  return (
    <div className="md:navbar-hidden navbar-absolute navbar-top-16 navbar-left-0 navbar-right-0 navbar-bg-white navbar-shadow-lg navbar-border-t navbar-z-50">
      <div className="navbar-px-4 navbar-py-3 navbar-space-y-2">
        {isAuthenticated ? (
          <>
            <div className="navbar-flex navbar-items-center navbar-gap-3 navbar-py-2">
              {user?.picture && <img src={user.picture} alt="" className="navbar-w-10 navbar-h-10 navbar-rounded-full" />}
              <div>
                <p className="navbar-font-medium">{user?.name || user?.email}</p>
                <p className="navbar-text-sm navbar-text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button onClick={() => onNavigate('/todos')} className="navbar-w-full navbar-text-left navbar-py-2">{t('nav.work')}</button>
            <button onClick={onLogout} className="navbar-w-full navbar-text-left navbar-py-2 navbar-text-red-600">{t('auth.logout')}</button>
          </>
        ) : (
          <button onClick={() => onNavigate('/login')} className="navbar-w-full navbar-py-2">{t('auth.login')}</button>
        )}
      </div>
    </div>
  )
}
```

#### Navbar App.tsx (Standalone)

```tsx
import { BrowserRouter } from 'react-router'
import { AuthProvider } from 'shared/AuthContext'
import { ThemeProvider } from 'shared/ThemeContext'
import { Navbar } from './components/Navbar'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Navbar />
          <div className="navbar-p-4">Navbar standalone — tích hợp với Shell để có đầy đủ routing</div>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
export default App
```

#### Vite Config: `apps/navbar/vite.config.ts`

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'navbar',
      filename: 'remoteEntry.js',
      exposes: {
        './Navbar': './src/components/Navbar.tsx',
      },
      shared: ['react', 'react-dom', 'react-router', 'axios', 'react-hook-form', 'zod', '@tanstack/react-query', 'i18next', 'react-i18next'],
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  server: {
    port: 3003,
    proxy: { '/api': 'http://localhost:8080' },
  },
})
```

---

### 3.2 Shell App (Host)

#### Error Boundary: `components/ErrorBoundary.tsx`

```tsx
import { Component, type ReactNode, type ErrorInfo } from 'react'
import { withTranslation } from 'react-i18next'
import type { WithTranslation } from 'react-i18next'
import { ErrorState } from 'shared/ErrorState'

interface Props extends WithTranslation {
  children: ReactNode
  fallback?: ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundaryBase extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    this.props.onReset?.()
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <ErrorState
          title={this.props.t('error.title')}
          message={this.state.error?.message || this.props.t('error.retry')}
          onRetry={this.handleReset}
        />
      )
    }
    return this.props.children
  }
}

export const ErrorBoundary = withTranslation()(ErrorBoundaryBase)
```

#### AppLayout: `components/AppLayout.tsx`

```tsx
import { lazy, Suspense } from 'react'
import { Outlet } from 'react-router'
import { Spinner } from 'shared/Spinner'
import { ErrorBoundary } from './ErrorBoundary'

const Navbar = lazy(() => import('navbar/Navbar'))

export const AppLayout = () => (
  <ErrorBoundary>
    <Suspense fallback={<Spinner />}>
      <Navbar />
    </Suspense>
    <main>
      <ErrorBoundary>
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </main>
  </ErrorBoundary>
)
```

#### GoogleCallback: `components/GoogleCallback.tsx`

```tsx
import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { authApi } from 'shared/authApi'
import { useAuth } from 'shared/AuthContext'
import { useToast } from 'shared/ToastContext'
import { Spinner } from 'shared/Spinner'

export const GoogleCallback = () => {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()
  const toast = useToast()
  const { t } = useTranslation()

  useEffect(() => {
    const state = params.get('state')
    const code = params.get('code')
    if (!state || !code) {
      toast.error(t('auth.google_failed'))
      navigate('/login', { replace: true })
      return
    }

    authApi.googleCallback({ state, code })
      .then(({ data }) => {
        login(data.data)
        toast.success(t('auth.login_success'))
        navigate('/todos', { replace: true })
      })
      .catch((err) => {
        const e = err as { displayMessage?: string }
        toast.error(e.displayMessage || t('auth.google_failed'))
        navigate('/login', { replace: true })
      })
  }, [params, login, navigate, toast, t])

  return <Spinner />
}
```

#### App.tsx: `src/App.tsx`

```tsx
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router'
import { lazy, Suspense, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from 'shared/AuthContext'
import { ToastProvider } from 'shared/ToastContext'
import { Spinner } from 'shared/Spinner'
import { ProtectedRoute } from 'shared/ProtectedRoute'
import { ErrorBoundary } from './components/ErrorBoundary'
import { AppLayout } from './components/AppLayout'
import { GoogleCallback } from './components/GoogleCallback'
import { NotFound } from './pages/NotFound'
import { setOnUnauthorized } from 'shared/client'
import axios from 'axios'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000, refetchOnWindowFocus: false },
  },
})

// Lazy load remote pages
const LoginPage = lazy(() => import('auth/LoginPage'))
const RegisterPage = lazy(() => import('auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('auth/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('auth/ResetPasswordPage'))
const TodoPage = lazy(() => import('todo/TodoPage'))

function AxiosInterceptor() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Override axios 401 handling to use React Router instead of window.location
    setOnUnauthorized(() => {
      logout()
      navigate('/login', { replace: true })
    })
    return () => setOnUnauthorized(null)
  }, [logout, navigate])

  return null
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <AxiosInterceptor />
            <Routes>
              {/* Auth routes (no layout) */}
              <Route path="/login" element={
                <ErrorBoundary><Suspense fallback={<Spinner />}><LoginPage /></Suspense></ErrorBoundary>
              } />
              <Route path="/register" element={
                <ErrorBoundary><Suspense fallback={<Spinner />}><RegisterPage /></Suspense></ErrorBoundary>
              } />
              <Route path="/forgot-password" element={
                <ErrorBoundary><Suspense fallback={<Spinner />}><ForgotPasswordPage /></Suspense></ErrorBoundary>
              } />
              <Route path="/reset-password" element={
                <ErrorBoundary><Suspense fallback={<Spinner />}><ResetPasswordPage /></Suspense></ErrorBoundary>
              } />
              <Route path="/auth/google/callback" element={
                <ErrorBoundary><GoogleCallback /></ErrorBoundary>
              } />

              {/* App routes (with Navbar layout) */}
              <Route element={<AppLayout />}>
                <Route path="/" element={<Navigate to="/todos" replace />} />
                <Route path="/todos" element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <Suspense fallback={<Spinner />}><TodoPage /></Suspense>
                    </ErrorBoundary>
                  </ProtectedRoute>
                } />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
export default App
```

#### bootstrap.tsx: `src/bootstrap.tsx`

Module Federation yêu cầu entry point async cho host:

```tsx
import App from './App'

export default App
```

#### main.tsx: `src/main.tsx`

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// Global error handlers
window.addEventListener('error', (e) => { console.error('Global error:', e.error) })
window.addEventListener('unhandledrejection', (e) => { console.error('Unhandled rejection:', e.reason) })

// Dynamic import cho MF host
import('./bootstrap').then(({ default: App }) => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})
```

#### NotFound: `pages/NotFound.tsx`

```tsx
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Button, EmptyState } from 'shared/components'

export const NotFound = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <EmptyState
      title={t('not_found.title')}
      description={t('not_found.description')}
      action={<Button onClick={() => navigate('/')}>{t('not_found.back_home')}</Button>}
    />
  )
}
```

#### Vite Config: `apps/shell/vite.config.ts`

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        auth: 'auth@http://localhost:3001/remoteEntry.js',
        todo: 'todo@http://localhost:3002/remoteEntry.js',
        navbar: 'navbar@http://localhost:3003/remoteEntry.js',
        shared: 'shared@http://localhost:3004/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'react-router', 'axios', 'react-hook-form', 'zod', '@tanstack/react-query', 'i18next', 'react-i18next'],
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  server: {
    port: 3000,
    proxy: { '/api': 'http://localhost:8080' },
  },
})
```

---

### 3.3 Shared App Changes

#### Add overridable logout handler: `shared/src/client.ts`

Modify the existing Axios response interceptor's 401 handling. Instead of hardcoding `clearAuth() + window.location.href = '/login'`, delegate to a registered handler when available:

```ts
let onUnauthorized: (() => void) | null = null

export const setOnUnauthorized = (handler: (() => void) | null) => {
  onUnauthorized = handler
}

const handleUnauthorized = () => {
  clearAuth()
  if (onUnauthorized) {
    onUnauthorized()
  } else {
    window.location.href = '/login'
  }
}

// In the existing response interceptor, replace these two locations:
// 1. When no refresh token:
//    if (!refreshToken) { handleUnauthorized(); return Promise.reject(error) }
// 2. When refresh fails:
//    catch (refreshError) { processQueue(refreshError, null); handleUnauthorized(); return Promise.reject(refreshError) }
```

The Shell's `AxiosInterceptor` component in `App.tsx` calls `setOnUnauthorized(...)` with a function that calls `logout()` + `navigate('/login', { replace: true })` instead of a full page reload.

---

## 4. Verify Checklist

### Navbar App
- [ ] `pnpm dev` — navbar app chạy ở port 3003
- [ ] http://localhost:3003 hiển thị Navbar component
- [ ] http://localhost:3003/remoteEntry.js trả về manifest với `./Navbar`
- [ ] Navbar hiển thị logo "MicroFE"
- [ ] Khi chưa login: hiển thị nút "Đăng nhập" + LanguageSwitcher + Theme toggle
- [ ] Khi đã login: hiển thị UserMenu với avatar + tên + dropdown logout
- [ ] Theme toggle chuyển đổi ☀️/🌙 và gọi `toggleTheme()` từ ThemeContext
- [ ] LanguageSwitcher hiển thị và hoạt động trong desktop nav
- [ ] **Navbar luôn hiển thị trên mọi trang (kể cả auth pages)**
- [ ] `pnpm build` không lỗi

### Shell App
- [ ] `pnpm dev` — shell chạy ở port 3000, tất cả remotes chạy
- [ ] http://localhost:3000 → redirect /todos → redirect /login (chưa auth)
- [ ] http://localhost:3000/login hiển thị LoginPage từ auth remote
- [ ] http://localhost:3000/register hiển thị RegisterPage từ auth remote
- [ ] http://localhost:3000/forgot-password hiển thị ForgotPasswordPage
- [ ] http://localhost:3000/reset-password hiển thị ResetPasswordPage
- [ ] http://localhost:3000/auth/google/callback xử lý callback
- [ ] Global error handlers (`error` / `unhandledrejection`) log to console

### Integration
- [ ] Login thành công → Navbar cập nhật (user avatar hiển thị)
- [ ] Login thành công → redirect /todos
- [ ] /todos hiển thị TodoPage từ todo remote
- [ ] /todos không thể truy cập khi chưa login (redirect /login)
- [ ] Logout → clear token → redirect /login (React Router, không reload) → Navbar cập nhật
- [ ] Refresh page khi đã login → vẫn ở trang hiện tại (auth persisted)
- [ ] 404 route hiển thị NotFound page
- [ ] 401 từ API → Axios interceptor dùng React Router navigation (không reload trang)

### Error Boundaries
- [ ] Remote app crash → ErrorBoundary hiển thị ErrorState với `t('error.title')`
- [ ] Click "Thử lại" → reload remote
- [ ] Navbar crash → chỉ Navbar bị lỗi, phần content vẫn hoạt động
- [ ] Todo crash → chỉ Todo bị lỗi, Navbar vẫn hoạt động

### i18n
- [ ] Tất cả UI strings dùng `t()` keys (không có Vietnamese hardcode)
- [ ] LanguageSwitcher chuyển đổi ngôn ngữ thành công

### Module Federation
- [ ] Shell load remoteEntry.js từ tất cả 4 remotes
- [ ] Tất cả remotes lazy load (không block initial render)
- [ ] Shared dependencies singleton (react, react-dom, etc.)
- [ ] `pnpm build` shell không lỗi
- [ ] `pnpm build --filter=shell` build thành công

### Full System
- [ ] `pnpm dev` chạy đồng thời 5 apps
- [ ] Register user → login → CRUD todo → logout → login lại → data còn
- [ ] Google Sign-In → callback → login → /todos
- [ ] Forgot Password → OTP → Reset Password → login
- [ ] Token refresh tự động khi 401
- [ ] Network tab không có lỗi CORS (proxy hoạt động)
- [ ] Tất cả toasts hiển thị đúng (success/error)

---

## 5. README

Create a comprehensive `README.md` at the repository root covering:

### Architecture
- Micro Frontend architecture using Module Federation
- Monorepo structure with `pnpm` workspaces
- Host (Shell) + Remotes (auth, todo, navbar, shared)
- Shared dependency management (singleton)

### Tech Stack
- **Framework**: React 18 + TypeScript
- **Bundler**: Vite
- **MF**: `@module-federation/vite`
- **Styling**: Tailwind CSS (with prefix isolation)
- **Routing**: React Router v7
- **State**: React Context (AuthContext, ThemeContext, ToastContext)
- **API**: Axios with interceptors
- **Forms**: react-hook-form + zod
- **Data Fetching**: @tanstack/react-query
- **i18n**: react-i18next
- **Auth**: JWT + Google OAuth

### How to Run

```bash
# Install dependencies
pnpm install

# Start all apps in dev mode
pnpm dev

# Or start individual apps
pnpm --filter shell dev
pnpm --filter navbar dev
pnpm --filter auth dev
pnpm --filter todo dev
pnpm --filter shared dev
```

### How to Build

```bash
# Build all packages
pnpm build

# Build a specific app
pnpm --filter shell build
```

### How to Test

```bash
# Run all tests
pnpm test

# Run tests for a specific app
pnpm --filter shell test
pnpm --filter navbar test
pnpm --filter shared test
```

### How to Add New Remote

1. Create new app directory under `apps/` (e.g., `apps/new-remote/`)
2. Set up Vite + React + TypeScript + Tailwind with appropriate prefix
3. Add `@module-federation/vite` and configure `exposes`
4. Add the remote to Shell's `vite.config.ts` `remotes` object
5. Add the remote's port to `pnpm dev` script (if using turbo)
6. Add lazy-loaded import in Shell's `App.tsx`

### How to Deploy

- Each remote and the shell can be deployed independently
- Remotes expose `remoteEntry.js` — must be served at the configured path
- Update Shell's remote URLs in `vite.config.ts` for production
- Ensure CORS is configured if remotes are on different origins
- Use environment variables for API URLs and remote entry URLs

### Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8080` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | — |
| (Thêm biến môi trường theo nhu cầu của từng remote) |

### Useful Commands

```bash
pnpm install          # Install all dependencies
pnpm dev              # Start all apps in development mode
pnpm build            # Build all apps for production
pnpm lint             # Lint all packages
pnpm format           # Format code with Prettier
pnpm clean            # Clean all node_modules and dist directories
```
