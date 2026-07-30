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

declare module 'shared/TextArea' {
  import type { TextareaHTMLAttributes } from 'react'
  interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
  }
  export const TextArea: (props: TextAreaProps) => JSX.Element
}

declare module 'shared/Select' {
  import type { SelectHTMLAttributes } from 'react'
  interface SelectOption { value: string; label: string }
  interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
    error?: string
    options: SelectOption[]
  }
  export const Select: (props: SelectProps) => JSX.Element
}

declare module 'shared/Checkbox' {
  import type { InputHTMLAttributes } from 'react'
  interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string
    error?: string
  }
  export const Checkbox: (props: CheckboxProps) => JSX.Element
}

declare module 'shared/Modal' {
  import type { ReactNode } from 'react'
  interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: ReactNode
    size?: 'sm' | 'md' | 'lg'
  }
  export const Modal: (props: ModalProps) => JSX.Element
}

declare module 'shared/ConfirmDialog' {
  interface ConfirmDialogProps {
    isOpen: boolean
    onConfirm: () => void
    onCancel: () => void
    title?: string
    message?: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: 'danger' | 'primary'
  }
  export const ConfirmDialog: (props: ConfirmDialogProps) => JSX.Element
}

declare module 'shared/Spinner' {
  export const Spinner: (props: { size?: 'sm' | 'md' | 'lg' }) => JSX.Element
}

declare module 'shared/Skeleton' {
  interface SkeletonProps {
    width?: string
    height?: string
    variant?: 'text' | 'circle' | 'rect'
    className?: string
  }
  export const Skeleton: (props: SkeletonProps) => JSX.Element
}

declare module 'shared/EmptyState' {
  import type { ReactNode } from 'react'
  interface EmptyStateProps {
    icon?: ReactNode
    title: string
    description?: string
    action?: { label: string; onClick: () => void }
  }
  export const EmptyState: (props: EmptyStateProps) => JSX.Element
}

declare module 'shared/ErrorState' {
  interface ErrorStateProps {
    title?: string
    message?: string
    onRetry?: () => void
  }
  export const ErrorState: (props: ErrorStateProps) => JSX.Element
}

declare module 'shared/Pagination' {
  interface PaginationProps {
    page: number
    limit: number
    total: number
    totalPages: number
    onPageChange: (page: number) => void
  }
  export const Pagination: (props: PaginationProps) => JSX.Element
}

declare module 'shared/Table' {
  import type { ReactNode } from 'react'
  export interface Column<T> {
    key: string
    header: string
    render?: (row: T) => ReactNode
    sortable?: boolean
    width?: string
  }
  export function Table<T>(props: {
    columns: Column<T>[]
    data: T[]
    onSort?: (key: string) => void
    sortKey?: string
    sortDir?: 'asc' | 'desc'
    isLoading?: boolean
  }): JSX.Element
}

declare module 'shared/AuthContext' {
  import type { ReactNode } from 'react'
  export interface AuthContextValue {
    user: unknown
    isAuthenticated: boolean
    isLoading: boolean
    login: (payload: { access_token: string; refresh_token: string; user: unknown }) => void
    logout: () => void
    updateUser: (user: unknown) => void
  }
  export function AuthProvider({ children }: { children: ReactNode }): JSX.Element
  export function useAuth(): AuthContextValue
}

declare module 'shared/ToastContext' {
  import type { ReactNode } from 'react'
  export interface ToastContextValue {
    toasts: Array<{ id: string; type: 'success' | 'error' | 'warning' | 'info'; message: string }>
    success: (message: string) => void
    error: (message: string) => void
    warning: (message: string) => void
    info: (message: string) => void
    removeToast: (id: string) => void
  }
  export function ToastProvider({ children }: { children: ReactNode }): JSX.Element
  export function useToast(): ToastContextValue
}

declare module 'shared/useTodos' {
  import type { TodoListParams } from 'shared/types'
  export const todoKeys: {
    all: readonly ['todos']
    lists: () => readonly ['todos', 'list']
    list: (params?: TodoListParams) => readonly ['todos', 'list', TodoListParams | undefined]
    details: () => readonly ['todos', 'detail']
    detail: (id: string) => readonly ['todos', 'detail', string]
  }
  export function useTodos(params?: TodoListParams): {
    data: { todos: import('shared/types').Todo[]; meta: import('shared/types').PaginationMeta } | undefined
    isLoading: boolean
    isError: boolean
    error: Error | null
    refetch: () => void
  }
}

declare module 'shared/useCreateTodo' {
  import type { CreateTodoRequest } from 'shared/types'
  export function useCreateTodo(): {
    mutateAsync: (payload: CreateTodoRequest) => Promise<unknown>
    isPending: boolean
  }
}

declare module 'shared/useUpdateTodo' {
  import type { UpdateTodoRequest } from 'shared/types'
  export function useUpdateTodo(): {
    mutateAsync: (payload: { id: string; data: UpdateTodoRequest }) => Promise<unknown>
    isPending: boolean
  }
}

declare module 'shared/useDeleteTodo' {
  export function useDeleteTodo(): {
    mutateAsync: (id: string) => Promise<unknown>
    isPending: boolean
  }
}

declare module 'shared/useDebounce' {
  export function useDebounce<T>(value: T, delay?: number): T
}

declare module 'shared/todoApi' {
  import type { TodoListParams, CreateTodoRequest, UpdateTodoRequest, Todo, ApiSuccess, ApiListResponse } from 'shared/types'
  export const todoApi: {
    list: (params?: TodoListParams) => Promise<{ data: ApiListResponse<Todo> }>
    getById: (id: string) => Promise<{ data: ApiSuccess<Todo> }>
    create: (data: CreateTodoRequest) => Promise<{ data: ApiSuccess<Todo> }>
    update: (id: string, data: UpdateTodoRequest) => Promise<{ data: ApiSuccess<Todo> }>
    delete: (id: string) => Promise<{ data: ApiSuccess<{ message: string }> }>
  }
}

declare module 'shared/schemas' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const createTodoSchema: import('zod').ZodObject<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const updateTodoSchema: import('zod').ZodEffects<any>
}

declare module 'shared/types' {
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
    title: string
    description?: string
  }
  export interface UpdateTodoRequest {
    title?: string
    description?: string
    completed?: boolean
  }
  export interface TodoListParams {
    pageSize?: number
    pageNumber?: number
    completed?: boolean
    search?: string
  }
  export interface CreateTodoForm {
    title: string
    description?: string
  }
  export interface UpdateTodoForm {
    title?: string
    description?: string
    completed?: boolean
  }
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
}

declare module 'shared/formatDate' {
  export function formatDate(date: string | Date, locale?: string): string
}

declare module 'shared/Toast' {
  export const Toast: () => JSX.Element
}

declare module 'shared/I18nContext' {
  import type { ReactNode } from 'react'
  export function I18nProvider({ children }: { children: ReactNode }): JSX.Element
  export function useI18n(): { locale: string; setLocale: (locale: string) => void; t: (key: string) => string }
}
