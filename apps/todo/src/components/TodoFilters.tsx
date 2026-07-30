import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDebounce } from 'shared/useDebounce'
import { Input } from 'shared/Input'
import { Select } from 'shared/Select'

interface TodoFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  completed: boolean | undefined
  onCompletedChange: (value: boolean | undefined) => void
}

export const TodoFilters = ({ search, onSearchChange, completed, onCompletedChange }: TodoFiltersProps) => {
  const { t } = useTranslation()
  const [localSearch, setLocalSearch] = useState(search)
  const debouncedSearch = useDebounce(localSearch, 300)

  useEffect(() => {
    onSearchChange(debouncedSearch)
  }, [debouncedSearch, onSearchChange])

  const statusOptions = [
    { value: 'all', label: t('todo.filter_all') },
    { value: 'false', label: t('todo.filter_incomplete') },
    { value: 'true', label: t('todo.filter_completed') },
  ]

  return (
    <div className="todo-flex todo-gap-4 todo-mb-4">
      <Input
        placeholder={t('todo.search_placeholder')}
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        className="todo-flex-1"
      />
      <Select
        value={completed === undefined ? 'all' : String(completed)}
        onChange={(e) => {
          const val = e.target.value
          onCompletedChange(val === 'all' ? undefined : val === 'true')
        }}
        options={statusOptions}
      />
    </div>
  )
}
