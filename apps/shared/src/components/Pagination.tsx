import { Button } from './Button'
import '../index.css'

interface PaginationProps {
  page: number
  limit: number
  total: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const Pagination = ({ page, limit: _limit, total: _total, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null

  const pages: (number | string)[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <div className="sh-flex sh-items-center sh-justify-between sh-px-4 sh-py-3 sh-border-t sh-border-gray-200 dark:sh-border-gray-700">
      <div className="sh-text-sm sh-text-gray-500">
        {`${page} / ${totalPages} pages`}
      </div>
      <div className="sh-flex sh-items-center sh-gap-1">
        <Button
          variant="ghost"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Prev
        </Button>
        {pages.map((p, i) =>
          typeof p === 'number' ? (
            <Button
              key={i}
              variant={p === page ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onPageChange(p)}
            >
              {p}
            </Button>
          ) : (
            <span key={i} className="sh-px-2 sh-text-gray-400">...</span>
          ),
        )}
        <Button
          variant="ghost"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
