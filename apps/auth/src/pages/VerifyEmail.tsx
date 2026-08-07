import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useSearchParams } from 'react-router'
import { Input } from '@micro-fe/shared/Input'
import { Button } from '@micro-fe/shared/Button'
import { useToast } from '@micro-fe/shared/ToastContext'
import { useVerifyEmailMutation } from '@micro-fe/shared/useVerifyEmailMutation'
import { useResendVerificationMutation } from '@micro-fe/shared/useResendVerificationMutation'
import { fieldError } from '@micro-fe/shared/fieldError'
import { verifyEmailSchema, type VerifyEmailForm } from '@micro-fe/shared/schemas'
import { AuthLayout } from '../layouts/AuthLayout'
import '../index.css'

const RESEND_COOLDOWN_SECONDS = 30

export const VerifyEmailPage = () => {
  const { t } = useTranslation()
  const toast = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const emailFromUrl = searchParams.get('email') || ''
  const verifyEmailMutation = useVerifyEmailMutation()
  const resendMutation = useResendVerificationMutation()
  const [cooldown, setCooldown] = useState(0)
  const cooldownRef = useRef<number | undefined>(undefined)

  const { register, handleSubmit, getValues, setValue, formState: { errors, isValid } } = useForm<VerifyEmailForm>({
    resolver: zodResolver(verifyEmailSchema),
    mode: 'onTouched',
    defaultValues: { email: emailFromUrl },
  })

  useEffect(() => {
    if (emailFromUrl) setValue('email', emailFromUrl)
  }, [emailFromUrl, setValue])

  useEffect(() => {
    if (cooldown <= 0) return
    cooldownRef.current = window.setTimeout(() => setCooldown((prev) => prev - 1), 1000)
    return () => window.clearTimeout(cooldownRef.current)
  }, [cooldown])

  const handleResend = async () => {
    const email = getValues('email')
    if (!email) {
      toast.error(t('validation.required'))
      return
    }
    try {
      await resendMutation.mutateAsync({ email })
      toast.success(t('auth.verification_sent'))
      setCooldown(RESEND_COOLDOWN_SECONDS)
    } catch (err) {
      const error = err as { displayMessage?: string }
      toast.error(error.displayMessage || t('auth.verification_failed'))
    }
  }

  const onSubmit = async (data: VerifyEmailForm) => {
    try {
      await verifyEmailMutation.mutateAsync(data)
      toast.success(t('auth.verification_success'))
      navigate('/login', { replace: true })
    } catch (err) {
      const error = err as { displayMessage?: string }
      toast.error(error.displayMessage || t('auth.verification_failed'))
    }
  }

  const resendDisabled = resendMutation.isPending || cooldown > 0

  return (
    <AuthLayout title={t('auth.verify_email')}>
      <p className="auth-text-sm auth-text-gray-600 dark:auth-text-gray-400 auth-text-center auth-mb-4">
        {t('auth.verify_email_hint')}
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="auth-space-y-4">
        <Input
          label={t('auth.email')}
          type="email"
          autoComplete="email"
          {...register('email')}
          error={fieldError(t, errors.email?.message)}
        />
        <Input
          label={t('auth.otp')}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          {...register('otp')}
          error={fieldError(t, errors.otp?.message)}
        />
        <Button type="submit" isLoading={verifyEmailMutation.isPending} disabled={!isValid || verifyEmailMutation.isPending} className="auth-w-full">
          {t('auth.verify_email')}
        </Button>
        <Button type="button" variant="ghost" onClick={handleResend} isLoading={resendMutation.isPending} disabled={resendDisabled} className="auth-w-full">
          {cooldown > 0 ? t('auth.resend_code_in', { seconds: cooldown }) : t('auth.resend_code')}
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
export default VerifyEmailPage