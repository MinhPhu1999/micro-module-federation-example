import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { AuthProvider, useAuth } from '@micro-fe/shared/AuthContext'
import { ToastProvider } from '@micro-fe/shared/ToastContext'
import { Toast } from '@micro-fe/shared/Toast'
import { I18nProvider } from '@micro-fe/shared/I18nContext'
import { Spinner } from '@micro-fe/shared/Spinner'

const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'))

function AuthRoutes() {
  const { isAuthenticated, isLoading } = useAuth()
  const { t } = useTranslation()

  if (isLoading) return <Spinner />

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
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  )
}

function App() {
  return (
    <BrowserRouter>
      <I18nProvider>
        <AuthProvider>
          <ToastProvider>
            <AuthRoutes />
            <Toast />
          </ToastProvider>
        </AuthProvider>
      </I18nProvider>
    </BrowserRouter>
  )
}
export default App
