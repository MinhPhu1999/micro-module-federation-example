import type { ReactNode } from 'react'
import { Button } from '@micro-fe/shared/Button'
import '../index.css'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <div className="sh-flex sh-flex-col sh-items-center sh-justify-center sh-py-12 sh-px-4 sh-text-center">
      {icon && <div className="sh-mb-4 sh-text-gray-400">{icon}</div>}
      <h3 className="sh-text-lg sh-font-medium sh-text-gray-900 dark:sh-text-gray-100">{title}</h3>
      {description && (
        <p className="sh-mt-2 sh-text-sm sh-text-gray-500 dark:sh-text-gray-400 sh-max-w-sm">{description}</p>
      )}
      {action && (
        <div className="sh-mt-4">
          <Button onClick={action.onClick}>{action.label}</Button>
        </div>
      )}
    </div>
  )
}
