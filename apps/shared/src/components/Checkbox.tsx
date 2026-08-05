import { forwardRef, type InputHTMLAttributes } from 'react'
import '../index.css'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="sh-flex sh-flex-col">
        <label htmlFor={inputId} className="sh-inline-flex sh-items-center sh-gap-2 sh-cursor-pointer">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className={`sh-h-4.5 sh-w-4.5 sh-cursor-pointer sh-rounded sh-accent-primary-500 focus:sh-outline-none ${className}`}
            {...props}
          />
          {label && (
            <span className="sh-text-sm sh-font-medium sh-text-gray-700 dark:sh-text-gray-300">{label}</span>
          )}
        </label>
        {error && <p className="sh-mt-1 sh-text-xs sh-text-red-500">{error}</p>}
      </div>
    )
  },
)

Checkbox.displayName = 'Checkbox'
