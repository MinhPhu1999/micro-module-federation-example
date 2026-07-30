# Phase 3: Auth App

> Master spec: `prompt-todo.md` (không sửa)
>
> Điều kiện: Phase 1 + 2 đã hoàn thành và verify OK.
>
> Mục tiêu: Xây dựng auth app với 5 pages: Login, Register, Forgot Password, Reset Password, Google Sign-In.

---

## 1. Files cần tạo / sửa

```
apps/auth/src/
│
├── types/
│   └── shared.d.ts        (type stubs cho shared/ MF imports — cần cho TypeScript)
│
├── pages/
│   ├── Login.tsx           (named export + default export)
│   ├── Register.tsx        (named export + default export)
│   ├── ForgotPassword.tsx  (named export + default export)
│   └── ResetPassword.tsx   (named export + default export)
│
├── components/
│   └── AuthLayout.tsx      (layout wrapper cho các auth pages)
│
├── App.tsx                 (sửa: routing nội bộ cho standalone)
├── main.tsx                (giữ nguyên)

Sửa:
  apps/auth/vite.config.ts       (thêm exposes + remotes.shared + shared deps)
  apps/auth/package.json         (thêm i18next + react-i18next)
```

---

## 2. Rules từ Master cần tuân thủ

### Auth App (master:308-436)
- 5 pages: Login, Register, Forgot Password, Reset Password, Google Sign-In
- Mỗi page dùng RHF + Zod + shared components
- Validation constraints từ OpenAPI (master:253-270)
- Error codes mapping cho từng API call (master:200-212, 332-336, 361-364, 412-414, 433-436)
- Sau login thành công: lưu token + AuthContext + toast + redirect /todos (Shell)
- Sau register thành công: toast + redirect /login
- Sau forgot password: toast + redirect /reset-password?email=...
- Sau reset password: toast + redirect /login

### Form Standard (master:216-270)
- Schemas từ `shared/schemas`
- Types từ `shared/types`
- Form dùng shared components (Input, Button, Spinner...)
- Disable submit khi invalid / đang loading
- Hiển thị lỗi dưới từng trường

### Toast (master:274-305)
- Dùng `useToast()` từ `shared/ToastContext`
- Login success → toast, login fail → toast error (với message từ error code)
- Register success/fail → toast
- Forgot/reset success/fail → toast

### Coding Convention (master:769-830)
- PascalCase files: `Login.tsx`, `AuthLayout.tsx`
- Named export
- Import order: react/libs → shared → internal

### Tailwind prefix (master:718-778)
- Prefix `auth-` cho auth app components
- Shared components dùng `sh-` prefix (từ shared)

### Module Federation (master:601-612)
- Exposes: `./LoginPage`, `./RegisterPage`, `./ForgotPasswordPage`, `./ResetPasswordPage`
- Auth app không expose Google callback (Shell xử lý)

### Auth State Sharing (master:588-642)
- Dùng `useAuth()` từ `shared/AuthContext` để login/logout
- Token lưu qua `shared/storage` helpers

### Vite Config (master:928-1060)
- Port 3001
- Proxy `/api` → http://localhost:8080
- Path alias `@/` → `./src/*`

---

## 3. Spec chi tiết

### 3.1 AuthLayout

Layout chung cho tất cả auth pages, dùng khi chạy standalone:

```tsx
// components/AuthLayout.tsx
import type { ReactNode } from 'react'

interface AuthLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
}

export const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps) => (
  <div className="auth-min-h-screen auth-flex auth-items-center auth-justify-center auth-bg-gray-50">
    <div className="auth-w-full auth-max-w-md auth-p-8 auth-space-y-6 auth-bg-white auth-rounded-xl auth-shadow-lg">
      <div className="auth-text-center">
        <h1 className="auth-text-2xl auth-font-bold">{title}</h1>
        {subtitle && <p className="auth-mt-2 auth-text-sm auth-text-gray-600">{subtitle}</p>}
      </div>
      {children}
    </div>
  </div>
)
```

### 3.2 Login Page

**File:** `pages/Login.tsx`

**Expose name:** `./LoginPage`

**Spec:**

```tsx
// Behaviors:
// 1. Form: email + password
// 2. Schema: loginSchema từ shared/schemas
// 3. Submit: authApi.login → useAuth().login → toast.success(t('auth.login_success')) → navigate to Shell /todos
// 4. Error handling:
//    - 400 BAD_REQUEST: toast.error(t('auth.invalid_data'))
//    - 401 UNAUTHORIZED: toast.error(t('auth.invalid_credentials'))
//    - 403 ACCOUNT_LOCKED: toast.error(t('auth.account_locked'))
//      (distinct from generic errors — message includes lockout duration info)
// 5. Links: t('auth.no_account') → /register
//    t('auth.forgot_password') → /forgot-password
// 6. Google Sign-In button → gọi authApi.getGoogleUrl → redirect
// 7. Nếu đã login (isAuthenticated = true) → redirect to Shell /todos

// API: POST /api/v1/auth/login
// Response: ApiSuccess<AuthPayload>
//   → data.access_token, data.refresh_token, data.user
```

**Error codes mapping (Login):**

| Status | Code             | Message key                    |
|--------|------------------|--------------------------------|
| 400    | BAD_REQUEST      | `t('auth.invalid_data')`       |
| 401    | UNAUTHORIZED     | `t('auth.invalid_credentials')`|
| 403    | ACCOUNT_LOCKED   | `t('auth.account_locked')`     |

**ACCOUNT_LOCKED** — Specific message (distinct from generic ERROR_MESSAGES table):
```
t('auth.account_locked') → "Tài khoản đã bị khóa do đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút."
```

**Form implementation:**
```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Input } from 'shared/Input'
import { Button } from 'shared/Button'
import { useToast } from 'shared/ToastContext'
import { useAuth } from 'shared/AuthContext'
import { authApi } from 'shared/authApi'
import { loginSchema } from 'shared/schemas'
import type { LoginForm } from 'shared/types'

const { t } = useTranslation()

;<Input label={t('auth.email')} {...register('email')} error={errors.email?.message} />
;<Input label={t('auth.password')} type="password" {...register('password')} error={errors.password?.message} />
;<Button type="submit" isLoading={isSubmitting}>{t('auth.login')}</Button>
;<Button variant="ghost" onClick={handleGoogle}>{t('auth.sign_in_with_google')}</Button>
```

### 3.3 Register Page

**File:** `pages/Register.tsx`

**Expose name:** `./RegisterPage`

**Spec:**

```tsx
// Behaviors:
// 1. Form: name (optional), email, password, confirmPassword
// 2. Schema: registerSchema từ shared/schemas
// 3. Submit: authApi.register({ email, password, name }) → toast.success(t('auth.register_success')) → navigate /login
//    Lưu ý: không gửi confirmPassword lên API
// 4. Error handling:
//    - 400 BAD_REQUEST: toast.error(t('auth.invalid_data'))
//    - 409 EMAIL_ALREADY_EXISTS: toast.error(t('auth.email_exists'))
// 5. Link: t('auth.has_account') → /login

// API: POST /api/v1/auth/register
// Body: { email, password, name? }
// Response: ApiSuccess<AuthPayload>
```

**Error codes mapping (Register):**

| Status | Code               | Message key                    |
|--------|--------------------|--------------------------------|
| 400    | BAD_REQUEST        | `t('auth.invalid_data')`       |
| 409    | EMAIL_ALREADY_EXISTS| `t('auth.email_exists')`      |

### 3.4 Forgot Password Page

**File:** `pages/ForgotPassword.tsx`

**Expose name:** `./ForgotPasswordPage`

**Spec:**

```tsx
// Behaviors:
// 1. Form: email
// 2. Schema: forgotPasswordSchema từ shared/schemas
// 3. Submit: authApi.forgotPassword({ email }) → toast.success(t('auth.forgot_password_sent')) → navigate /reset-password?email=<email>
// 4. No specific error handling needed (API returns 200 even if email not found — no enumeration)
// 5. Link: t('auth.back_to_login') → /login

// API: POST /api/v1/auth/forgot-password
// Response: ApiSuccess<{ message }>
```

### 3.5 Reset Password Page

**File:** `pages/ResetPassword.tsx`

**Expose name:** `./ResetPasswordPage`

**Spec:**

```tsx
// Behaviors:
// 1. Form: OTP (6 digits), newPassword, confirmNewPassword
//    Email pre-filled from URL search params (?email=) hoặc nhập lại
// 2. Schema: resetPasswordSchema từ shared/schemas
// 3. Submit: authApi.resetPassword({ email, otp, new_password }) → toast.success(t('auth.reset_success')) → navigate /login
//    Lưu ý: gửi new_password (snake_case) lên API
// 4. Error handling:
//    - 400 BAD_REQUEST: toast.error(t('auth.invalid_otp'))
// 5. Link: t('auth.back_to_login') → /login

// API: POST /api/v1/auth/reset-password
// Body: { email, otp, new_password }
// Response: ApiSuccess<{ message }>
```

**Email pre-fill from URL:**
```tsx
import { useSearchParams } from 'react-router'

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams()
  const emailFromUrl = searchParams.get('email') || ''

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: emailFromUrl },
  })

  // Auto-fill email field on mount if ?email= is present
  useEffect(() => {
    if (emailFromUrl) setValue('email', emailFromUrl)
  }, [emailFromUrl, setValue])

  // ...
}
```

### 3.6 Google Sign-In

**Không có page riêng.** Google Sign-In được tích hợp vào Login page:

```tsx
// Trong Login.tsx
const handleGoogleSignIn = async () => {
  try {
    const { data } = await authApi.getGoogleUrl()
    window.location.href = data.data.url  // Redirect to Google OAuth
  } catch (err) {
    const error = err as { status?: number; displayMessage?: string }
    if (error.status === 502 || error.status === 503) {
      toast.error(t('auth.google_service_unavailable'))
    } else {
      toast.error(error.displayMessage || t('auth.google_signin_failed'))
    }
  }
}

// Nút:
<Button variant="ghost" onClick={handleGoogleSignIn}>
  <GoogleIcon /> {t('auth.sign_in_with_google')}
</Button>
```

**Error handling for Google:**

| Status | Meaning                  | Message key                              |
|--------|--------------------------|------------------------------------------|
| 502    | Bad Gateway (Google down)| `t('auth.google_service_unavailable')`   |
| 503    | Service Unavailable      | `t('auth.google_service_unavailable')`   |
| other  | Generic failure          | `t('auth.google_signin_failed')`         |

Callback xử lý sẽ ở Shell (Phase 5).

### 3.7 App.tsx (Standalone Mode)

```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { AuthProvider, useAuth } from 'shared/AuthContext'
import { ToastProvider } from 'shared/ToastContext'
import { Spinner } from 'shared/Spinner'

const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))

function AuthRoutes() {
  const { isAuthenticated, isLoading } = useAuth()
  const { t } = useTranslation()

  if (isLoading) return <Spinner />

  // Standalone mode — /todos doesn't exist in auth app, so show a message
  // with a link to the actual Shell app instead of redirecting internally.
  if (isAuthenticated) {
    return (
      <div className="auth-flex auth-items-center auth-justify-center auth-min-h-screen auth-bg-gray-50">
        <div className="auth-text-center auth-p-8 auth-bg-white auth-rounded-xl auth-shadow-lg auth-max-w-md">
          <h2 className="auth-text-xl auth-font-semibold auth-text-gray-900">{t('auth.already_logged_in')}</h2>
          <p className="auth-mt-2 auth-text-sm auth-text-gray-600">{t('auth.redirecting_to_app')}</p>
          <a
            href="http://localhost:3000/todos"
            className="auth-mt-4 auth-inline-block auth-text-blue-600 hover:auth-underline auth-font-medium"
          >
            {t('auth.go_to_app')}
          </a>
        </div>
      </div>
    )
  }

  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AuthRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
export default App
```

**Lưu ý:** Khi chạy qua Shell, App.tsx của auth không được dùng — Shell mount trực tiếp các page components qua routing của Shell. App.tsx này chỉ dùng cho standalone dev.

**Provider order:** `AuthProvider` wraps `ToastProvider` — matching master prompt-todo.md, ensuring auth context is available before toast context initializes.

### 3.8 Vite Config + Package.json: Update `apps/auth/vite.config.ts` + `apps/auth/package.json`

**Vite config** — thêm exposes cho 4 pages, thêm `shared` remote (cần cho `shared/` imports), thêm shared deps:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'auth',
      filename: 'remoteEntry.js',
      exposes: {
        './LoginPage': './src/pages/Login.tsx',
        './RegisterPage': './src/pages/Register.tsx',
        './ForgotPasswordPage': './src/pages/ForgotPassword.tsx',
        './ResetPasswordPage': './src/pages/ResetPassword.tsx',
      },
      remotes: {
        shared: 'shared@http://localhost:3004/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'react-router', 'axios', 'react-hook-form', 'zod', '@tanstack/react-query', 'i18next', 'react-i18next'],
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  server: {
    port: 3001,
    proxy: { '/api': 'http://localhost:8080' },
  },
})
```

**Package.json** — thêm `i18next` + `react-i18next` (cần cho `useTranslation` trong standalone mode):

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router": "^7.0.0",
    "@module-federation/vite": "^1.20.0",
    "axios": "^1.7.0",
    "react-hook-form": "^7.53.0",
    "zod": "^3.23.0",
    "@hookform/resolvers": "^3.9.0",
    "@tanstack/react-query": "^5.50.0",
    "i18next": "^24.0.0",
    "react-i18next": "^15.0.0"
  }
}
```

### 3.9 Type Stubs for `shared/` imports

Auth app imports từ shared qua Module Federation (`shared/Button`, `shared/authApi`, ...). TypeScript không biết các module này, cần file `src/types/shared.d.ts` để khai báo:

```ts
// apps/auth/src/types/shared.d.ts
declare module 'shared/Button' {
  import type { ButtonHTMLAttributes, ReactNode } from 'react'
  interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
    children: ReactNode
  }
  export const Button: (props: ButtonProps) => JSX.Element
}

declare module 'shared/Input' { ... }
declare module 'shared/Spinner' { ... }
declare module 'shared/AuthContext' { ... }
declare module 'shared/ToastContext' { ... }
declare module 'shared/authApi' { ... }
declare module 'shared/schemas' { ... }
declare module 'shared/types' { ... }
```

Mỗi page có **dual export**: `export const` (cho MF expose) + `export default` (cho `React.lazy()` trong standalone mode).

### 3.10 Form Implementation Pattern (áp dụng cho tất cả pages)

```tsx
// Pattern chuẩn cho mọi form:
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Input } from 'shared/Input'
import { Button } from 'shared/Button'
import { useToast } from 'shared/ToastContext'
import { useAuth } from 'shared/AuthContext'
import { authApi } from 'shared/authApi'
import { loginSchema } from 'shared/schemas'
import type { LoginForm } from 'shared/types'

export const LoginPage = () => {
  const { t } = useTranslation()
  const toast = useToast()
  const { login } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      const { data: res } = await authApi.login(data)
      login(res.data)
      toast.success(t('auth.login_success'))
      navigate('/todos', { replace: true })
    } catch (err) {
      const error = err as { displayMessage?: string }
      toast.error(error.displayMessage || t('auth.login_failed'))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-space-y-4">
      <Input label={t('auth.email')} {...register('email')} error={errors.email?.message} />
      <Input label={t('auth.password')} type="password" {...register('password')} error={errors.password?.message} />
      <Button type="submit" isLoading={isSubmitting} className="auth-w-full">{t('auth.login')}</Button>
    </form>
  )
}
```

**Import pattern cho shared modules qua Module Federation:**
```ts
// Tất cả shared modules (components, hooks, contexts, API, schemas, types)
// được import từ 'shared/' — KHÔNG dùng local @/ paths cho shared code.

// Components:
import { Button } from 'shared/Button'
import { Input } from 'shared/Input'
import { Spinner } from 'shared/Spinner'

// Contexts:
import { useAuth, AuthProvider } from 'shared/AuthContext'
import { useToast, ToastProvider } from 'shared/ToastContext'

// API:
import { authApi } from 'shared/authApi'
// hoặc:
// import { authApi } from 'shared/api/auth'

// Schemas:
import { loginSchema } from 'shared/schemas'
import { registerSchema } from 'shared/schemas'
import { forgotPasswordSchema } from 'shared/schemas'
import { resetPasswordSchema } from 'shared/schemas'

// Types:
import type { LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm } from 'shared/types'
// hoặc từ 'shared/types/index'

// i18n:
import { useTranslation } from 'react-i18next'
const { t } = useTranslation()
```

---

## 4. Verify Checklist

- [ ] `pnpm dev` — auth app chạy ở port 3001
- [ ] http://localhost:3001/login hiển thị form Login đúng
- [ ] Login form validate: email invalid → error message, password empty → error message
- [ ] Login với user thật → success → toast `t('auth.login_success')` → redirect (standalone: show message + link to Shell)
- [ ] Login với sai pass → toast `t('auth.invalid_credentials')`
- [ ] Login với account locked → toast `t('auth.account_locked')`
- [ ] Login form disable submit khi đang loading
- [ ] http://localhost:3001/register hiển thị form Register đúng
- [ ] Register form: name optional, email, password, confirmPassword match
- [ ] Register với email mới → success → toast `t('auth.register_success')` → redirect /login
- [ ] Register với email đã tồn tại → toast `t('auth.email_exists')`
- [ ] http://localhost:3001/forgot-password hiển thị form
- [ ] Forgot password submit → toast `t('auth.forgot_password_sent')` → redirect /reset-password?email=...
- [ ] http://localhost:3001/reset-password hiển thị form với OTP + password fields + email pre-filled từ URL
- [ ] Reset password: OTP 6 digits, new password 8-72, confirm match
- [ ] Reset password success → toast `t('auth.reset_success')` → redirect /login
- [ ] OTP invalid → toast `t('auth.invalid_otp')`
- [ ] Google Sign-In button hiển thị trên Login page
- [ ] Click Google Sign-In → redirect đến Google OAuth URL
- [ ] Nếu Google trả về 502/503 → toast `t('auth.google_service_unavailable')`
- [ ] Nếu Google không available (other error) → toast `t('auth.google_signin_failed')`
- [ ] http://localhost:3001/remoteEntry.js trả về manifest với 4 exposes
- [ ] `pnpm build` auth app không lỗi TypeScript
- [ ] Components dùng đúng Tailwind prefix `auth-` và `sh-`
- [ ] Provider order: `AuthProvider` wraps `ToastProvider` (đúng theo master)
- [ ] Tất cả imports từ shared dùng pattern `shared/` (không dùng `@/` cho shared code)
- [ ] Tất cả UI strings dùng `t('auth.*')` (không hardcoded Vietnamese)
