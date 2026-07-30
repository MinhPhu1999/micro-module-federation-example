import { z } from 'zod';
export declare const emailSchema: z.ZodString;
export declare const passwordSchema: z.ZodString;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const registerSchema: z.ZodEffects<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    confirmPassword: string;
    name?: string | undefined;
}, {
    email: string;
    password: string;
    confirmPassword: string;
    name?: string | undefined;
}>, {
    email: string;
    password: string;
    confirmPassword: string;
    name?: string | undefined;
}, {
    email: string;
    password: string;
    confirmPassword: string;
    name?: string | undefined;
}>;
export declare const forgotPasswordSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export declare const resetPasswordSchema: z.ZodEffects<z.ZodObject<{
    email: z.ZodString;
    otp: z.ZodString;
    newPassword: z.ZodString;
    confirmNewPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    otp: string;
    newPassword: string;
    confirmNewPassword: string;
}, {
    email: string;
    otp: string;
    newPassword: string;
    confirmNewPassword: string;
}>, {
    email: string;
    otp: string;
    newPassword: string;
    confirmNewPassword: string;
}, {
    email: string;
    otp: string;
    newPassword: string;
    confirmNewPassword: string;
}>;
export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;
