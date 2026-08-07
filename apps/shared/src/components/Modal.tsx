import { useEffect, useCallback, type ReactNode } from 'react'
import { Button } from '@micro-fe/shared/Button'
import '../index.css'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleEscape])

  if (!isOpen) return null

  const sizes = {
    sm: 'sh-max-w-sm',
    md: 'sh-max-w-md',
    lg: 'sh-max-w-lg',
  }

  return (
    <div className="sh-fixed sh-inset-0 sh-z-50 sh-flex sh-items-center sh-justify-center">
      <div
        className="sh-fixed sh-inset-0 sh-bg-black/50"
        onClick={onClose}
      />
      <div className={`sh-relative sh-w-full ${sizes[size]} sh-mx-4 sh-bg-white dark:sh-bg-gray-800 sh-rounded-xl sh-shadow-xl`}>
        {title && (
          <div className="sh-flex sh-items-center sh-justify-between sh-px-6 sh-py-4 sh-border-b sh-border-gray-200 dark:sh-border-gray-700">
            <h2 className="sh-text-lg sh-font-semibold sh-text-gray-900 dark:sh-text-gray-100">{title}</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="sh-p-1">
              <svg className="sh-w-5 sh-h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        )}
        <div className="sh-p-6">{children}</div>
      </div>
    </div>
  )
}
