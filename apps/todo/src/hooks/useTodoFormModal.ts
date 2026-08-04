import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useForm, type Resolver, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { todoApi } from 'shared/todoApi'
import { todoKeys } from 'shared/useTodos'
import { useCreateTodo } from 'shared/useCreateTodo'
import { useUpdateTodo } from 'shared/useUpdateTodo'
import { useToast } from 'shared/ToastContext'
import { createTodoSchema, updateTodoSchema } from 'shared/schemas'
import type { Todo } from 'shared/types'

export interface TodoFormValues {
  title: string
  description: string
  completed: boolean
}

const EMPTY_FORM: TodoFormValues = { title: '', description: '', completed: false }

interface UseTodoFormModalOptions {
  mode: 'create' | 'edit'
  open: boolean
  todoId: string | null
  onClose: () => void
}

interface UseTodoFormModalReturn {
  form: UseFormReturn<TodoFormValues>
  isEdit: boolean
  currentTodo: Todo | null
  isLoading: boolean
  isError: boolean
  isSubmitting: boolean
  retry: () => void
  handleClose: () => void
  submit: (values: TodoFormValues) => Promise<void>
}

export function useTodoFormModal({ mode, open, todoId, onClose }: UseTodoFormModalOptions): UseTodoFormModalReturn {
  const { t } = useTranslation()
  const toast = useToast()
  const isEdit = mode === 'edit'

  const createMutation = useCreateTodo()
  const updateMutation = useUpdateTodo()

  const { data: currentTodo, isLoading, isError, refetch } = useQuery({
    queryKey: todoKeys.detail(todoId ?? ''),
    queryFn: async () => {
      const { data } = await todoApi.getById(todoId!)
      return data.data as Todo
    },
    enabled: isEdit && open && !!todoId,
  })

  const formValues = useMemo<TodoFormValues | undefined>(() => {
    if (!isEdit || !currentTodo) return undefined
    return {
      title: currentTodo.title,
      description: currentTodo.description ?? '',
      completed: currentTodo.completed,
    }
  }, [isEdit, currentTodo])

  const form = useForm<TodoFormValues>({
    resolver: zodResolver(isEdit ? updateTodoSchema : createTodoSchema) as unknown as Resolver<TodoFormValues>,
    mode: 'onTouched',
    defaultValues: EMPTY_FORM,
    values: formValues,
  })

  const wasOpenRef = useRef(false)
  useEffect(() => {
    const justOpened = open && !wasOpenRef.current
    wasOpenRef.current = open
    if (!justOpened) return
    if (isEdit && currentTodo) {
      form.reset({
        title: currentTodo.title,
        description: currentTodo.description ?? '',
        completed: currentTodo.completed,
      })
    } else {
      form.reset(EMPTY_FORM)
    }
  }, [open, isEdit, currentTodo, form])

  const handleClose = useCallback(() => {
    form.reset(EMPTY_FORM)
    onClose()
  }, [form, onClose])

  const submit = useCallback(
    async (values: TodoFormValues) => {
      const payload = {
        title: values.title,
        description: values.description || undefined,
        completed: values.completed,
      }
      try {
        if (isEdit && todoId) {
          await updateMutation.mutateAsync({ id: todoId, data: payload })
          toast.success(t('todo.update_success'))
        } else {
          await createMutation.mutateAsync({ title: payload.title, description: payload.description })
          toast.success(t('todo.create_success'))
        }
        handleClose()
      } catch (err) {
        const e = err as { displayMessage?: string }
        toast.error(e.displayMessage || t(isEdit ? 'todo.update_failed' : 'todo.create_failed'))
      }
    },
    [isEdit, todoId, updateMutation, createMutation, toast, t, handleClose],
  )

  return {
    form,
    isEdit,
    currentTodo: currentTodo ?? null,
    isLoading: isEdit && isLoading,
    isError: isEdit && isError,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    retry: () => {
      void refetch()
    },
    handleClose,
    submit,
  }
}
