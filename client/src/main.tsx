import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LoginForm from './components/login/login'
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoginForm />
  </StrictMode>,
)
