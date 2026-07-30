import { z } from 'zod'

export const emailSchema = z.string().email('validation.email_invalid')

export const passwordSchema = z
  .string()
  .min(8, 'validation.password_min')
  .max(72, 'validation.password_max')

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'validation.required'),
})

export const registerSchema = z.object({
  name: z.string().optional(),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'validation.password_mismatch',
  path: ['confirmPassword'],
})

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export const resetPasswordSchema = z.object({
  email: emailSchema,
  otp: z
    .string()
    .length(6, 'validation.otp_length')
    .regex(/^\d+$/, 'validation.otp_digits'),
  newPassword: passwordSchema,
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'validation.password_mismatch',
  path: ['confirmNewPassword'],
})

export type LoginForm = z.infer<typeof loginSchema>
export type RegisterForm = z.infer<typeof registerSchema>
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>
