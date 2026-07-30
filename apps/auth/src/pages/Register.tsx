import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Input } from 'shared/Input'
import { Button } from 'shared/Button'
import { useToast } from 'shared/ToastContext'
import { useRegisterMutation } from 'shared/useRegisterMutation'
import { registerSchema } from 'shared/schemas'
import type { RegisterForm } from 'shared/types'
import { AuthLayout } from '../layouts/AuthLayout'
import '../index.css'

export const RegisterPage = () => {
  const { t } = useTranslation()
  const toast = useToast()
  const navigate = useNavigate()
  const registerMutation = useRegisterMutation()

  const { register, handleSubmit, formState: { errors, isValid } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
  })

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerMutation.mutateAsync({ email: data.email, password: data.password, name: data.name })
      toast.success(t('auth.register_success'))
      navigate('/login', { replace: true })
    } catch (err) {
      const error = err as { displayMessage?: string }
      toast.error(error.displayMessage || t('auth.register_failed'))
    }
  }

  return (
    <AuthLayout title={t('auth.register')}>
      <form onSubmit={handleSubmit(onSubmit)} className="auth-space-y-4">
        <Input
          label={t('auth.name')}
          {...register('name')}
          error={errors.name?.message}
        />
        <Input
          label={t('auth.email')}
          type="email"
          autoComplete="email"
          {...register('email')}
          error={errors.email?.message}
        />
        <Input
          label={t('auth.password')}
          type="password"
          autoComplete="new-password"
          {...register('password')}
          error={errors.password?.message}
        />
        <Input
          label={t('auth.confirm_password')}
          type="password"
          autoComplete="new-password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />
        <Button type="submit" isLoading={registerMutation.isPending} disabled={!isValid || registerMutation.isPending} className="auth-w-full">
          {t('auth.register')}
        </Button>
      </form>
      <div className="auth-mt-4 auth-text-center auth-text-sm">
        <p>
          {t('auth.has_account')}{' '}
          <a href="/login" className="auth-text-blue-600 hover:auth-underline auth-font-medium">
            {t('auth.login')}
          </a>
        </p>
      </div>
    </AuthLayout>
  )
}
export default RegisterPage
