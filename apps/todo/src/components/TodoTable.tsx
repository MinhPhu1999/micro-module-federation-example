import { useTranslation } from 'react-i18next'
import { Table, type Column } from 'shared/Table'
import { Button } from 'shared/Button'
import { Checkbox } from 'shared/Checkbox'
import { formatDate } from 'shared/formatDate'
import type { Todo, TodoPriority, TodoSortBy, TodoSortOrder } from 'shared/types'

interface TodoTableProps {
  todos: Todo[]
  selectedIds: string[]
  onToggleSelect: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onRestore: (id: string) => void
  onSort: (key: string) => void
  sortKey?: TodoSortBy
  sortDir?: TodoSortOrder
}

const priorityStyles: Record<TodoPriority, string> = {
  low: 'todo-bg-blue-100 todo-text-blue-800',
  medium: 'todo-bg-yellow-100 todo-text-yellow-800',
  high: 'todo-bg-red-100 todo-text-red-800',
}

export const TodoTable = ({
  todos,
  selectedIds,
  onToggleSelect,
  onEdit,
  onDelete,
  onRestore,
  onSort,
  sortKey,
  sortDir,
}: TodoTableProps) => {
  const { t } = useTranslation()

  const columns: Column<Todo>[] = [
    {
      key: 'select',
      header: '',
      width: '48px',
      render: (todo: Todo) => (
        <div className="todo-flex todo-justify-center">
          <Checkbox
            aria-label={t('todo.select_all')}
            checked={selectedIds.includes(todo.id)}
            onChange={() => onToggleSelect(todo.id)}
          />
        </div>
      ),
    },
    { key: 'title', header: t('todo.title'), sortable: true },
    {
      key: 'priority',
      header: t('todo.priority'),
      sortable: true,
      render: (todo: Todo) => (
        <span className={`todo-px-2 todo-py-1 todo-rounded todo-text-xs ${priorityStyles[todo.priority] ?? 'todo-bg-gray-100'}`}>
          {t(`todo.priority_${todo.priority}`)}
        </span>
      ),
    },
    {
      key: 'tags',
      header: t('todo.tags'),
      render: (todo: Todo) =>
        todo.tags.length > 0 ? (
          <div className="todo-flex todo-flex-wrap todo-gap-1">
            {todo.tags.map((tag) => (
              <span key={tag} className="todo-px-1.5 todo-py-0.5 todo-rounded todo-text-xs todo-bg-gray-100 todo-text-gray-600">
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <span className="todo-text-gray-400">—</span>
        ),
    },
    {
      key: 'due_at',
      header: t('todo.due_at'),
      sortable: true,
      render: (todo: Todo) => {
        if (!todo.due_at) return <span className="todo-text-gray-400">—</span>
        const isOverdue = !todo.completed && new Date(todo.due_at).getTime() < Date.now()
        return (
          <span className={isOverdue ? 'todo-text-red-600 todo-font-medium' : ''}>
            {formatDate(todo.due_at)}
          </span>
        )
      },
    },
    {
      key: 'completed',
      header: t('todo.status'),
      render: (todo: Todo) => (
        <span className={`todo-px-2 todo-py-1 todo-rounded todo-text-xs ${
          todo.completed ? 'todo-bg-green-100 todo-text-green-800' : 'todo-bg-yellow-100 todo-text-yellow-800'
        }`}>
          {todo.completed ? t('todo.completed') : t('todo.incomplete')}
        </span>
      ),
    },
    {
      key: 'created_at',
      header: t('todo.created_at'),
      sortable: true,
      render: (todo: Todo) => formatDate(todo.created_at),
    },
    {
      key: 'actions',
      header: t('todo.actions'),
      render: (todo: Todo) => (
        <div className="todo-flex todo-gap-2 todo-justify-center">
          {todo.deleted_at ? (
            <Button size="sm" variant="secondary" onClick={() => onRestore(todo.id)}>{t('todo.restore')}</Button>
          ) : (
            <>
              <Button size="sm" variant="secondary" onClick={() => onEdit(todo.id)}>{t('common.edit')}</Button>
              <Button size="sm" variant="danger" onClick={() => onDelete(todo.id)}>{t('common.delete')}</Button>
            </>
          )}
        </div>
      ),
    },
  ]

  return <Table<Todo> columns={columns} data={todos} onSort={onSort} sortKey={sortKey} sortDir={sortDir} />
}
