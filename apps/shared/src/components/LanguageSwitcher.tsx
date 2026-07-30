import { useI18n } from '@/contexts/I18nContext'
import { Button } from './Button'
import { Dropdown } from './Dropdown'
import '../index.css'

export const LanguageSwitcher = () => {
  const { locale, setLocale, t } = useI18n()

  const items = [
    { value: 'en', label: 'English', icon: '🇺🇸' },
    { value: 'vi', label: 'Tiếng Việt', icon: '🇻🇳' },
  ]

  const current = items.find((item) => item.value === locale) || items[0]

  return (
    <Dropdown
      trigger={
        <Button variant="ghost" size="sm">
          <span className="sh-mr-1">{current.icon}</span>
          {current.value.toUpperCase()}
        </Button>
      }
      items={items}
      onSelect={setLocale}
      align="right"
    />
  )
}
