import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Spinner } from 'shared/Spinner'
import { AuthProvider, useAuth } from 'shared/AuthContext'
import { ToastProvider } from 'shared/ToastContext'
import { Toast } from 'shared/Toast'
import { I18nProvider } from 'shared/I18nContext'
import { TodoListPage } from './pages/TodoList'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000, refetchOnWindowFocus: false },
  },
})

function ProtectedTodoPage() {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <Spinner />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <TodoListPage />
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <I18nProvider>
          <AuthProvider>
            <ToastProvider>
              <Routes>
                <Route path="/todos" element={<ProtectedTodoPage />} />
                <Route path="*" element={<Navigate to="/todos" replace />} />
              </Routes>
              <Toast />
            </ToastProvider>
          </AuthProvider>
        </I18nProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
export default App
