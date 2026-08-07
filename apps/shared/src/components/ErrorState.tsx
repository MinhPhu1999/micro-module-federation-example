import { Button } from '@micro-fe/shared/Button'
import '../index.css'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export const ErrorState = ({ title = 'Something went wrong', message, onRetry }: ErrorStateProps) => {
  return (
    <div className="sh-flex sh-flex-col sh-items-center sh-justify-center sh-py-12 sh-px-4 sh-text-center">
      <div className="sh-mb-4 sh-text-red-500">
        <svg className="sh-w-12 sh-h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="sh-text-lg sh-font-medium sh-text-gray-900 dark:sh-text-gray-100">{title}</h3>
      {message && (
        <p className="sh-mt-2 sh-text-sm sh-text-gray-500 dark:sh-text-gray-400 sh-max-w-sm">{message}</p>
      )}
      {onRetry && (
        <div className="sh-mt-4">
          <Button variant="primary" onClick={onRetry}>Retry</Button>
        </div>
      )}
    </div>
  )
}
