import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Modal } from 'shared/Modal'
import { Input } from 'shared/Input'
import { TextArea } from 'shared/TextArea'
import { Checkbox } from 'shared/Checkbox'
import { Button } from 'shared/Button'
import { Spinner } from 'shared/Spinner'
import { ErrorState } from 'shared/ErrorState'
import { formatDate } from 'shared/formatDate'
import { fieldError } from 'shared/fieldError'
import { useTodoFormModal } from '../hooks/useTodoFormModal'
import '../index.css'

interface TodoFormModalProps {
  mode: 'create' | 'edit'
  open: boolean
  todoId?: string | null
  onClose: () => void
}

export const TodoFormModal = ({ mode, open, todoId = null, onClose }: TodoFormModalProps) => {
  const { t } = useTranslation()
  const {
    form,
    isEdit,
    currentTodo,
    isLoading,
    isError,
    isSubmitting,
    retry,
    handleClose,
    submit,
  } = useTodoFormModal({ mode, open, todoId, onClose })
  const { register, handleSubmit, control, formState: { errors, isValid, isDirty } } = form

  return (
    <Modal isOpen={open} onClose={handleClose} title={t(isEdit ? 'todo.edit_title' : 'todo.create_title')}>
      {isEdit && isLoading ? (
        <Spinner />
      ) : isEdit && isError ? (
        <ErrorState title={t('todo.edit_load_error')} onRetry={retry} />
      ) : (
        <form onSubmit={handleSubmit(submit)} className="todo-space-y-4">
          <Input label={t('todo.title')} {...register('title')} error={fieldError(t, errors.title?.message)} />
          <TextArea label={t('todo.description')} {...register('description')} error={fieldError(t, errors.description?.message)} />
          {isEdit && (
            <Controller
              name="completed"
              control={control}
              render={({ field }) => (
                <Checkbox
                  label={t('todo.completed')}
                  checked={field.value ?? false}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
          )}
          {isEdit && currentTodo?.completed && currentTodo.completed_at && (
            <p className="todo-text-sm todo-text-gray-500">
              {t('todo.completed_at')}: {formatDate(currentTodo.completed_at)}
            </p>
          )}
          <div className="todo-flex todo-justify-end todo-gap-3">
            <Button variant="secondary" onClick={handleClose}>{t('common.cancel')}</Button>
            <Button type="submit" isLoading={isSubmitting} disabled={!isValid || (isEdit && !isDirty) || isSubmitting}>
              {t(isEdit ? 'common.save' : 'common.create')}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
