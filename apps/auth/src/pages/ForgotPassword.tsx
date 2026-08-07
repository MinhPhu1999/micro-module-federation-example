import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Input } from '@micro-fe/shared/Input'
import { Button } from '@micro-fe/shared/Button'
import { useToast } from '@micro-fe/shared/ToastContext'
import { useForgotPasswordMutation } from '@micro-fe/shared/useForgotPasswordMutation'
import { fieldError } from '@micro-fe/shared/fieldError'
import { forgotPasswordSchema, type ForgotPasswordForm } from '@micro-fe/shared/schemas'
import { AuthLayout } from '../layouts/AuthLayout'
import '../index.css'

export const ForgotPasswordPage = () => {
  const { t } = useTranslation()
  const toast = useToast()
  const navigate = useNavigate()
  const forgotPasswordMutation = useForgotPasswordMutation()

  const { register, handleSubmit, formState: { errors, isValid } } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onTouched',
  })

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      await forgotPasswordMutation.mutateAsync(data)
      toast.success(t('auth.forgot_password_sent'))
      navigate(`/reset-password?email=${encodeURIComponent(data.email)}`, { replace: true })
    } catch (err) {
      const error = err as { displayMessage?: string }
      toast.error(error.displayMessage || t('auth.forgot_password_failed'))
    }
  }

  return (
    <AuthLayout title={t('auth.forgot_password')}>
      <form onSubmit={handleSubmit(onSubmit)} className="auth-space-y-4">
        <Input
          label={t('auth.email')}
          type="email"
          autoComplete="email"
          {...register('email')}
          error={fieldError(t, errors.email?.message)}
        />
        <Button type="submit" isLoading={forgotPasswordMutation.isPending} disabled={!isValid || forgotPasswordMutation.isPending} className="auth-w-full">
          {t('auth.forgot_password')}
        </Button>
      </form>
      <div className="auth-mt-4 auth-text-center auth-text-sm">
        <a href="/login" className="auth-text-blue-600 hover:auth-underline auth-font-medium">
          {t('auth.back_to_login')}
        </a>
      </div>
    </AuthLayout>
  )
}
export default ForgotPasswordPage
