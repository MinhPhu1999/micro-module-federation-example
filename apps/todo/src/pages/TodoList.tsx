import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { useAuth } from 'shared/AuthContext'
import { useTodos } from 'shared/useTodos'
import { useDeleteTodo } from 'shared/useDeleteTodo'
import { useToast } from 'shared/ToastContext'
import { Spinner } from 'shared/Spinner'
import { EmptyState } from 'shared/EmptyState'
import { ErrorState } from 'shared/ErrorState'
import { Button } from 'shared/Button'
import { Pagination } from 'shared/Pagination'
import { ConfirmDialog } from 'shared/ConfirmDialog'
import { Skeleton } from 'shared/Skeleton'
import { TodoTable } from '../components/TodoTable'
import { TodoFilters } from '../components/TodoFilters'
import { CreateTodoModal } from '../components/CreateTodoModal'
import { EditTodoModal } from '../components/EditTodoModal'
import '../index.css'

export const TodoListPage = () => {
  const { t } = useTranslation()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const deleteMutation = useDeleteTodo()

  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [completed, setCompleted] = useState<boolean | undefined>()
  const [createOpen, setCreateOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const { data, isLoading, isError, error, refetch } = useTodos({
    pageNumber: page,
    pageSize,
    search: search || undefined,
    completed,
  })

  if (authLoading) return <Spinner />
  if (!isAuthenticated) {
    navigate('/login', { replace: true })
    return null
  }

  if (isError) {
    return <ErrorState title={t('common.error')} message={(error as Error)?.message} onRetry={refetch} />
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync(deleteTarget)
      toast.success(t('todo.delete_success'))
      setDeleteTarget(null)
    } catch (err) {
      const e = err as { displayMessage?: string }
      toast.error(e.displayMessage || t('todo.delete_failed'))
    }
  }

  return (
    <div className="todo-p-6 todo-max-w-6xl todo-mx-auto">
      <div className="todo-flex todo-justify-between todo-items-center todo-mb-6">
        <h1 className="todo-text-2xl todo-font-bold">{t('todo.page_title')}</h1>
        <Button onClick={() => setCreateOpen(true)}>{t('common.add')}</Button>
      </div>

      <TodoFilters search={search} onSearchChange={setSearch} completed={completed} onCompletedChange={setCompleted} />

      {isLoading ? (
        <Skeleton variant="rect" className="todo-h-64" />
      ) : data && data.todos.length > 0 ? (
        <>
          <TodoTable
            todos={data.todos}
            onEdit={(id) => setEditingTodo(id)}
            onDelete={(id) => setDeleteTarget(id)}
          />
          <Pagination
            page={data.meta.page}
            limit={data.meta.limit}
            total={data.meta.total}
            totalPages={data.meta.total_pages}
            onPageChange={setPage}
          />
        </>
      ) : (
        <EmptyState
          title={t('todo.empty_title')}
          description={search ? t('todo.empty_search') : t('todo.empty_create_hint')}
          action={search ? undefined : { label: t('todo.create'), onClick: () => setCreateOpen(true) }}
        />
      )}

      <CreateTodoModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditTodoModal todoId={editingTodo} onClose={() => setEditingTodo(null)} />
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title={t('todo.delete_title')}
        message={t('todo.delete_confirm')}
        confirmLabel={t('common.delete')}
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
export default TodoListPage
