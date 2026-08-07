import { useTranslation } from 'react-i18next'
import { Button } from '@micro-fe/shared/Button'
import { LanguageSwitcher } from '@micro-fe/shared/LanguageSwitcher'

interface MobileMenuProps {
  isAuthenticated: boolean
  user: { name?: string; email?: string; picture?: string } | null
  onNavigate: (path: string) => void
  onLogout: () => void
}

export const MobileMenu = ({ isAuthenticated, user, onNavigate, onLogout }: MobileMenuProps) => {
  const { t } = useTranslation()
  return (
    <div className="md:navbar-hidden navbar-absolute navbar-top-16 navbar-left-0 navbar-right-0 navbar-bg-white dark:navbar-bg-gray-900 navbar-shadow-lg navbar-border-t dark:navbar-border-gray-700 navbar-z-50">
      <div className="navbar-px-4 navbar-py-3 navbar-space-y-2">
        {isAuthenticated ? (
          <>
            <div className="navbar-flex navbar-items-center navbar-gap-3 navbar-py-2">
              {user?.picture && <img src={user.picture} alt="" className="navbar-w-10 navbar-h-10 navbar-rounded-full" />}
              <div>
                <p className="navbar-font-medium">{user?.name || user?.email}</p>
                <p className="navbar-text-sm navbar-text-gray-500 dark:navbar-text-gray-400">{user?.email}</p>
              </div>
            </div>
            <Button variant="ghost" className="navbar-w-full navbar-text-left" onClick={() => onNavigate('/todos')}>{t('nav.work')}</Button>
            <div className="navbar-pt-2"><LanguageSwitcher /></div>
            <Button variant="ghost" className="navbar-w-full navbar-text-left" onClick={onLogout}>{t('auth.logout')}</Button>
          </>
        ) : (
          <>
            <Button variant="ghost" className="navbar-w-full" onClick={() => onNavigate('/login')}>{t('auth.login')}</Button>
            <div className="navbar-pt-2"><LanguageSwitcher /></div>
          </>
        )}
      </div>
    </div>
  )
}
