import { useState, useRef, useEffect, type ReactNode } from 'react'
import { Button } from './Button'
import '../index.css'

interface DropdownItem {
  value: string
  label: string
  icon?: ReactNode
}

interface DropdownProps {
  trigger: ReactNode
  items: DropdownItem[]
  onSelect: (value: string) => void
  align?: 'left' | 'right'
}

export const Dropdown = ({ trigger, items, onSelect, align = 'left' }: DropdownProps) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="sh-relative sh-inline-block">
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={`sh-absolute sh-z-50 sh-mt-1 sh-min-w-[160px] sh-bg-white dark:sh-bg-gray-800 sh-rounded-md sh-shadow-lg sh-border sh-border-gray-200 dark:sh-border-gray-700 sh-py-1 ${
            align === 'right' ? 'sh-right-0' : 'sh-left-0'
          }`}
        >
          {items.map((item) => (
            <Button
              key={item.value}
              variant="ghost"
              size="sm"
              className="sh-w-full sh-justify-between sh-rounded-none"
              onClick={() => { onSelect(item.value); setOpen(false) }}
            >
              {item.icon && <span className="sh-mr-2">{item.icon}</span>}
              {item.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
