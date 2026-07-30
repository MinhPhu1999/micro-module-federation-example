import { useTranslation } from 'react-i18next'
import { Table } from 'shared/Table'
import { Button } from 'shared/Button'
import { formatDate } from 'shared/formatDate'
import type { Todo } from 'shared/types'

interface TodoTableProps {
  todos: Todo[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export const TodoTable = ({ todos, onEdit, onDelete }: TodoTableProps) => {
  const { t } = useTranslation()

  const columns = [
    { key: 'title', header: t('todo.title') },
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
      render: (todo: Todo) => formatDate(todo.created_at),
    },
    {
      key: 'actions',
      header: t('todo.actions'),
      render: (todo: Todo) => (
        <div className="todo-flex todo-gap-2">
          <Button size="sm" variant="secondary" onClick={() => onEdit(todo.id)}>{t('common.edit')}</Button>
          <Button size="sm" variant="danger" onClick={() => onDelete(todo.id)}>{t('common.delete')}</Button>
        </div>
      ),
    },
  ]

  return <Table columns={columns} data={todos} />
}
