import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { useAuth } from 'shared/AuthContext'
import { useTodos } from 'shared/useTodos'
import { useTodosStats } from 'shared/useTodosStats'
import { useDeleteTodo } from 'shared/useDeleteTodo'
import { useRestoreTodo } from 'shared/useRestoreTodo'
import { useBulkDeleteTodos } from 'shared/useBulkDeleteTodos'
import { useToast } from 'shared/ToastContext'
import { Spinner } from 'shared/Spinner'
import { EmptyState } from 'shared/EmptyState'
import { ErrorState } from 'shared/ErrorState'
import { Button } from 'shared/Button'
import { Checkbox } from 'shared/Checkbox'
import { Select } from 'shared/Select'
import { Pagination } from 'shared/Pagination'
import { ConfirmDialog } from 'shared/ConfirmDialog'
import { Skeleton } from 'shared/Skeleton'
import { TodoTable } from '../components/TodoTable'
import { TodoFilters, type TodoFiltersState } from '../components/TodoFilters'
import { TodoFormModal } from '../components/TodoFormModal'
import type { TodoSortBy } from 'shared/types'
import '../index.css'

const DEFAULT_FILTERS: TodoFiltersState = {
  search: '',
  completed: undefined,
  priority: undefined,
  tags: '',
  dueFrom: '',
  dueTo: '',
  sortBy: undefined,
  sortOrder: 'asc',
  includeDeleted: false,
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50]

const StatItem = ({ label, value }: { label: string; value: string | number }) => (
  <div className="todo-rounded-lg todo-border todo-p-3 todo-text-center">
    <div className="todo-text-lg todo-font-semibold">{value}</div>
    <div className="todo-text-xs todo-text-gray-500">{label}</div>
  </div>
)

export const TodoListPage = () => {
  const { t } = useTranslation()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const deleteMutation = useDeleteTodo()
  const restoreMutation = useRestoreTodo()
  const bulkDeleteMutation = useBulkDeleteTodos()

  const [filters, setFilters] = useState<TodoFiltersState>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [createOpen, setCreateOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)

  const { data, isLoading, isError, error, refetch } = useTodos({
    pageNumber: page,
    pageSize,
    search: filters.search || undefined,
    completed: filters.completed,
    priority: filters.priority,
    tags: filters.tags || undefined,
    dueFrom: filters.dueFrom || undefined,
    dueTo: filters.dueTo || undefined,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    includeDeleted: filters.includeDeleted,
  })

  const { data: stats } = useTodosStats()

  const handleFiltersChange = useCallback((patch: Partial<TodoFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...patch }))
  }, [])

  useEffect(() => {
    setPage(1)
    setSelectedIds([])
  }, [filters])

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value))
    setPage(1)
  }

  if (authLoading) return <Spinner />
  if (!isAuthenticated) {
    navigate('/login', { replace: true })
    return null
  }

  if (isError) {
    return <ErrorState title={t('common.error')} message={(error as Error)?.message} onRetry={refetch} />
  }

  const allSelected = !!data && data.todos.length > 0 && data.todos.every((todo) => selectedIds.includes(todo.id))

  const handleToggleSelectAll = () => {
    if (!data) return
    setSelectedIds(allSelected ? [] : data.todos.map((todo) => todo.id))
  }

  const handleSort = (key: string) => {
    if (filters.sortBy === key) {
      handleFiltersChange({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })
    } else {
      handleFiltersChange({ sortBy: key as TodoSortBy, sortOrder: 'asc' })
    }
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

  const handleRestore = async (id: string) => {
    try {
      await restoreMutation.mutateAsync(id)
      toast.success(t('todo.restore_success'))
    } catch (err) {
      const e = err as { displayMessage?: string }
      toast.error(e.displayMessage || t('todo.restore_failed'))
    }
  }

  const handleBulkDelete = async () => {
    try {
      await bulkDeleteMutation.mutateAsync({ ids: selectedIds })
      toast.success(t('todo.bulk_delete_success'))
      setSelectedIds([])
      setBulkDeleteOpen(false)
    } catch (err) {
      const e = err as { displayMessage?: string }
      toast.error(e.displayMessage || t('todo.bulk_delete_failed'))
    }
  }

  return (
    <div className="todo-p-6 todo-max-w-6xl todo-mx-auto">
      <div className="todo-flex todo-justify-between todo-items-center todo-mb-6">
        <h1 className="todo-text-2xl todo-font-bold">{t('todo.page_title')}</h1>
        <Button onClick={() => setCreateOpen(true)}>{t('common.add')}</Button>
      </div>

      {stats && (
        <div className="todo-grid todo-grid-cols-2 md:todo-grid-cols-5 todo-gap-3 todo-mb-6">
          <StatItem label={t('todo.stats_total')} value={stats.total} />
          <StatItem label={t('todo.stats_completed')} value={stats.completed} />
          <StatItem label={t('todo.stats_pending')} value={stats.pending} />
          <StatItem label={t('todo.stats_overdue')} value={stats.overdue} />
          <StatItem label={t('todo.stats_completion_rate')} value={`${stats.completion_rate}%`} />
        </div>
      )}

      <TodoFilters filters={filters} onFiltersChange={handleFiltersChange} />

      {isLoading ? (
        <Skeleton variant="rect" className="todo-h-64" />
      ) : data && data.todos.length > 0 ? (
        <>
          <div className="todo-flex todo-items-center todo-gap-3 todo-mb-3">
            <Checkbox label={t('todo.select_all')} checked={allSelected} onChange={handleToggleSelectAll} />
            {selectedIds.length > 0 && (
              <Button size="sm" variant="danger" onClick={() => setBulkDeleteOpen(true)}>
                {t('todo.delete_selected')} ({selectedIds.length})
              </Button>
            )}
          </div>
          <TodoTable
            todos={data.todos}
            selectedIds={selectedIds}
            onToggleSelect={(id) =>
              setSelectedIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
            }
            onEdit={(id) => setEditingTodo(id)}
            onDelete={(id) => setDeleteTarget(id)}
            onRestore={handleRestore}
            onSort={handleSort}
            sortKey={filters.sortBy}
            sortDir={filters.sortOrder}
          />
          <div className="todo-flex todo-justify-between todo-items-center todo-gap-4 todo-mt-4">
            <Pagination
              page={data.meta.page}
              limit={data.meta.limit}
              total={data.meta.total}
              totalPages={data.meta.total_pages}
              onPageChange={setPage}
            />
            <div className="todo-flex todo-items-center todo-gap-2 todo-shrink-0">
              <span className="todo-text-sm todo-text-gray-500 todo-whitespace-nowrap">{t('todo.page_size')}</span>
              <div className="todo-w-24">
                <Select
                  value={String(pageSize)}
                  onChange={(e) => handlePageSizeChange(e.target.value)}
                  options={PAGE_SIZE_OPTIONS.map((size) => ({ value: String(size), label: String(size) }))}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <EmptyState
          title={t('todo.empty_title')}
          description={filters.search ? t('todo.empty_search') : t('todo.empty_create_hint')}
          action={filters.search ? undefined : { label: t('todo.create'), onClick: () => setCreateOpen(true) }}
        />
      )}

      <TodoFormModal mode="create" open={createOpen} onClose={() => setCreateOpen(false)} />
      <TodoFormModal mode="edit" open={!!editingTodo} todoId={editingTodo} onClose={() => setEditingTodo(null)} />
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title={t('todo.delete_title')}
        message={t('todo.delete_confirm')}
        confirmLabel={t('common.delete')}
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <ConfirmDialog
        isOpen={bulkDeleteOpen}
        title={t('todo.bulk_delete_title')}
        message={t('todo.bulk_delete_confirm', { count: selectedIds.length })}
        confirmLabel={t('common.delete')}
        variant="danger"
        onConfirm={handleBulkDelete}
        onCancel={() => setBulkDeleteOpen(false)}
      />
    </div>
  )
}
export default TodoListPage
