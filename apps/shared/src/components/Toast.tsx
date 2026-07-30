import { useToast } from '@/contexts/ToastContext'
import { Button } from './Button'
import '../index.css'

export const Toast = () => {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  const typeStyles = {
    success: 'sh-bg-green-500',
    error: 'sh-bg-red-500',
    warning: 'sh-bg-yellow-500',
    info: 'sh-bg-blue-500',
  }

  const typeIcons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  }

  return (
    <div className="sh-fixed sh-top-4 sh-right-4 sh-z-[100] sh-flex sh-flex-col sh-gap-2 sh-max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`sh-flex sh-items-center sh-gap-3 sh-px-4 sh-py-3 sh-rounded-lg sh-text-white sh-shadow-lg sh-animate-slide-in ${typeStyles[toast.type]}`}
        >
          <span className="sh-text-lg sh-font-bold">{typeIcons[toast.type]}</span>
          <span className="sh-flex-1 sh-text-sm">{toast.message}</span>
          <Button variant="ghost" size="sm" onClick={() => removeToast(toast.id)} className="sh-text-white/80 hover:sh-text-white">
            ✕
          </Button>
        </div>
      ))}
    </div>
  )
}
