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

const DARK_CLASSES = ['dark', 'sh-dark', 'navbar-dark', 'auth-dark', 'todo-dark']
const LIGHT_CLASSES = ['light', 'sh-light', 'navbar-light', 'auth-light', 'todo-light']

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove(...LIGHT_CLASSES, ...DARK_CLASSES)
    root.classList.add(...(theme === 'dark' ? DARK_CLASSES : LIGHT_CLASSES))
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
