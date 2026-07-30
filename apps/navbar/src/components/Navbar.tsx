import { useAuth } from 'shared/AuthContext'
import { useTheme } from 'shared/ThemeContext'
import { Button } from 'shared/Button'
import { LanguageSwitcher } from 'shared/LanguageSwitcher'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MobileMenu } from './MobileMenu'
import { UserMenu } from './UserMenu'
import '../index.css'

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="navbar-bg-white dark:navbar-bg-gray-900 navbar-shadow navbar-h-16 navbar-flex navbar-items-center navbar-px-6 navbar-border-b dark:navbar-border-gray-700">
      <div className="navbar-flex navbar-items-center navbar-gap-2 navbar-cursor-pointer" onClick={() => navigate('/')}>
        <span className="navbar-text-xl navbar-font-bold navbar-text-blue-600">MicroFE</span>
      </div>

      <div className="navbar-flex-1" />

      <div className="navbar-hidden md:navbar-flex navbar-items-center navbar-gap-4">
        {isAuthenticated ? (
          <>
            <span
              className="navbar-cursor-pointer navbar-text-gray-700 dark:navbar-text-gray-300 hover:navbar-text-blue-600"
              onClick={() => navigate('/todos')}
            >
              {t('nav.work')}
            </span>
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </Button>
            <UserMenu user={user} onLogout={handleLogout} />
          </>
        ) : (
          <>
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </Button>
            <Button size="sm" onClick={() => navigate('/login')}>{t('auth.login')}</Button>
          </>
        )}
      </div>

      <Button variant="ghost" size="sm" className="md:navbar-hidden" onClick={() => setMobileOpen(!mobileOpen)}>
        ☰
      </Button>

      {mobileOpen && (
        <MobileMenu
          isAuthenticated={isAuthenticated}
          user={user}
          onNavigate={(path) => { navigate(path); setMobileOpen(false) }}
          onLogout={handleLogout}
        />
      )}
    </nav>
  )
}

export default Navbar
