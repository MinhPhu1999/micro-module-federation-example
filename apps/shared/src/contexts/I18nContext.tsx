import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import i18n, { LANG_KEY } from "@micro-fe/shared/i18n"

interface I18nContextValue {
  locale: string
  setLocale: (locale: string) => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState(i18n.language)

  const setLocale = useCallback((lang: string) => {
    i18n.changeLanguage(lang)
    localStorage.setItem(LANG_KEY, lang)
    setLocaleState(lang)
  }, [])

  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  const { t } = useTranslation()
  return { ...ctx, t }
}
