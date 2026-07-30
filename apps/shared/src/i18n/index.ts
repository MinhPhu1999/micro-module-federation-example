import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const LANG_KEY = 'lang'

const localeModules = import.meta.glob('./*.json', { eager: true }) as Record<string, { default: Record<string, unknown> }>

const resources: Record<string, { translation: Record<string, unknown> }> = {}

for (const path in localeModules) {
  const filename = path.replace(/^.*[\\/]/, '').replace(/\.json$/, '')
  if (/^[a-z]{2}(?:-[A-Z]{2})?$/.test(filename)) {
    resources[filename] = { translation: localeModules[path].default }
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem(LANG_KEY) || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
export { LANG_KEY }
