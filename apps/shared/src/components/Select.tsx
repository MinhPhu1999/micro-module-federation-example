import { forwardRef, type SelectHTMLAttributes } from 'react'
import '../index.css'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: SelectOption[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="sh-w-full">
        {label && (
          <label htmlFor={inputId} className="sh-block sh-text-sm sh-font-medium sh-text-gray-700 dark:sh-text-gray-300 sh-mb-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={`sh-w-full sh-rounded-lg sh-border sh-px-3 sh-py-2 sh-text-sm sh-transition-colors focus:sh-outline-none focus:sh-ring-2 focus:sh-ring-primary-500 focus:sh-ring-offset-2 ${
            error
              ? 'sh-border-red-500 focus:sh-ring-red-500'
              : 'sh-border-gray-300 dark:sh-border-gray-600'
          } sh-bg-white dark:sh-bg-gray-800 sh-text-gray-900 dark:sh-text-gray-100 ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="sh-mt-1 sh-text-xs sh-text-red-500">{error}</p>}
      </div>
    )
  },
)

Select.displayName = 'Select'
