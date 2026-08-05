import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDebounce } from 'shared/useDebounce'
import { Input } from 'shared/Input'
import { Select } from 'shared/Select'
import { Checkbox } from 'shared/Checkbox'
import type { TodoPriority, TodoSortBy, TodoSortOrder } from 'shared/types'

export interface TodoFiltersState {
  search: string
  completed: boolean | undefined
  priority: TodoPriority | undefined
  tags: string
  dueFrom: string
  dueTo: string
  sortBy: TodoSortBy | undefined
  sortOrder: TodoSortOrder
  includeDeleted: boolean
}

interface TodoFiltersProps {
  filters: TodoFiltersState
  onFiltersChange: (patch: Partial<TodoFiltersState>) => void
}

export const TodoFilters = ({ filters, onFiltersChange }: TodoFiltersProps) => {
  const { t } = useTranslation()
  const [localSearch, setLocalSearch] = useState(filters.search)
  const [localTags, setLocalTags] = useState(filters.tags)
  const debouncedSearch = useDebounce(localSearch, 300)
  const debouncedTags = useDebounce(localTags, 300)

  useEffect(() => {
    onFiltersChange({ search: debouncedSearch })
  }, [debouncedSearch, onFiltersChange])

  useEffect(() => {
    onFiltersChange({ tags: debouncedTags })
  }, [debouncedTags, onFiltersChange])

  const statusOptions = [
    { value: 'all', label: t('todo.filter_all') },
    { value: 'false', label: t('todo.filter_incomplete') },
    { value: 'true', label: t('todo.filter_completed') },
  ]

  const priorityOptions = [
    { value: 'all', label: t('todo.filter_priority_all') },
    { value: 'low', label: t('todo.priority_low') },
    { value: 'medium', label: t('todo.priority_medium') },
    { value: 'high', label: t('todo.priority_high') },
  ]

  const sortByOptions = [
    { value: 'default', label: t('todo.sort_default') },
    { value: 'created_at', label: t('todo.sort_created_at') },
    { value: 'due_at', label: t('todo.sort_due_at') },
    { value: 'priority', label: t('todo.sort_priority') },
    { value: 'title', label: t('todo.sort_title') },
  ]

  const sortOrderOptions = [
    { value: 'asc', label: t('todo.sort_asc') },
    { value: 'desc', label: t('todo.sort_desc') },
  ]

  return (
    <div className="todo-rounded-lg todo-border todo-border-gray-200 dark:todo-border-gray-700 todo-bg-white dark:todo-bg-gray-900 todo-p-4 todo-space-y-3 todo-mb-6">
      <div className="todo-grid todo-grid-cols-1 md:todo-grid-cols-5 todo-gap-3">
        <div className="md:todo-col-span-2">
          <Input
            label={t('common.search')}
            placeholder={t('todo.search_placeholder')}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
        <Select
          label={t('todo.status')}
          value={filters.completed === undefined ? 'all' : String(filters.completed)}
          onChange={(e) => {
            const val = e.target.value
            onFiltersChange({ completed: val === 'all' ? undefined : val === 'true' })
          }}
          options={statusOptions}
        />
        <Select
          label={t('todo.priority')}
          value={filters.priority ?? 'all'}
          onChange={(e) => {
            const val = e.target.value
            onFiltersChange({ priority: val === 'all' ? undefined : (val as TodoPriority) })
          }}
          options={priorityOptions}
        />
        <Input
          label={t('todo.tags')}
          placeholder={t('todo.tags_placeholder')}
          value={localTags}
          onChange={(e) => setLocalTags(e.target.value)}
        />
      </div>
      <div className="todo-grid todo-grid-cols-1 md:todo-grid-cols-5 todo-gap-3">
        <Select
          label={t('todo.sort_by')}
          value={filters.sortBy ?? 'default'}
          onChange={(e) => {
            const val = e.target.value
            onFiltersChange({ sortBy: val === 'default' ? undefined : (val as TodoSortBy) })
          }}
          options={sortByOptions}
        />
        <Select
          label={t('todo.sort_order')}
          value={filters.sortOrder}
          onChange={(e) => onFiltersChange({ sortOrder: e.target.value as TodoSortOrder })}
          options={sortOrderOptions}
        />
        <Input
          type="date"
          label={t('todo.due_from')}
          value={filters.dueFrom}
          onChange={(e) => onFiltersChange({ dueFrom: e.target.value })}
        />
        <Input
          type="date"
          label={t('todo.due_to')}
          value={filters.dueTo}
          onChange={(e) => onFiltersChange({ dueTo: e.target.value })}
        />
        <div className="todo-flex todo-items-end">
          <Checkbox
            label={t('todo.show_deleted')}
            checked={filters.includeDeleted}
            onChange={() => onFiltersChange({ includeDeleted: !filters.includeDeleted })}
          />
        </div>
      </div>
    </div>
  )
}
