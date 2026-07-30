import { Component, type ReactNode, type ErrorInfo } from 'react'
import { withTranslation } from 'react-i18next'
import type { WithTranslation } from 'react-i18next'
import { ErrorState } from 'shared/ErrorState'

interface Props extends WithTranslation {
  children: ReactNode
  fallback?: ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundaryBase extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    this.props.onReset?.()
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <ErrorState
          title={this.props.t('error.title')}
          message={this.state.error?.message || this.props.t('error.retry')}
          onRetry={this.handleReset}
        />
      )
    }
    return this.props.children
  }
}

export const ErrorBoundary = withTranslation()(ErrorBoundaryBase)
