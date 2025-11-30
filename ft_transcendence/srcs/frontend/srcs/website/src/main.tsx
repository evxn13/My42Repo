import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './styles/animations.css';

createRoot(document.getElementById('root')!).render(
	// StrictMode loads pages twice
	// <StrictMode>
	<App />
	// </StrictMode>,
)
