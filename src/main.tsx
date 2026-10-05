import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './styles/index.css'

// La posición al volver con "atrás" la maneja la app (ver pages/HomePage).
if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
