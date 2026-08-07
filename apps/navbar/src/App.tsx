import { BrowserRouter } from 'react-router'
import { AuthProvider } from '@micro-fe/shared/AuthContext'
import { ThemeProvider } from '@micro-fe/shared/ThemeContext'
import { I18nProvider } from '@micro-fe/shared/I18nContext'
import { Navbar } from './components/Navbar'

function App() {
  return (
    <BrowserRouter>
      <I18nProvider>
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            <div className="navbar-p-4">Navbar standalone — tích hợp với Shell để có đầy đủ routing</div>
          </ThemeProvider>
        </AuthProvider>
      </I18nProvider>
    </BrowserRouter>
  )
}
export default App
