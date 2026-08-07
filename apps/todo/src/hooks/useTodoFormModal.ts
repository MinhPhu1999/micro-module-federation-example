import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useForm, type Resolver, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { todoApi } from '@micro-fe/shared/todoApi'
import { todoKeys } from '@micro-fe/shared/useTodos'
import { useCreateTodo } from '@micro-fe/shared/useCreateTodo'
import { useUpdateTodo } from '@micro-fe/shared/useUpdateTodo'
import { useToast } from '@micro-fe/shared/ToastContext'
import { createTodoSchema, updateTodoSchema } from '@micro-fe/shared/schemas'
import type { Todo, TodoPriority } from '@micro-fe/shared/types'

export interface TodoFormValues {
  title: string
  description: string
  completed: boolean
  priority: TodoPriority
  tags: string
  due_at: string
}

const EMPTY_FORM: TodoFormValues = {
  title: '',
  description: '',
  completed: false,
  priority: 'low',
  tags: '',
  due_at: '',
}

const toDateTimeLocal = (value: string | null | undefined): string => {
  if (!value) return ''
  const d = new Date(value)
  if (isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const parseTags = (value: string): string[] | undefined => {
  const tags = [...new Set(value.split(',').map((tag) => tag.trim().slice(0, 50)).filter(Boolean))]
  return tags.length ? tags.slice(0, 20) : undefined
}

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
      priority: currentTodo.priority ?? 'low',
      tags: currentTodo.tags?.join(', ') ?? '',
      due_at: toDateTimeLocal(currentTodo.due_at),
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
    form.reset(formValues ?? EMPTY_FORM)
  }, [open, isEdit, currentTodo, form, formValues])

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
        priority: values.priority,
        tags: parseTags(values.tags),
        due_at: values.due_at ? new Date(values.due_at).toISOString() : null,
      }
      try {
        if (isEdit && todoId) {
          await updateMutation.mutateAsync({ id: todoId, data: payload })
          toast.success(t('todo.update_success'))
        } else {
          await createMutation.mutateAsync({
            title: payload.title,
            description: payload.description,
            priority: payload.priority,
            tags: payload.tags,
            due_at: payload.due_at,
          })
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
