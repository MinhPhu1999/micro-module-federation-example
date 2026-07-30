# Phase 2: Shared Library

> Master spec: `prompt-todo.md` (không sửa)
>
> Điều kiện: Phase 1 đã hoàn thành và verify OK.
>
> Mục tiêu: Xây dựng toàn bộ shared library: components, hooks, utils, API client, schemas, types, contexts, i18n, theme, design system.

---

## 1. Files cần tạo

```
apps/shared/src/
│
├── components/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── TextArea.tsx
│   ├── Select.tsx
│   ├── Checkbox.tsx
│   ├── Modal.tsx
│   ├── ConfirmDialog.tsx
│   ├── Toast.tsx
│   ├── Spinner.tsx
│   ├── Loading.tsx
│   ├── Skeleton.tsx
│   ├── EmptyState.tsx
│   ├── ErrorState.tsx
│   ├── Card.tsx
│   ├── Table.tsx
│   ├── Pagination.tsx
│   ├── ProtectedRoute.tsx
│   └── LanguageSwitcher.tsx
│
├── hooks/
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   ├── useToast.ts
│   ├── useTodos.ts
│   ├── useCreateTodo.ts
│   ├── useUpdateTodo.ts
│   └── useDeleteTodo.ts
│
├── utils/
│   ├── formatDate.ts
│   ├── formatCurrency.ts
│   ├── validation.ts
│   ├── storage.ts
│   └── __tests__/
│       ├── formatDate.test.ts
│       └── storage.test.ts
│
├── api/
│   ├── client.ts         (Axios instance + interceptors)
│   └── endpoints.ts      (endpoint constants — Factory Pattern)
│
├── services/
│   ├── auth.ts           (auth service — uses apiClient + endpoints)
│   └── todo.ts           (todo service — uses apiClient + endpoints)
├── schemas/
│   ├── auth.schema.ts     (Zod schemas for auth)
│   ├── todo.schema.ts     (Zod schemas for todo)
│   └── index.ts           (barrel re-export)
│
├── types/
│   ├── auth.types.ts      (Auth: User, AuthPayload, ErrorCode, requests)
│   ├── todo.types.ts      (Todo: Todo, CreateTodoRequest, UpdateTodoRequest, params)
│   ├── api.types.ts       (API: ApiSuccess, ApiListResponse, ApiError, PaginationMeta)
│   └── index.ts           (barrel re-export)
│
├── contexts/
│   ├── AuthContext.tsx
│   ├── ToastContext.tsx
│   ├── I18nContext.tsx
│   └── ThemeContext.tsx
│
├── i18n/
│   ├── index.ts           (init i18n + auto-discover locale files)
│   ├── en.json
│   └── vi.json
│
├── layouts/              (shared layouts — mở rộng sau)
│
├── assets/               (shared assets — mở rộng sau)
│
├── constants/
│   ├── common.constant.ts  (API_BASE_URL, PAGINATION)
│   ├── error.constant.ts   (ERROR_MESSAGES)
│   ├── theme.constant.ts   (DESIGN_TOKENS)
│   └── index.ts            (barrel re-export)
│
├── index.ts              (barrel export)
│
├── App.tsx               (giữ từ phase 1)
├── main.tsx              (giữ từ phase 1)
├── index.css             (giữ từ phase 1)
└── vite-env.d.ts         (giữ từ phase 1)

Cập nhật:
  apps/shared/vite.config.ts (thêm exposes)
  apps/shared/vitest.config.ts (mới)
  apps/shared/tailwind.config.ts (thêm darkMode: 'class')
```

---

## 2. Rules từ Master cần tuân thủ

### Components (master:71-88)
- Tất cả components trong `shared/components/`
- Danh sách: Button, Input, TextArea, Select, Checkbox, Modal, ConfirmDialog, Toast, Spinner, Loading, Skeleton, EmptyState, ErrorState, Card, Table, Pagination, LanguageSwitcher

### Hooks (master:90-93)
- useDebounce, useLocalStorage, useToast, useTodos, useCreateTodo, useUpdateTodo, useDeleteTodo

### Utils (master:96-101)
- formatDate, formatCurrency, validation helpers, storage helpers

### Form Standard (master:216-270)
- RHF + Zod + @hookform/resolvers
- Schemas trong `shared/schemas/`
- Types trong `shared/types/`
- Sử dụng Shared Components

### API (master:105-148)
- Axios, không hardcode endpoint, base URL từ env
- API trong `shared/api/` hoặc `shared/services/`
- Component không gọi Axios trực tiếp

### Backend (master:105-148)
- Từ OpenAPI: tất cả endpoints và schemas
- Sinh TypeScript Models
- Sinh API Client

### Toast (master:274-305)
- Support Success, Error, Warning, Info
- Quản lý qua Context hoặc Custom Hook
- `const { success, error, warning, info } = useToast()`

### Coding Convention (master:769-830)
- PascalCase cho component files
- Named export: `export const Button = ...`
- camelCase cho hooks/utils
- Typing đầy đủ (strict mode)
- Import order: react/libs → shared → internal → css

### Tailwind (master:718-778)
- Prefix `sh-` cho shared components
- Không xung đột CSS với các remote khác

### Module Federation exposes (master:630-649)
- Shared exposes tất cả components, hooks, contexts, api, schemas, types qua Module Federation

### Error Codes (master:200-212)
- 9 error codes cần mapping
- Axios interceptor xử lý 401 → refresh → retry → logout

---

## Design System

### Design Tokens

```ts
// apps/shared/src/constants/index.ts (bổ sung)
export const DESIGN_TOKENS = {
  color: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#2563eb', // Primary
      600: '#1d4ed8',
      700: '#1e40af',
      800: '#1e3a8a',
      900: '#172554',
    },
    surface: {
      light: '#ffffff',
      dark: '#0f172a',
    },
    text: {
      light: '#0f172a',
      dark: '#f1f5f9',
    },
  },
  radius: {
    sm: '0.25rem',
    md: '0.5rem',   // Default
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
  font: {
    family: "'Inter', system-ui, -apple-system, sans-serif",
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
    },
  },
  spacing: {
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    6: '1.5rem',
    8: '2rem',
    12: '3rem',
    16: '4rem',
  },
} as const
```

### Tailwind Config

```ts
// apps/shared/tailwind.config.ts
export default {
  darkMode: 'class',
  prefix: 'sh-',
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter'", 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2563eb', // Primary
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#172554',
        },
      },
      borderRadius: {
        DEFAULT: '0.5rem',
      },
    },
  },
}
```

### Focus Ring Style (dùng trong tất cả components)
```
focus:sh-outline-none focus:sh-ring-2 focus:sh-ring-primary-500 focus:sh-ring-offset-2
```

---

## 3. Spec chi tiết

### 3.1 Types

#### `types/auth.types.ts`
```ts
export interface User {
  id: string
  email: string
  name?: string
  picture?: string
  providers: string[]
  created_at: string
  updated_at: string
  last_login_at: string | null
}

export interface AuthPayload {
  token_type: string
  access_token: string
  refresh_token: string
  expires_at: string
  user: User
}

export interface RegisterRequest {
  email: string
  password: string   // 8–72
  name?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  email: string
  otp: string        // exactly 6
  new_password: string  // 8–72
}

export interface RefreshTokenRequest {
  refresh_token: string
}
```

#### `types/todo.types.ts`
```ts
export interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  created_at: string
  updated_at: string
  completed_at: string | null
}

export interface CreateTodoRequest {
  title: string         // max 160, required
  description?: string  // max 2000
}

export interface UpdateTodoRequest {
  title?: string
  description?: string
  completed?: boolean
  // min 1 property
}

export interface TodoListParams {
  pageSize?: number    // 1-100, default 10
  pageNumber?: number  // min 1, default 1
  completed?: boolean
  search?: string
}
```

#### `types/api.types.ts`
```ts
export type ErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'EMAIL_ALREADY_EXISTS'
  | 'ACCOUNT_LOCKED'
  | 'TODO_NOT_FOUND'
  | 'INVALID_REFRESH_TOKEN'
  | 'GOOGLE_AUTH_UNAVAILABLE'
  | 'GOOGLE_PROFILE_UNAVAILABLE'
  | 'INTERNAL_SERVER_ERROR'

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  total_pages: number
}

export interface ApiSuccess<T> {
  success: true
  message?: string
  data: T
}

export interface ApiListResponse<T> {
  success: true
  data: T[]
  meta: PaginationMeta
}

export interface ApiError {
  success: false
  error: {
    code: ErrorCode
    message: string
    details?: string
  }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiListResponse<T> | ApiError
```

#### `types/index.ts` (barrel)
```ts
export type { User, AuthPayload, RegisterRequest, LoginRequest, ForgotPasswordRequest, ResetPasswordRequest, RefreshTokenRequest } from './auth.types'
export type { Todo, CreateTodoRequest, UpdateTodoRequest, TodoListParams } from './todo.types'
export type { ErrorCode, PaginationMeta, ApiSuccess, ApiListResponse, ApiError, ApiResponse } from './api.types'
```

### 3.2 Schemas

Zod validation schemas matching OpenAPI constraints — error messages use i18n keys.

#### `schemas/auth.schema.ts`
```ts
import { z } from 'zod'

export const emailSchema = z.string().email('validation.email_invalid')

export const passwordSchema = z
  .string()
  .min(8, 'validation.password_min')
  .max(72, 'validation.password_max')

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'validation.required'),
})

export const registerSchema = z.object({
  name: z.string().optional(),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'validation.password_mismatch',
  path: ['confirmPassword'],
})

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export const resetPasswordSchema = z.object({
  email: emailSchema,
  otp: z
    .string()
    .length(6, 'validation.otp_length')
    .regex(/^\d+$/, 'validation.otp_digits'),
  newPassword: passwordSchema,
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'validation.password_mismatch',
  path: ['confirmNewPassword'],
})

export type LoginForm = z.infer<typeof loginSchema>
export type RegisterForm = z.infer<typeof registerSchema>
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>
```

#### `schemas/todo.schema.ts`
```ts
import { z } from 'zod'

export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, 'validation.required')
    .max(160, 'validation.title_max'),
  description: z
    .string()
    .max(2000, 'validation.description_max')
    .optional(),
})

export const updateTodoSchema = z.object({
  title: z
    .string()
    .min(1, 'validation.required')
    .max(160, 'validation.title_max')
    .optional(),
  description: z
    .string()
    .max(2000, 'validation.description_max')
    .optional(),
  completed: z.boolean().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'validation.at_least_one_field' }
)

export type CreateTodoForm = z.infer<typeof createTodoSchema>
export type UpdateTodoForm = z.infer<typeof updateTodoSchema>
```

#### `schemas/index.ts` (barrel)
```ts
export { emailSchema, passwordSchema, loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema, type LoginForm, type RegisterForm, type ForgotPasswordForm, type ResetPasswordForm } from './auth.schema'
export { createTodoSchema, updateTodoSchema, type CreateTodoForm, type UpdateTodoForm } from './todo.schema'
```

### 3.3 Constants

#### `constants/common.constant.ts`
```ts
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 1,
  DEFAULT_PAGE: 1,
} as const
```

#### `constants/error.constant.ts`
```ts
export const ERROR_MESSAGES: Record<string, string> = {
  BAD_REQUEST: 'error.bad_request',
  UNAUTHORIZED: 'error.unauthorized',
  EMAIL_ALREADY_EXISTS: 'error.email_already_exists',
  ACCOUNT_LOCKED: 'error.account_locked',
  TODO_NOT_FOUND: 'error.todo_not_found',
  INVALID_REFRESH_TOKEN: 'error.invalid_refresh_token',
  GOOGLE_AUTH_UNAVAILABLE: 'error.google_auth_unavailable',
  GOOGLE_PROFILE_UNAVAILABLE: 'error.google_profile_unavailable',
  INTERNAL_SERVER_ERROR: 'error.internal_server_error',
}
```

#### `constants/theme.constant.ts`
```ts
export const DESIGN_TOKENS = {
  color: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#2563eb',
      600: '#1d4ed8',
      700: '#1e40af',
      800: '#1e3a8a',
      900: '#172554',
    },
  },
  radius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  font: {
    family: "'Inter', system-ui, -apple-system, sans-serif",
  },
} as const
```

#### `constants/index.ts` (barrel)
```ts
export { API_BASE_URL, PAGINATION } from './common.constant'
export { ERROR_MESSAGES } from './error.constant'
export { DESIGN_TOKENS } from './theme.constant'
```

### 3.4 Utils

#### `storage.ts`
```ts
// Token storage helpers
export const getAccessToken = (): string | null => localStorage.getItem('access_token')
export const setAccessToken = (token: string) => localStorage.setItem('access_token', token)
export const removeAccessToken = () => localStorage.removeItem('access_token')

export const getRefreshToken = (): string | null => localStorage.getItem('refresh_token')
export const setRefreshToken = (token: string) => localStorage.setItem('refresh_token', token)
export const removeRefreshToken = () => localStorage.removeItem('refresh_token')

export const getUser = (): Record<string, unknown> | null => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}
export const setUser = (user: Record<string, unknown>) => localStorage.setItem('user', JSON.stringify(user))
export const removeUser = () => localStorage.removeItem('user')

export const clearAuth = () => {
  removeAccessToken()
  removeRefreshToken()
  removeUser()
}
```

#### `formatDate.ts`
```ts
export function formatDate(date: string | Date, locale = 'vi-VN'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}
```

#### `formatCurrency.ts`
```ts
export function formatCurrency(amount: number, currency = 'VND'): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
  }).format(amount)
}
```

#### `validation.ts`
```ts
export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
export const isNumeric = (value: string) => /^\d+$/.test(value)
```

### 3.5 API Client + Endpoints Factory + Services

#### `api/client.ts`
```ts
import axios from 'axios'
import { API_BASE_URL, ERROR_MESSAGES } from '@/constants'
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken, clearAuth } from '@/utils/storage'
import i18n from '@/i18n'
import { API_PREFIX } from './endpoints'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor: attach token
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: handle 401 → refresh → retry
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: unknown) => void
  reject: (reason: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return apiClient(originalRequest)
        })
      }
      originalRequest._retry = true
      isRefreshing = true
      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        clearAuth()
        window.location.href = '/login'
        return Promise.reject(error)
      }
      try {
        const { data } = await axios.post(`${API_BASE_URL}${API_PREFIX}/auth/refresh`, {
          refresh_token: refreshToken,
        })
        const newToken = data.data.access_token
        setAccessToken(newToken)
        setRefreshToken(data.data.refresh_token)
        processQueue(null, newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        clearAuth()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    // Map error code to i18n message
    const code = error.response?.data?.error?.code
    if (code && ERROR_MESSAGES[code]) {
      error.displayMessage = i18n.t(ERROR_MESSAGES[code])
    } else {
      error.displayMessage = i18n.t(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
    }
    return Promise.reject(error)
  },
)

export default apiClient
```

#### `api/endpoints.ts` (Factory Pattern)

Tập trung tất cả endpoint URLs vào một file. `API_PREFIX` là constant duy nhất cần sửa khi đổi version (vd `/api/v1` → `/api/v2`).

```ts
export const API_PREFIX = '/api/v1'

export const AUTH_ENDPOINTS = {
  register: () => `${API_PREFIX}/auth/register`,
  login: () => `${API_PREFIX}/auth/login`,
  forgotPassword: () => `${API_PREFIX}/auth/forgot-password`,
  resetPassword: () => `${API_PREFIX}/auth/reset-password`,
  googleUrl: () => `${API_PREFIX}/auth/google/url`,
  googleCallback: () => `${API_PREFIX}/auth/google/callback`,
  me: () => `${API_PREFIX}/auth/me`,
  refresh: () => `${API_PREFIX}/auth/refresh`,
} as const

export const TODO_ENDPOINTS = {
  list: () => `${API_PREFIX}/todos`,
  getById: (id: string) => `${API_PREFIX}/todos/${id}`,
  create: () => `${API_PREFIX}/todos`,
  update: (id: string) => `${API_PREFIX}/todos/${id}`,
  delete: (id: string) => `${API_PREFIX}/todos/${id}`,
} as const
```

#### `services/auth.ts`

```ts
import apiClient from '@/api/client'
import { AUTH_ENDPOINTS } from '@/api/endpoints'
import type {
  RegisterRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthPayload,
  ApiSuccess,
} from '@/types'

export const authApi = {
  register: (data: RegisterRequest) =>
    apiClient.post<ApiSuccess<AuthPayload>>(AUTH_ENDPOINTS.register(), data),

  login: (data: LoginRequest) =>
    apiClient.post<ApiSuccess<AuthPayload>>(AUTH_ENDPOINTS.login(), data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    apiClient.post<ApiSuccess<{ message: string }>>(AUTH_ENDPOINTS.forgotPassword(), data),

  resetPassword: (data: ResetPasswordRequest) =>
    apiClient.post<ApiSuccess<{ message: string }>>(AUTH_ENDPOINTS.resetPassword(), data),

  getGoogleUrl: () =>
    apiClient.get<ApiSuccess<{ url: string }>>(AUTH_ENDPOINTS.googleUrl()),

  googleCallback: (params: { state: string; code: string }) =>
    apiClient.get<ApiSuccess<AuthPayload>>(AUTH_ENDPOINTS.googleCallback(), { params }),

  getMe: () =>
    apiClient.get<ApiSuccess<AuthPayload['user']>>(AUTH_ENDPOINTS.me()),
}
```

#### `services/todo.ts`

```ts
import apiClient from '@/api/client'
import { TODO_ENDPOINTS } from '@/api/endpoints'
import type { CreateTodoRequest, UpdateTodoRequest, Todo, TodoListParams, ApiSuccess, ApiListResponse } from '@/types'

export const todoApi = {
  list: (params?: TodoListParams) =>
    apiClient.get<ApiListResponse<Todo>>(TODO_ENDPOINTS.list(), { params }),

  getById: (id: string) =>
    apiClient.get<ApiSuccess<Todo>>(TODO_ENDPOINTS.getById(id)),

  create: (data: CreateTodoRequest) =>
    apiClient.post<ApiSuccess<Todo>>(TODO_ENDPOINTS.create(), data),

  update: (id: string, data: UpdateTodoRequest) =>
    apiClient.patch<ApiSuccess<Todo>>(TODO_ENDPOINTS.update(id), data),

  delete: (id: string) =>
    apiClient.delete<ApiSuccess<{ message: string }>>(TODO_ENDPOINTS.delete(id)),
}
```

### 3.6 Hooks

#### `useDebounce.ts`
```ts
import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}
```

#### `useLocalStorage.ts`
```ts
import { useState, useCallback } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value
    setStoredValue(valueToStore)
    localStorage.setItem(key, JSON.stringify(valueToStore))
  }, [key, storedValue])

  return [storedValue, setValue] as const
}
```

#### `useToast.ts`
Xem ToastContext → sử dụng qua context.

#### `useTodos.ts` (TanStack Query)
```ts
import { useQuery } from '@tanstack/react-query'
import { todoApi } from '@/api/todo'
import type { TodoListParams } from '@/types'

export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (params?: TodoListParams) => [...todoKeys.lists(), params] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: string) => [...todoKeys.details(), id] as const,
}

export function useTodos(params?: TodoListParams) {
  return useQuery({
    queryKey: todoKeys.list(params),
    queryFn: async () => {
      const { data } = await todoApi.list(params)
      return {
        todos: data.data,
        meta: data.meta,
      }
    },
    placeholderData: (prev) => prev,
  })
}
```

#### `useCreateTodo.ts` (TanStack Query)
```ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { todoApi } from '@/api/todo'
import { todoKeys } from './useTodos'
import type { CreateTodoRequest } from '@/types'

export function useCreateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateTodoRequest) => {
      const { data } = await todoApi.create(payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
    },
  })
}
```

#### `useUpdateTodo.ts` (TanStack Query)
```ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { todoApi } from '@/api/todo'
import { todoKeys } from './useTodos'
import type { UpdateTodoRequest } from '@/types'

export function useUpdateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTodoRequest }) => {
      const { data: res } = await todoApi.update(id, data)
      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
    },
  })
}
```

#### `useDeleteTodo.ts` (TanStack Query)
```ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { todoApi } from '@/api/todo'
import { todoKeys } from './useTodos'

export function useDeleteTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await todoApi.delete(id)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
    },
  })
}
```

### 3.7 Contexts

#### `ToastContext.tsx`
```tsx
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
}

interface ToastContextValue {
  toasts: Toast[]
  success: (message: string) => void
  error: (message: string) => void
  warning: (message: string) => void
  info: (message: string) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const success = useCallback((m: string) => addToast('success', m), [addToast])
  const error = useCallback((m: string) => addToast('error', m), [addToast])
  const warning = useCallback((m: string) => addToast('warning', m), [addToast])
  const info = useCallback((m: string) => addToast('info', m), [addToast])
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, success, error, warning, info, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
```

#### `AuthContext.tsx`
```tsx
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { User, AuthPayload } from '@/types'
import { getAccessToken, setAccessToken, setRefreshToken, setUser, clearAuth, getUser } from '@/utils/storage'
import { authApi } from '@/api/auth'

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

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  // Initialize: check token on mount
  useEffect(() => {
    const token = getAccessToken()
    if (!token) {
      setState({ user: null, isAuthenticated: false, isLoading: false })
      return
    }
    authApi.getMe()
      .then(({ data }) => {
        const user = data.data as User
        setState({ user, isAuthenticated: true, isLoading: false })
      })
      .catch(() => {
        clearAuth()
        setState({ user: null, isAuthenticated: false, isLoading: false })
      })
  }, [])

  const login = useCallback((payload: AuthPayload) => {
    setAccessToken(payload.access_token)
    setRefreshToken(payload.refresh_token)
    setUser(payload.user as unknown as Record<string, unknown>)
    setState({ user: payload.user, isAuthenticated: true, isLoading: false })
  }, [])

  const logout = useCallback(() => {
    clearAuth()
    setState({ user: null, isAuthenticated: false, isLoading: false })
  }, [])

  const updateUser = useCallback((user: User) => {
    setUser(user as unknown as Record<string, unknown>)
    setState((prev) => ({ ...prev, user }))
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
```

#### `i18n/index.ts` (init + auto-discover locale files)

```ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const LANG_KEY = 'lang'

// Auto-discover all *.json files in this directory via Vite glob import
const localeModules = import.meta.glob('./*.json', { eager: true }) as Record<string, { default: Record<string, unknown> }>

const resources: Record<string, { translation: Record<string, unknown> }> = {}

for (const path in localeModules) {
  const filename = path.replace(/^.*[\\/]/, '').replace(/\.json$/, '')
  if (/^[a-z]{2}(?:-[A-Z]{2})?$/.test(filename)) {
    resources[filename] = { translation: localeModules[path].default }
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem(LANG_KEY) || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
export { LANG_KEY }
```

**Cách thêm ngôn ngữ mới**: Chỉ cần copy 1 file `.json` vào `i18n/` (VD: `fr.json`, `ja.json`, `ko.json`) — Vite glob tự động phát hiện và đăng ký. Không cần sửa code.

#### `I18nContext.tsx`
```tsx
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import i18n, { LANG_KEY } from '@/i18n'

interface I18nContextValue {
  locale: string
  setLocale: (locale: string) => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState(i18n.language)

  const setLocale = useCallback((lang: string) => {
    i18n.changeLanguage(lang)
    localStorage.setItem(LANG_KEY, lang)
    setLocaleState(lang)
  }, [])

  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  const { t } = useTranslation()
  return { ...ctx, t }
}
```

#### `ThemeContext.tsx`
```tsx
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

const THEME_KEY = 'theme'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY)
  if (stored === 'dark' || stored === 'light') return stored
  return getSystemTheme()
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      const stored = localStorage.getItem(THEME_KEY)
      if (!stored) setThemeState(getSystemTheme())
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
```

### 3.8 Locales

#### `i18n/en.json`
```json
{
  "common": {
    "loading": "Loading...",
    "save": "Save",
    "cancel": "Cancel",
    "add": "Add",
    "create": "Create",
    "edit": "Edit",
    "delete": "Delete",
    "confirm": "Confirm",
    "close": "Close",
    "retry": "Retry",
    "search": "Search",
    "no_data": "No data available",
    "error": "Error",
    "page_of": "{{page}} / {{total}} pages"
  },
  "auth": {
    "login": "Login",
    "register": "Register",
    "logout": "Logout",
    "forgot_password": "Forgot password",
    "reset_password": "Reset password",
    "email": "Email",
    "password": "Password",
    "confirm_password": "Confirm password",
    "name": "Name",
    "otp": "OTP Code",
    "new_password": "New password",
    "sign_in_google": "Sign in with Google",
    "sign_in_with_google": "Sign in with Google",
    "dont_have_account": "Don't have an account?",
    "no_account": "Don't have an account?",
    "already_have_account": "Already have an account?",
    "has_account": "Already have an account?",
    "login_success": "Login successful",
    "login_failed": "Login failed",
    "invalid_data": "Invalid data",
    "invalid_credentials": "Invalid email or password",
    "account_locked": "Account is locked due to too many login attempts. Please try again in 15 minutes.",
    "register_success": "Registration successful",
    "email_exists": "Email already exists",
    "forgot_password_sent": "OTP has been sent to your email",
    "back_to_login": "Back to login",
    "invalid_otp": "Invalid or expired OTP",
    "reset_success": "Password has been reset successfully",
    "already_logged_in": "You are already logged in",
    "redirecting_to_app": "Redirecting to the app...",
    "go_to_app": "Go to app",
    "google_service_unavailable": "Google sign-in is not configured or unavailable",
    "google_signin_failed": "Google sign-in failed",
    "google_failed": "Google sign-in failed"
  },
  "todo": {
    "create": "Create task",
    "edit": "Edit task",
    "delete": "Delete task",
    "title": "Title",
    "description": "Description",
    "status": "Status",
    "completed": "Completed",
    "incomplete": "Incomplete",
    "pending": "Pending",
    "created_at": "Created at",
    "updated_at": "Updated at",
    "completed_at": "Completed at",
    "actions": "Actions",
    "page_title": "Task list",
    "search_placeholder": "Search tasks...",
    "filter_all": "All",
    "filter_incomplete": "Incomplete",
    "filter_completed": "Completed",
    "create_title": "Create task",
    "create_success": "Task created successfully",
    "create_failed": "Failed to create task",
    "update_success": "Task updated successfully",
    "update_failed": "Failed to update task",
    "delete_success": "Task deleted successfully",
    "delete_failed": "Failed to delete task",
    "delete_title": "Delete task",
    "delete_confirm": "Are you sure you want to delete this task?",
    "confirm_delete": "Are you sure you want to delete this task?",
    "edit_title": "Edit task",
    "edit_load_error": "Failed to load task data",
    "empty_title": "No tasks yet",
    "empty_create_hint": "Create your first task to get started",
    "empty_search": "No tasks match your search"
  },
  "validation": {
    "required": "This field is required",
    "email_invalid": "Invalid email",
    "password_min": "Password must be at least 8 characters",
    "password_max": "Password must not exceed 72 characters",
    "password_mismatch": "Passwords do not match",
    "otp_length": "OTP must be exactly 6 characters",
    "otp_digits": "OTP must contain only digits",
    "title_max": "Title must not exceed 160 characters",
    "description_max": "Description must not exceed 2000 characters",
    "at_least_one_field": "At least one field must be updated"
  },
  "nav": {
    "work": "Work"
  },
  "not_found": {
    "title": "Page not found",
    "description": "The page you are looking for does not exist",
    "back_home": "Go to home"
  },
  "error": {
    "title": "Something went wrong",
    "retry": "Please try again",
    "bad_request": "Invalid data",
    "unauthorized": "Session expired",
    "email_already_exists": "Email already exists",
    "account_locked": "Account is locked, please check your email to reset your password",
    "todo_not_found": "Task not found",
    "invalid_refresh_token": "Session expired, please login again",
    "google_auth_unavailable": "Google sign-in is not configured",
    "google_profile_unavailable": "Unable to read Google profile",
    "internal_server_error": "System error, please try again later"
  },
  "theme": {
    "light": "Light",
    "dark": "Dark",
    "toggle": "Toggle theme"
  },
  "language": {
    "en": "English",
    "vi": "Tiếng Việt",
    "switch": "Switch language"
  }
}
```

#### `i18n/vi.json`
```json
{
  "common": {
    "loading": "Đang tải...",
    "save": "Lưu",
    "cancel": "Hủy",
    "add": "Thêm",
    "create": "Tạo",
    "edit": "Sửa",
    "delete": "Xóa",
    "confirm": "Xác nhận",
    "close": "Đóng",
    "retry": "Thử lại",
    "search": "Tìm kiếm",
    "no_data": "Không có dữ liệu",
    "error": "Lỗi",
    "page_of": "{{page}} / {{total}} trang"
  },
  "auth": {
    "login": "Đăng nhập",
    "register": "Đăng ký",
    "logout": "Đăng xuất",
    "forgot_password": "Quên mật khẩu",
    "reset_password": "Đặt lại mật khẩu",
    "email": "Email",
    "password": "Mật khẩu",
    "confirm_password": "Xác nhận mật khẩu",
    "name": "Tên",
    "otp": "Mã OTP",
    "new_password": "Mật khẩu mới",
    "sign_in_google": "Đăng nhập với Google",
    "sign_in_with_google": "Đăng nhập với Google",
    "dont_have_account": "Chưa có tài khoản?",
    "no_account": "Chưa có tài khoản?",
    "already_have_account": "Đã có tài khoản?",
    "has_account": "Đã có tài khoản?",
    "login_success": "Đăng nhập thành công",
    "login_failed": "Đăng nhập thất bại",
    "invalid_data": "Dữ liệu không hợp lệ",
    "invalid_credentials": "Email hoặc mật khẩu không đúng",
    "account_locked": "Tài khoản đã bị khóa do đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút.",
    "register_success": "Đăng ký thành công",
    "email_exists": "Email đã tồn tại",
    "forgot_password_sent": "Mã OTP đã được gửi đến email của bạn",
    "back_to_login": "Quay lại đăng nhập",
    "invalid_otp": "OTP không hợp lệ hoặc đã hết hạn",
    "reset_success": "Mật khẩu đã được đặt lại thành công",
    "already_logged_in": "Bạn đã đăng nhập",
    "redirecting_to_app": "Đang chuyển hướng đến ứng dụng...",
    "go_to_app": "Đi đến ứng dụng",
    "google_service_unavailable": "Google sign-in chưa được cấu hình hoặc không khả dụng",
    "google_signin_failed": "Đăng nhập Google thất bại",
    "google_failed": "Đăng nhập Google thất bại"
  },
  "todo": {
    "create": "Tạo công việc",
    "edit": "Sửa công việc",
    "delete": "Xóa công việc",
    "title": "Tiêu đề",
    "description": "Mô tả",
    "status": "Trạng thái",
    "completed": "Hoàn thành",
    "incomplete": "Chưa hoàn thành",
    "pending": "Đang chờ",
    "created_at": "Ngày tạo",
    "updated_at": "Ngày cập nhật",
    "completed_at": "Hoàn thành lúc",
    "actions": "Hành động",
    "page_title": "Danh sách công việc",
    "search_placeholder": "Tìm kiếm công việc...",
    "filter_all": "Tất cả",
    "filter_incomplete": "Chưa làm",
    "filter_completed": "Đã làm",
    "create_title": "Tạo công việc",
    "create_success": "Tạo công việc thành công",
    "create_failed": "Tạo công việc thất bại",
    "update_success": "Cập nhật công việc thành công",
    "update_failed": "Cập nhật công việc thất bại",
    "delete_success": "Xóa công việc thành công",
    "delete_failed": "Xóa công việc thất bại",
    "delete_title": "Xóa công việc",
    "delete_confirm": "Bạn có chắc chắn muốn xóa công việc này?",
    "confirm_delete": "Bạn có chắc chắn muốn xóa công việc này?",
    "edit_title": "Sửa công việc",
    "edit_load_error": "Không thể tải dữ liệu công việc",
    "empty_title": "Chưa có công việc nào",
    "empty_create_hint": "Tạo công việc đầu tiên để bắt đầu",
    "empty_search": "Không có công việc nào phù hợp"
  },
  "validation": {
    "required": "Trường này là bắt buộc",
    "email_invalid": "Email không hợp lệ",
    "password_min": "Mật khẩu phải có ít nhất 8 ký tự",
    "password_max": "Mật khẩu không được quá 72 ký tự",
    "password_mismatch": "Mật khẩu xác nhận không khớp",
    "otp_length": "OTP phải có đúng 6 ký tự",
    "otp_digits": "OTP chỉ gồm số",
    "title_max": "Tiêu đề không được quá 160 ký tự",
    "description_max": "Mô tả không được quá 2000 ký tự",
    "at_least_one_field": "Phải có ít nhất một trường được cập nhật"
  },
  "nav": {
    "work": "Công việc"
  },
  "not_found": {
    "title": "Không tìm thấy trang",
    "description": "Trang bạn đang tìm không tồn tại",
    "back_home": "Về trang chủ"
  },
  "error": {
    "title": "Đã xảy ra lỗi",
    "retry": "Vui lòng thử lại",
    "bad_request": "Dữ liệu không hợp lệ",
    "unauthorized": "Phiên đăng nhập hết hạn",
    "email_already_exists": "Email đã tồn tại",
    "account_locked": "Tài khoản đang bị khóa, vui lòng kiểm tra email để đặt lại mật khẩu",
    "todo_not_found": "Không tìm thấy công việc",
    "invalid_refresh_token": "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại",
    "google_auth_unavailable": "Google sign-in chưa được cấu hình",
    "google_profile_unavailable": "Không thể đọc thông tin Google profile",
    "internal_server_error": "Lỗi hệ thống, vui lòng thử lại sau"
  },
  "theme": {
    "light": "Sáng",
    "dark": "Tối",
    "toggle": "Chuyển đổi giao diện"
  },
  "language": {
    "en": "English",
    "vi": "Tiếng Việt",
    "switch": "Chuyển ngôn ngữ"
  }
}
```

### 3.9 Language Switcher Component

#### `components/LanguageSwitcher.tsx`
```tsx
import { useI18n } from '@/contexts/I18nContext'

export const LanguageSwitcher = () => {
  const { locale, setLocale, t } = useI18n()

  const toggleLang = () => {
    setLocale(locale === 'en' ? 'vi' : 'en')
  }

  return (
    <button
      onClick={toggleLang}
      className="sh-inline-flex sh-items-center sh-gap-2 sh-px-3 sh-py-1.5 sh-text-sm sh-rounded-lg sh-border sh-border-gray-300 dark:sh-border-gray-600 sh-bg-white dark:sh-bg-gray-800 sh-text-gray-700 dark:sh-text-gray-200 hover:sh-bg-gray-50 dark:hover:sh-bg-gray-700 sh-transition-colors focus:sh-outline-none focus:sh-ring-2 focus:sh-ring-primary-500 focus:sh-ring-offset-2"
      title={t('language.switch')}
    >
      <span className="sh-text-base">{locale === 'en' ? '🇻🇳' : '🇺🇸'}</span>
      <span>{locale === 'en' ? t('language.vi') : t('language.en')}</span>
    </button>
  )
}
```

### 3.10 Components

Tất cả components dùng Tailwind với prefix `sh-`.

**Pattern chung:**

```tsx
import type { ReactNode, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: ReactNode
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) => {
  const base = 'sh-inline-flex sh-items-center sh-justify-center sh-rounded-lg sh-font-medium sh-transition-colors focus:sh-outline-none focus:sh-ring-2 focus:sh-ring-primary-500 focus:sh-ring-offset-2 disabled:sh-opacity-50 disabled:sh-cursor-not-allowed'
  const variants = {
    primary: 'sh-bg-primary-500 sh-text-white hover:sh-bg-primary-600',
    secondary: 'sh-bg-gray-200 sh-text-gray-900 hover:sh-bg-gray-300',
    danger: 'sh-bg-red-600 sh-text-white hover:sh-bg-red-700',
    ghost: 'sh-bg-transparent sh-text-gray-700 hover:sh-bg-gray-100 dark:sh-text-gray-300 dark:hover:sh-bg-gray-700',
  }
  const sizes = {
    sm: 'sh-px-3 sh-py-1.5 sh-text-sm',
    md: 'sh-px-4 sh-py-2 sh-text-sm',
    lg: 'sh-px-6 sh-py-3 sh-text-base',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner size="sm" />}
      {children}
    </button>
  )
}
```

Danh sách components cần implement với các props/features:

| Component | Props | Features |
|-----------|-------|----------|
| **Button** | variant, size, isLoading, children + HTMLButton | primary/secondary/danger/ghost, loading state, focus ring |
| **Input** | label, error, helperText + HTMLInput | label trên, error message dưới, border đỏ khi error, dark mode |
| **TextArea** | label, error, rows + HTMLTextArea | giống Input |
| **Select** | label, error, options[] + HTMLSelect | giống Input |
| **Checkbox** | label, error + HTMLInput[type=checkbox] | label bên phải |
| **Modal** | isOpen, onClose, title, children, size | overlay backdrop, close button, click outside to close, escape key |
| **ConfirmDialog** | isOpen, onConfirm, onCancel, title, message, confirmLabel, cancelLabel, variant | built on Modal, danger/primary variant |
| **Toast** | — (rendered by ToastProvider) | fixed position top-right, auto dismiss 4s, animated enter/exit, type icon |
| **Spinner** | size | inline SVG spinner |
| **Loading** | text | full-page loading with Spinner + text |
| **Skeleton** | width, height, variant (text/circle/rect) | animated pulse |
| **EmptyState** | icon, title, description, action | centered layout |
| **ErrorState** | title, message, onRetry | error icon, retry button |
| **Card** | title, children, className, padding | container with shadow + rounded |
| **Table** | columns[], data[], onSort, sortKey, sortDir, isLoading | header sort indicator, loading skeleton rows, striped |
| **Pagination** | page, limit, total, totalPages, onPageChange | prev/next buttons, page numbers, "x / y pages" |
| **ProtectedRoute** | children | dùng useAuth, redirect /login nếu !isAuthenticated, loading nếu isLoading |
| **LanguageSwitcher** | — | toggle giữa en/vi, hiển thị cờ + tên ngôn ngữ |

### 3.11 Barrel Export: `apps/shared/src/index.ts`

```ts
// Components
export { Button } from './components/Button'
export { Input } from './components/Input'
export { TextArea } from './components/TextArea'
export { Select } from './components/Select'
export { Checkbox } from './components/Checkbox'
export { Modal } from './components/Modal'
export { ConfirmDialog } from './components/ConfirmDialog'
export { ToastProvider } from './contexts/ToastContext'
export { Spinner } from './components/Spinner'
export { Loading } from './components/Loading'
export { Skeleton } from './components/Skeleton'
export { EmptyState } from './components/EmptyState'
export { ErrorState } from './components/ErrorState'
export { Card } from './components/Card'
export { Table } from './components/Table'
export { Pagination } from './components/Pagination'
export { ProtectedRoute } from './components/ProtectedRoute'
export { LanguageSwitcher } from './components/LanguageSwitcher'
// Hooks
export { useDebounce } from './hooks/useDebounce'
export { useLocalStorage } from './hooks/useLocalStorage'
export { useToast } from './contexts/ToastContext'
export { useTodos, todoKeys } from './hooks/useTodos'
export { useCreateTodo } from './hooks/useCreateTodo'
export { useUpdateTodo } from './hooks/useUpdateTodo'
export { useDeleteTodo } from './hooks/useDeleteTodo'
// Contexts
export { AuthProvider, useAuth } from './contexts/AuthContext'
export { I18nProvider, useI18n } from './contexts/I18nContext'
export { ThemeProvider, useTheme } from './contexts/ThemeContext'
// API
export { authApi } from './services/auth'
export { todoApi } from './services/todo'
export { default as apiClient } from './api/client'
// Schemas
export * from './schemas'
// Types
export * from './types'
// Utils
export { formatDate } from './utils/formatDate'
export { formatCurrency } from './utils/formatCurrency'
export { clearAuth, getAccessToken, setAccessToken, getRefreshToken, setRefreshToken } from './utils/storage'
// Constants
export * from './constants'
```

### 3.12 Module Federation Config: Update `apps/shared/vite.config.ts`

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shared',
      filename: 'remoteEntry.js',
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
        './Loading': './src/components/Loading.tsx',
        './Skeleton': './src/components/Skeleton.tsx',
        './EmptyState': './src/components/EmptyState.tsx',
        './ErrorState': './src/components/ErrorState.tsx',
        './Card': './src/components/Card.tsx',
        './Table': './src/components/Table.tsx',
        './Pagination': './src/components/Pagination.tsx',
        './AuthContext': './src/contexts/AuthContext.tsx',
        './ToastContext': './src/contexts/ToastContext.tsx',
        './I18nContext': './src/contexts/I18nContext.tsx',
        './ThemeContext': './src/contexts/ThemeContext.tsx',
        './ProtectedRoute': './src/components/ProtectedRoute.tsx',
        './LanguageSwitcher': './src/components/LanguageSwitcher.tsx',
        './apiClient': './src/api/client.ts',
        './authApi': './src/services/auth.ts',
        './todoApi': './src/services/todo.ts',
        './endpoints': './src/api/endpoints.ts',
        './useDebounce': './src/hooks/useDebounce.ts',
        './useLocalStorage': './src/hooks/useLocalStorage.ts',
        './useToast': './src/hooks/useToast.ts',
        './useTodos': './src/hooks/useTodos.ts',
        './useCreateTodo': './src/hooks/useCreateTodo.ts',
        './useUpdateTodo': './src/hooks/useUpdateTodo.ts',
        './useDeleteTodo': './src/hooks/useDeleteTodo.ts',
        './schemas': './src/schemas/index.ts',
        './types': './src/types/index.ts',
        './formatDate': './src/utils/formatDate.ts',
        './formatCurrency': './src/utils/formatCurrency.ts',
        './storage': './src/utils/storage.ts',
        './constants': './src/constants/index.ts',
        './i18n': './src/i18n',
      },
      shared: ['react', 'react-dom', 'react-router', 'axios', 'react-hook-form', 'zod', '@tanstack/react-query', 'i18next', 'react-i18next'],
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  server: {
    port: 3004,
    proxy: { '/api': 'http://localhost:8080' },
  },
})
```

### 3.13 Vitest Config

#### `apps/shared/vitest.config.ts`
```ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/__tests__/**/*.test.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
})
```

### 3.14 Test Files

#### `utils/__tests__/formatDate.test.ts`
```ts
import { describe, it, expect } from 'vitest'
import { formatDate } from '../formatDate'

describe('formatDate', () => {
  it('formats a Date object with default locale', () => {
    const date = new Date('2024-03-15T10:30:00')
    const result = formatDate(date, 'vi-VN')
    expect(result).toContain('15')
    expect(result).toContain('03')
    expect(result).toContain('2024')
  })

  it('formats a date string', () => {
    const result = formatDate('2024-03-15T10:30:00', 'en-US')
    expect(result).toContain('03')
    expect(result).toContain('15')
    expect(result).toContain('2024')
  })

  it('uses vi-VN locale by default', () => {
    const result = formatDate('2024-12-25T00:00:00')
    expect(result).toContain('25')
    expect(result).toContain('12')
    expect(result).toContain('2024')
  })

  it('handles invalid date gracefully', () => {
    const result = formatDate('invalid-date')
    expect(result).toBe('Invalid Date')
  })
})
```

#### `utils/__tests__/storage.test.ts`
```ts
import { describe, it, expect, beforeEach } from 'vitest'
import {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
  getRefreshToken,
  setRefreshToken,
  removeRefreshToken,
  getUser,
  setUser,
  removeUser,
  clearAuth,
} from '../storage'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('access token', () => {
    it('returns null when no token stored', () => {
      expect(getAccessToken()).toBeNull()
    })

    it('stores and retrieves token', () => {
      setAccessToken('test-token')
      expect(getAccessToken()).toBe('test-token')
    })

    it('removes token', () => {
      setAccessToken('test-token')
      removeAccessToken()
      expect(getAccessToken()).toBeNull()
    })
  })

  describe('refresh token', () => {
    it('stores and retrieves refresh token', () => {
      setRefreshToken('test-refresh')
      expect(getRefreshToken()).toBe('test-refresh')
    })

    it('removes refresh token', () => {
      setRefreshToken('test-refresh')
      removeRefreshToken()
      expect(getRefreshToken()).toBeNull()
    })
  })

  describe('user', () => {
    it('returns null when no user stored', () => {
      expect(getUser()).toBeNull()
    })

    it('stores and retrieves user', () => {
      const user = { id: '1', email: 'test@test.com' }
      setUser(user)
      expect(getUser()).toEqual(user)
    })

    it('removes user', () => {
      setUser({ id: '1' })
      removeUser()
      expect(getUser()).toBeNull()
    })
  })

  describe('clearAuth', () => {
    it('clears all auth data', () => {
      setAccessToken('token')
      setRefreshToken('refresh')
      setUser({ id: '1' })
      clearAuth()
      expect(getAccessToken()).toBeNull()
      expect(getRefreshToken()).toBeNull()
      expect(getUser()).toBeNull()
    })
  })
})
```

### 3.15 Tailwind Config Update

#### `apps/shared/tailwind.config.ts`
```ts
export default {
  darkMode: 'class',
  prefix: 'sh-',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter'", 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#172554',
        },
      },
      borderRadius: {
        DEFAULT: '0.5rem',
      },
    },
  },
  plugins: [],
}
```

---

## 4. Verify Checklist

- [ ] `pnpm dev` — shared app chạy ở port 3004
- [ ] `http://localhost:3004/remoteEntry.js` trả về JSON module federation manifest
- [ ] Tất cả TypeScript types khớp với OpenAPI schemas (kiểm tra từng field)
- [ ] Zod schemas có đúng constraints (password 8-72, otp 6 digits, title max 160, desc max 2000)
- [ ] Zod error messages dùng i18n keys (validation.email_invalid, ...)
- [ ] Axios interceptor tự động attach Bearer token từ localStorage
- [ ] Axios interceptor handle 401 → call refresh → retry thành công
- [ ] Axios interceptor handle refresh fail → clearAuth + redirect /login
- [ ] Error codes mapping: tất cả 9 error codes đều có i18n key
- [ ] ToastProvider + useToast hoạt động: success, error, warning, info
- [ ] AuthContext: khởi tạo đọc token → getMe → set state
- [ ] AuthContext: login(lưu token), logout(clear token) đúng
- [ ] I18nProvider: locale mặc định 'en', lưu 'lang' trong localStorage
- [ ] ThemeProvider: darkMode class, lưu 'theme' trong localStorage, fallback system preference
- [ ] ThemeProvider: toggleTheme đảo ngược light ↔ dark
- [ ] locale files: `en.json` và `vi.json` đầy đủ keys
- [ ] LanguageSwitcher: toggle giữa en/vi
- [ ] Components render đúng với Tailwind prefix `sh-`
- [ ] Button: variant, size, isLoading states, focus ring primary-500
- [ ] Input: label, error message
- [ ] Modal: open/close, backdrop, escape key
- [ ] ConfirmDialog: confirm/cancel callbacks
- [ ] Table: columns, data rows, loading skeleton
- [ ] Pagination: page change callback, correct page count
- [ ] ProtectedRoute: redirect khi chưa auth, loading khi đang check
- [ ] TanStack Query hooks: useTodos, useCreateTodo, useUpdateTodo, useDeleteTodo
- [ ] Module Federation exposes: bao gồm './useToast' và tất cả hooks mới
- [ ] Vitest: `pnpm vitest run` — formatDate.test.ts và storage.test.ts pass
- [ ] `pnpm build` shared app không lỗi TypeScript
- [ ] Barrel export `index.ts` export đúng tất cả modules
