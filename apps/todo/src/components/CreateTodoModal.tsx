import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateTodo } from 'shared/useCreateTodo'
import { useToast } from 'shared/ToastContext'
import { Modal } from 'shared/Modal'
import { Input } from 'shared/Input'
import { TextArea } from 'shared/TextArea'
import { Button } from 'shared/Button'
import { createTodoSchema } from 'shared/schemas'
import type { CreateTodoForm } from 'shared/types'

interface CreateTodoModalProps {
  open: boolean
  onClose: () => void
}

export const CreateTodoModal = ({ open, onClose }: CreateTodoModalProps) => {
  const { t } = useTranslation()
  const toast = useToast()
  const createMutation = useCreateTodo()
  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<CreateTodoForm>({
    resolver: zodResolver(createTodoSchema),
    mode: 'onTouched',
  })

  const onSubmit = async (data: CreateTodoForm) => {
    try {
      await createMutation.mutateAsync(data)
      toast.success(t('todo.create_success'))
      reset()
      onClose()
    } catch (err) {
      const e = err as { displayMessage?: string }
      toast.error(e.displayMessage || t('todo.create_failed'))
    }
  }

  return (
    <Modal isOpen={open} onClose={onClose} title={t('todo.create_title')}>
      <form onSubmit={handleSubmit(onSubmit)} className="todo-space-y-4">
        <Input label={t('todo.title')} {...register('title')} error={errors.title?.message as string | undefined} />
        <TextArea label={t('todo.description')} {...register('description')} error={errors.description?.message as string | undefined} />
        <div className="todo-flex todo-justify-end todo-gap-3">
          <Button variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
          <Button type="submit" isLoading={createMutation.isPending} disabled={!isValid || createMutation.isPending}>{t('common.create')}</Button>
        </div>
      </form>
    </Modal>
  )
}
