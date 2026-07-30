import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useAuth } from '@/contexts/AuthContext'
import { Spinner } from './Spinner'
import '../index.css'

interface ProtectedRouteProps {
  children: ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="sh-flex sh-items-center sh-justify-center sh-min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
