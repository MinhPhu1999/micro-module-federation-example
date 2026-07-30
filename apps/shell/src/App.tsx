import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router'
import { lazy, Suspense, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from 'shared/AuthContext'
import { ThemeProvider } from 'shared/ThemeContext'
import { ToastProvider } from 'shared/ToastContext'
import { Toast } from 'shared/Toast'
import { I18nProvider } from 'shared/I18nContext'
import { Spinner } from 'shared/Spinner'
import { ProtectedRoute } from 'shared/ProtectedRoute'
import { ErrorBoundary } from './components/ErrorBoundary'
import { AppLayout } from './components/AppLayout'
import { GoogleCallback } from './components/GoogleCallback'
import { NotFound } from './pages/NotFound'
import { setOnUnauthorized } from 'shared/apiClient'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000, refetchOnWindowFocus: false },
  },
})

const LoginPage = lazy(() => import('auth/LoginPage'))
const RegisterPage = lazy(() => import('auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('auth/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('auth/ResetPasswordPage'))
const TodoPage = lazy(() => import('todo/TodoPage'))

function AxiosInterceptor() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
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
          <I18nProvider>
            <ThemeProvider>
              <ToastProvider>
              <AxiosInterceptor />
              <Routes>
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
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toast />
              </ToastProvider>
            </ThemeProvider>
          </I18nProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
export default App
