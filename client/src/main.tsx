import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SuperAdmin from './pages/SuperAdmin';
import Settings from './pages/Settings';
import Inventory from './pages/Inventory';
import Billing from './pages/Billing';
import DashboardLayout from './components/DashboardLayout';
import Parties from './pages/Parties';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/parties" element={<Parties />} />
        <Route path="/super-admin" element={<SuperAdmin />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/billing" element={<Billing />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
