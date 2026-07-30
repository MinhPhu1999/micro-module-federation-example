import type { ReactNode } from 'react'
import '../index.css'

interface CardProps {
  title?: string
  children: ReactNode
  className?: string
  padding?: boolean
}

export const Card = ({ title, children, className = '', padding = true }: CardProps) => {
  return (
    <div className={`sh-bg-white dark:sh-bg-gray-800 sh-rounded-lg sh-shadow-sm sh-border sh-border-gray-200 dark:sh-border-gray-700 ${className}`}>
      {title && (
        <div className="sh-px-4 sh-py-3 sh-border-b sh-border-gray-200 dark:sh-border-gray-700">
          <h3 className="sh-text-lg sh-font-medium sh-text-gray-900 dark:sh-text-gray-100">{title}</h3>
        </div>
      )}
      <div className={padding ? 'sh-p-4' : ''}>{children}</div>
    </div>
  )
}
