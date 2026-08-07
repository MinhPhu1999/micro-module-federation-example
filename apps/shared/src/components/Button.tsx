import type { ReactNode, ButtonHTMLAttributes } from 'react'
import { Spinner } from '@micro-fe/shared/Spinner'
import '../index.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: ReactNode
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) => {
  const base = 'sh-inline-flex sh-items-center sh-justify-center sh-rounded-lg sh-font-medium sh-transition-colors focus:sh-outline-none disabled:sh-opacity-50 disabled:sh-cursor-not-allowed'
  const variants = {
    primary: 'sh-bg-primary-500 sh-text-white hover:sh-bg-primary-600',
    secondary: 'sh-bg-gray-200 sh-text-gray-900 hover:sh-bg-gray-300',
    danger: 'sh-bg-red-600 sh-text-white hover:sh-bg-red-700',
    ghost: 'sh-bg-transparent sh-text-gray-700 hover:sh-bg-gray-100 dark:sh-text-gray-300 dark:hover:sh-bg-gray-700',
  }
  const sizes = {
    sm: 'sh-px-3 sh-py-1.5 sh-text-sm',
    md: 'sh-px-4 sh-py-2 sh-text-sm',
    lg: 'sh-px-6 sh-py-3 sh-text-base',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner size="sm" />}
      {isLoading ? <span className="sh-ml-2">{children}</span> : children}
    </button>
  )
}
