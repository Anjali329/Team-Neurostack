import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode> Removed strict mode for the demo to prevent double API fetches 
    <App />
  // </StrictMode>,
)
