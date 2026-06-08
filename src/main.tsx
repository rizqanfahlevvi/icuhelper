import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

/* Reuse the existing design system + component CSS so the SPA is
   visually identical to the legacy MPA. */
import '../assets/css/icu-framework.css'
import '../assets/css/styles.css'
import './styles/app.css'

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element #root not found')

createRoot(rootEl).render(
  <StrictMode>
    <BrowserRouter basename="/app">
      <App />
    </BrowserRouter>
  </StrictMode>,
)
