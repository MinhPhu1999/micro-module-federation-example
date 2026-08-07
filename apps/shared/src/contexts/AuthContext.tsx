import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { User, AuthPayload } from "@micro-fe/shared/types"
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken, setUser, clearAuth } from "@micro-fe/shared/storage"
import { authApi } from "@micro-fe/shared/authApi"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthContextValue extends AuthState {
  login: (payload: AuthPayload) => void
  logout: () => Promise<void>
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

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

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken()
    if (refreshToken) {
      await authApi.logout({ refresh_token: refreshToken }).catch(() => undefined)
    }
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
