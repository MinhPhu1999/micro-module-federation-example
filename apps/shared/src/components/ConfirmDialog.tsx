import { Button } from '@micro-fe/shared/Button'
import { Modal } from '@micro-fe/shared/Modal'
import '../index.css'

interface ConfirmDialogProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  title?: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'primary'
}

export const ConfirmDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Confirm',
  message = 'Are you sure?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
}: ConfirmDialogProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size="sm">
      <p className="sh-text-sm sh-text-gray-600 dark:sh-text-gray-400 sh-mb-6">{message}</p>
      <div className="sh-flex sh-justify-end sh-gap-3">
        <Button variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
        <Button variant={variant} onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </Modal>
  )
}
