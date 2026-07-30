declare module 'shared/Spinner' {
  export const Spinner: (props: { size?: 'sm' | 'md' | 'lg' }) => JSX.Element
}

declare module 'shared/ProtectedRoute' {
  export const ProtectedRoute: (props: { children: React.ReactNode }) => JSX.Element
}

declare module 'shared/ErrorState' {
  interface ErrorStateProps {
    title?: string
    message?: string
    onRetry?: () => void
  }
  export const ErrorState: (props: ErrorStateProps) => JSX.Element
}

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

declare module 'shared/EmptyState' {
  export const EmptyState: (props: {
    title: string
    description?: string
    action?: { label: string; onClick: () => void }
  }) => JSX.Element
}

declare module 'shared/AuthContext' {
  export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element
  export function useAuth(): {
    user: unknown
    isAuthenticated: boolean
    isLoading: boolean
    login: (payload: { access_token: string; refresh_token: string; user: unknown }) => void
    logout: () => void
  }
}

declare module 'shared/ToastContext' {
  export function ToastProvider({ children }: { children: React.ReactNode }): JSX.Element
  export function useToast(): {
    success: (message: string) => void
    error: (message: string) => void
  }
}

declare module 'shared/apiClient' {
  export const setOnUnauthorized: (handler: (() => void) | null) => void
}

declare module 'shared/authApi' {
  export const authApi: {
    googleCallback: (params: { state: string; code: string }) => Promise<{ data: { data: { access_token: string; refresh_token: string; user: unknown } } }>
  }
}

declare module 'shared/Toast' {
  export const Toast: () => JSX.Element
}

declare module 'shared/ThemeContext' {
  import type { ReactNode } from 'react'
  export function ThemeProvider({ children }: { children: ReactNode }): JSX.Element
  export function useTheme(): { theme: string; toggleTheme: () => void }
}

declare module 'shared/I18nContext' {
  import type { ReactNode } from 'react'
  export function I18nProvider({ children }: { children: ReactNode }): JSX.Element
  export function useI18n(): { locale: string; setLocale: (locale: string) => void; t: (key: string) => string }
}

declare module 'auth/LoginPage' {
  const LoginPage: React.ComponentType
  export default LoginPage
}

declare module 'auth/RegisterPage' {
  const RegisterPage: React.ComponentType
  export default RegisterPage
}

declare module 'auth/ForgotPasswordPage' {
  const ForgotPasswordPage: React.ComponentType
  export default ForgotPasswordPage
}

declare module 'auth/ResetPasswordPage' {
  const ResetPasswordPage: React.ComponentType
  export default ResetPasswordPage
}

declare module 'todo/TodoPage' {
  const TodoPage: React.ComponentType
  export default TodoPage
}

declare module 'navbar/Navbar' {
  const Navbar: React.ComponentType
  export default Navbar
}
