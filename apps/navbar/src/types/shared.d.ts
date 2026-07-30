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

declare module 'shared/LanguageSwitcher' {
  export const LanguageSwitcher: () => JSX.Element
}

declare module 'shared/ThemeContext' {
  export function ThemeProvider({ children }: { children: React.ReactNode }): JSX.Element
  export function useTheme(): { theme: string; toggleTheme: () => void }
}

declare module 'shared/AuthContext' {
  export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element
  export function useAuth(): {
    user: { name?: string; email?: string; picture?: string } | null
    isAuthenticated: boolean
    isLoading: boolean
    logout: () => void
  }
}

declare module 'shared/I18nContext' {
  export function I18nProvider({ children }: { children: React.ReactNode }): JSX.Element
  export function useI18n(): { locale: string; setLocale: (locale: string) => void; t: (key: string) => string }
}
