import type { ReactNode } from 'react'

interface AuthLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
}

export const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps) => (
  <div className="auth-min-h-screen auth-flex auth-items-center auth-justify-center auth-bg-gray-50 dark:auth-bg-gray-900">
    <div className="auth-w-full auth-max-w-md auth-p-8 auth-space-y-6 auth-bg-white dark:auth-bg-gray-800 auth-rounded-xl auth-shadow-lg">
      <div className="auth-text-center">
        <h1 className="auth-text-2xl auth-font-bold dark:auth-text-gray-100">{title}</h1>
        {subtitle && <p className="auth-mt-2 auth-text-sm auth-text-gray-600 dark:auth-text-gray-400">{subtitle}</p>}
      </div>
      {children}
    </div>
  </div>
)
