// Libraries
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Context
import { AuthProvider } from "./context/AuthProvider.tsx";

// Components
import App from './App.tsx'

// Styles
import './styles/index.css'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App/>
    </AuthProvider>
  </StrictMode>,
)
