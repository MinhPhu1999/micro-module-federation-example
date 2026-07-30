import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { authApi } from 'shared/authApi'
import { useAuth } from 'shared/AuthContext'
import { useToast } from 'shared/ToastContext'
import { Spinner } from 'shared/Spinner'

export const GoogleCallback = () => {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()
  const toast = useToast()
  const { t } = useTranslation()

  useEffect(() => {
    const state = params.get('state')
    const code = params.get('code')
    if (!state || !code) {
      toast.error(t('auth.google_failed'))
      navigate('/login', { replace: true })
      return
    }

    authApi.googleCallback({ state, code })
      .then(({ data }) => {
        login(data.data)
        toast.success(t('auth.login_success'))
        navigate('/todos', { replace: true })
      })
      .catch((err) => {
        const e = err as { displayMessage?: string }
        toast.error(e.displayMessage || t('auth.google_failed'))
        navigate('/login', { replace: true })
      })
  }, [params, login, navigate, toast, t])

  return <Spinner />
}
