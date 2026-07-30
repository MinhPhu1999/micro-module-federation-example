import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'shared/Button'

interface UserMenuProps {
  user: { name?: string; email?: string; picture?: string } | null
  onLogout: () => void
}

export const UserMenu = ({ user, onLogout }: UserMenuProps) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="navbar-relative">
      <Button variant="ghost" onClick={() => setOpen(!open)} className="navbar-flex navbar-items-center navbar-gap-2">
        {user?.picture ? (
          <img src={user.picture} alt="" className="navbar-w-8 navbar-h-8 navbar-rounded-full" />
        ) : (
          <div className="navbar-w-8 navbar-h-8 navbar-rounded-full navbar-bg-blue-500 navbar-flex navbar-items-center navbar-justify-center navbar-text-white navbar-text-sm">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        )}
        <span className="navbar-text-sm navbar-text-gray-700 dark:navbar-text-gray-300">{user?.name || user?.email}</span>
      </Button>

      {open && (
        <div className="navbar-absolute navbar-right-0 navbar-mt-2 navbar-w-48 navbar-bg-white dark:navbar-bg-gray-800 navbar-rounded-md navbar-shadow-lg navbar-border dark:navbar-border-gray-700 navbar-z-50">
          <div className="navbar-px-4 navbar-py-2 navbar-border-b dark:navbar-border-gray-700">
            <p className="navbar-text-sm navbar-font-medium dark:navbar-text-gray-100">{user?.name}</p>
            <p className="navbar-text-xs navbar-text-gray-500 dark:navbar-text-gray-400">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            className="navbar-w-full navbar-text-left"
            onClick={onLogout}
          >
            {t('auth.logout')}
          </Button>
        </div>
      )}
    </div>
  )
}
