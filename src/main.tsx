import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LogRocket from 'logrocket'
import { AuthProvider } from "./context/AuthProvider.tsx";
import App from './App.tsx'
import './styles/index.css'

if (import.meta.env.PROD) {
  LogRocket.init(import.meta.env.VITE_LOGROCKET_ID)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App/>
    </AuthProvider>
  </StrictMode>,
)
