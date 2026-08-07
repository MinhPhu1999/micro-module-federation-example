import type { ReactNode } from 'react'
import { Skeleton } from '@micro-fe/shared/Skeleton'
import '../index.css'

export interface Column<T> {
  key: string
  header: string
  render?: (row: T) => ReactNode
  sortable?: boolean
  width?: string
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  onSort?: (key: string) => void
  sortKey?: string
  sortDir?: 'asc' | 'desc'
  isLoading?: boolean
}

export function Table<T extends object>({
  columns,
  data,
  onSort,
  sortKey,
  sortDir,
  isLoading,
}: TableProps<T>) {
  return (
    <div className="sh-overflow-x-auto">
      <table className="sh-w-full sh-text-sm">
        <thead>
          <tr className="sh-border-b sh-border-gray-200 dark:sh-border-gray-700">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`sh-px-4 sh-py-3 sh-text-left sh-font-medium sh-text-gray-500 dark:sh-text-gray-400 ${
                  col.sortable ? 'sh-cursor-pointer hover:sh-text-gray-700 dark:hover:sh-text-gray-200' : ''
                }`}
                style={col.width ? { width: col.width } : undefined}
                onClick={() => col.sortable && onSort?.(col.key)}
              >
                <span className="sh-inline-flex sh-items-center sh-gap-1">
                  {col.header}
                  {col.sortable && sortKey === col.key && (
                    <span>{sortDir === 'asc' ? '↑' : '↓'}</span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="sh-border-b sh-border-gray-100 dark:sh-border-gray-800">
                {columns.map((col) => (
                  <td key={col.key} className="sh-px-4 sh-py-3">
                    <Skeleton width="80%" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="sh-px-4 sh-py-8 sh-text-center sh-text-gray-500">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={(row as Record<string, unknown>).id as string || i}
                className={`sh-border-b sh-border-gray-100 dark:sh-border-gray-800 ${
                  i % 2 === 0 ? 'sh-bg-white dark:sh-bg-gray-800' : 'sh-bg-gray-50 dark:sh-bg-gray-900'
                }`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="sh-px-4 sh-py-3 sh-text-gray-700 dark:sh-text-gray-300">
                    {col.render ? col.render(row) : ((row as Record<string, unknown>)[col.key] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
