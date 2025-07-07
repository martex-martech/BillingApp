import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import LoginForm from './components/login/login'
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')!).render(
<BrowserRouter>
  <LoginForm />
</BrowserRouter>,
)
