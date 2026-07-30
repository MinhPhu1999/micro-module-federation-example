import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useSearchParams } from 'react-router'
import { Input } from 'shared/Input'
import { Button } from 'shared/Button'
import { useToast } from 'shared/ToastContext'
import { useResetPasswordMutation } from 'shared/useResetPasswordMutation'
import { resetPasswordSchema } from 'shared/schemas'
import type { ResetPasswordForm } from 'shared/types'
import { AuthLayout } from '../layouts/AuthLayout'
import '../index.css'

export const ResetPasswordPage = () => {
  const { t } = useTranslation()
  const toast = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const emailFromUrl = searchParams.get('email') || ''
  const resetPasswordMutation = useResetPasswordMutation()

  const { register, handleSubmit, setValue, formState: { errors, isValid } } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onTouched',
    defaultValues: { email: emailFromUrl },
  })

  useEffect(() => {
    if (emailFromUrl) setValue('email', emailFromUrl)
  }, [emailFromUrl, setValue])

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      await resetPasswordMutation.mutateAsync({ email: data.email, otp: data.otp, new_password: data.newPassword })
      toast.success(t('auth.reset_success'))
      navigate('/login', { replace: true })
    } catch (err) {
      const error = err as { displayMessage?: string }
      toast.error(error.displayMessage || t('auth.reset_failed'))
    }
  }

  return (
    <AuthLayout title={t('auth.reset_password')}>
      <form onSubmit={handleSubmit(onSubmit)} className="auth-space-y-4">
        <Input
          label={t('auth.email')}
          type="email"
          autoComplete="email"
          {...register('email')}
          error={errors.email?.message}
        />
        <Input
          label={t('auth.otp')}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          {...register('otp')}
          error={errors.otp?.message}
        />
        <Input
          label={t('auth.new_password')}
          type="password"
          autoComplete="new-password"
          {...register('newPassword')}
          error={errors.newPassword?.message}
        />
        <Input
          label={t('auth.confirm_password')}
          type="password"
          autoComplete="new-password"
          {...register('confirmNewPassword')}
          error={errors.confirmNewPassword?.message}
        />
        <Button type="submit" isLoading={resetPasswordMutation.isPending} disabled={!isValid || resetPasswordMutation.isPending} className="auth-w-full">
          {t('auth.reset_password')}
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
export default ResetPasswordPage
