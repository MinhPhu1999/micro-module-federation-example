import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { Input } from 'shared/Input'
import { Button } from 'shared/Button'
import { Spinner } from 'shared/Spinner'
import { useToast } from 'shared/ToastContext'
import { useAuth } from 'shared/AuthContext'
import { authApi } from 'shared/authApi'
import { useLoginMutation } from 'shared/useLoginMutation'
import { fieldError } from 'shared/fieldError'
import { loginSchema } from 'shared/schemas'
import type { LoginForm } from 'shared/types'
import { AuthLayout } from '../layouts/AuthLayout'
import '../index.css'

export const LoginPage = () => {
  const { t } = useTranslation()
  const toast = useToast()
  const { login, isAuthenticated, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()
  const loginMutation = useLoginMutation()

  const { register, handleSubmit, formState: { errors, isValid } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  })

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/todos', { replace: true })
    }
  }, [isAuthenticated, authLoading, navigate])

  const onSubmit = async (data: LoginForm) => {
    try {
      const payload = await loginMutation.mutateAsync(data)
      login(payload)
      toast.success(t('auth.login_success'))
      navigate('/todos', { replace: true })
    } catch (err) {
      const error = err as { displayMessage?: string }
      toast.error(error.displayMessage || t('auth.login_failed'))
    }
  }

  const handleGoogle = async () => {
    try {
      const { data } = await authApi.getGoogleUrl()
      window.location.href = data.data.url
    } catch (err) {
      const error = err as { status?: number; displayMessage?: string }
      if (error.status === 502 || error.status === 503) {
        toast.error(t('auth.google_service_unavailable'))
      } else {
        toast.error(error.displayMessage || t('auth.google_signin_failed'))
      }
    }
  }

  if (authLoading) return <Spinner />

  return (
    <AuthLayout title={t('auth.login')}>
      <form onSubmit={handleSubmit(onSubmit)} className="auth-space-y-4">
        <Input
          label={t('auth.email')}
          type="email"
          autoComplete="email"
          {...register('email')}
          error={fieldError(t, errors.email?.message)}
        />
        <Input
          label={t('auth.password')}
          type="password"
          autoComplete="current-password"
          {...register('password')}
          error={fieldError(t, errors.password?.message)}
        />
        <Button type="submit" isLoading={loginMutation.isPending} disabled={!isValid || loginMutation.isPending} className="auth-w-full">
          {t('auth.login')}
        </Button>
        <Button type="button" variant="ghost" onClick={handleGoogle} className="auth-w-full">
          {t('auth.sign_in_with_google')}
        </Button>
      </form>
      <div className="auth-mt-4 auth-space-y-2 auth-text-center auth-text-sm">
        <p>
          {t('auth.no_account')}{' '}
          <a href="/register" className="auth-text-blue-600 hover:auth-underline auth-font-medium">
            {t('auth.register')}
          </a>
        </p>
        <p>
          <a href="/forgot-password" className="auth-text-blue-600 hover:auth-underline auth-font-medium">
            {t('auth.forgot_password')}
          </a>
        </p>
      </div>
    </AuthLayout>
  )
}
export default LoginPage
