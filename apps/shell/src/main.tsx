import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import '@micro-fe/shared/style.css'

window.addEventListener('error', (e) => { console.error('Global error:', e.error) })
window.addEventListener('unhandledrejection', (e) => { console.error('Unhandled rejection:', e.reason) })

import('./bootstrap').then(({ default: App }) => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})
