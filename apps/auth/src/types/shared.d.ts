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

declare module 'shared/Input' {
  import type { InputHTMLAttributes } from 'react'
  interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    helperText?: string
  }
  export const Input: (props: InputProps) => JSX.Element
}

declare module 'shared/Spinner' {
  export const Spinner: (props: { size?: 'sm' | 'md' | 'lg' }) => JSX.Element
}

declare module 'shared/AuthContext' {
  import type { ReactNode } from 'react'
  export interface AuthPayload {
    access_token: string
    refresh_token: string
    user: unknown
  }
  export interface AuthState {
    user: unknown
    isAuthenticated: boolean
    isLoading: boolean
  }
  export interface AuthContextValue extends AuthState {
    login: (payload: AuthPayload) => void
    logout: () => void
    updateUser: (user: unknown) => void
  }
  export function AuthProvider({ children }: { children: ReactNode }): JSX.Element
  export function useAuth(): AuthContextValue
}

declare module 'shared/ToastContext' {
  import type { ReactNode } from 'react'
  export type ToastType = 'success' | 'error' | 'warning' | 'info'
  export interface Toast {
    id: string
    type: ToastType
    message: string
  }
  export interface ToastContextValue {
    toasts: Toast[]
    success: (message: string) => void
    error: (message: string) => void
    warning: (message: string) => void
    info: (message: string) => void
    removeToast: (id: string) => void
  }
  export function ToastProvider({ children }: { children: ReactNode }): JSX.Element
  export function useToast(): ToastContextValue
}

declare module 'shared/authApi' {
  export const authApi: {
    register: (data: { email: string; password: string; name?: string }) => Promise<{ data: { data: { access_token: string; refresh_token: string; user: unknown } } }>
    login: (data: { email: string; password: string }) => Promise<{ data: { data: { access_token: string; refresh_token: string; user: unknown } } }>
    forgotPassword: (data: { email: string }) => Promise<{ data: { data: { message: string } } }>
    resetPassword: (data: { email: string; otp: string; new_password: string }) => Promise<{ data: { data: { message: string } } }>
    getGoogleUrl: () => Promise<{ data: { data: { url: string } } }>
    getMe: () => Promise<{ data: { data: unknown } }>
  }
}

declare module 'shared/schemas' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const loginSchema: import('zod').ZodObject<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const registerSchema: import('zod').ZodEffects<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const forgotPasswordSchema: import('zod').ZodObject<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const resetPasswordSchema: import('zod').ZodEffects<any>
}

declare module 'shared/types' {
  export interface LoginForm {
    email: string
    password: string
  }
  export interface RegisterForm {
    name?: string
    email: string
    password: string
    confirmPassword: string
  }
  export interface ForgotPasswordForm {
    email: string
  }
  export interface ResetPasswordForm {
    email: string
    otp: string
    newPassword: string
    confirmNewPassword: string
  }
}

declare module 'shared/Toast' {
  export const Toast: () => JSX.Element
}

declare module 'shared/useLoginMutation' {
  import type { UseMutationResult } from '@tanstack/react-query'
  interface LoginPayload { access_token: string; refresh_token: string; user: unknown }
  export function useLoginMutation(): UseMutationResult<LoginPayload, Error, { email: string; password: string }, unknown>
}

declare module 'shared/useRegisterMutation' {
  import type { UseMutationResult } from '@tanstack/react-query'
  export function useRegisterMutation(): UseMutationResult<unknown, Error, { email: string; password: string; name?: string }, unknown>
}

declare module 'shared/useForgotPasswordMutation' {
  import type { UseMutationResult } from '@tanstack/react-query'
  export function useForgotPasswordMutation(): UseMutationResult<unknown, Error, { email: string }, unknown>
}

declare module 'shared/useResetPasswordMutation' {
  import type { UseMutationResult } from '@tanstack/react-query'
  export function useResetPasswordMutation(): UseMutationResult<unknown, Error, { email: string; otp: string; new_password: string }, unknown>
}

declare module 'shared/I18nContext' {
  import type { ReactNode } from 'react'
  export function I18nProvider({ children }: { children: ReactNode }): JSX.Element
  export function useI18n(): { locale: string; setLocale: (locale: string) => void; t: (key: string) => string }
}

declare module 'shared/fieldError' {
  import type { TFunction } from 'i18next'
  export function fieldError(t: TFunction, message?: string): string | undefined
}
