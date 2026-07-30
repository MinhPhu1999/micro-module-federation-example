import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { EmptyState } from 'shared/EmptyState'

export const NotFound = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <EmptyState
      title={t('not_found.title')}
      description={t('not_found.description')}
      action={{ label: t('not_found.back_home'), onClick: () => navigate('/') }}
    />
  )
}
