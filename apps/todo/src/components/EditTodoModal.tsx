import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { todoApi } from 'shared/todoApi'
import { useUpdateTodo } from 'shared/useUpdateTodo'
import { todoKeys } from 'shared/useTodos'
import { useToast } from 'shared/ToastContext'
import { Modal } from 'shared/Modal'
import { Input } from 'shared/Input'
import { TextArea } from 'shared/TextArea'
import { Checkbox } from 'shared/Checkbox'
import { Button } from 'shared/Button'
import { Spinner } from 'shared/Spinner'
import { ErrorState } from 'shared/ErrorState'
import { formatDate } from 'shared/formatDate'
import { updateTodoSchema } from 'shared/schemas'
import type { UpdateTodoForm, Todo } from 'shared/types'

interface EditTodoModalProps {
  todoId: string | null
  onClose: () => void
}

export const EditTodoModal = ({ todoId, onClose }: EditTodoModalProps) => {
  const { t } = useTranslation()
  const toast = useToast()
  const updateMutation = useUpdateTodo()
  const { register, handleSubmit, reset, control, formState: { errors, isValid } } = useForm<UpdateTodoForm>({
    resolver: zodResolver(updateTodoSchema),
    mode: 'onTouched',
  })

  const { data: todoData, isLoading, isError } = useQuery({
    queryKey: todoKeys.detail(todoId!),
    queryFn: async () => {
      const { data } = await todoApi.getById(todoId!)
      return data.data as Todo
    },
    enabled: !!todoId,
  })

  useEffect(() => {
    if (todoData) {
      reset({
        title: todoData.title,
        description: todoData.description,
        completed: todoData.completed,
      })
    }
  }, [todoData, reset])

  const onSubmit = async (data: UpdateTodoForm) => {
    if (!todoId) return
    try {
      await updateMutation.mutateAsync({ id: todoId, data })
      toast.success(t('todo.update_success'))
      onClose()
    } catch (err) {
      const e = err as { displayMessage?: string }
      toast.error(e.displayMessage || t('todo.update_failed'))
    }
  }

  return (
    <Modal isOpen={!!todoId} onClose={onClose} title={t('todo.edit_title')}>
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <ErrorState title={t('todo.edit_load_error')} onRetry={() => reset()} />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="todo-space-y-4">
          <Input label={t('todo.title')} {...register('title')} error={errors.title?.message as string | undefined} />
          <TextArea label={t('todo.description')} {...register('description')} error={errors.description?.message as string | undefined} />
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
          {todoData?.completed && todoData?.completed_at && (
            <p className="todo-text-sm todo-text-gray-500">
              {t('todo.completed_at')}: {formatDate(todoData.completed_at)}
            </p>
          )}
          <div className="todo-flex todo-justify-end todo-gap-3">
            <Button variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
            <Button type="submit" isLoading={updateMutation.isPending} disabled={!isValid || updateMutation.isPending}>{t('common.save')}</Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
