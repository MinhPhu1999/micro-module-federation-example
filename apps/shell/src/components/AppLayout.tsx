import { lazy, Suspense } from 'react'
import { Outlet } from 'react-router'
import { Spinner } from 'shared/Spinner'
import { ErrorBoundary } from './ErrorBoundary'

const Navbar = lazy(() => import('navbar/Navbar'))

export const AppLayout = () => (
  <ErrorBoundary>
    <Suspense fallback={<Spinner />}>
      <Navbar />
    </Suspense>
    <main className="dark:bg-gray-800 dark:text-gray-100">
      <ErrorBoundary>
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </main>
  </ErrorBoundary>
)
