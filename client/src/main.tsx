import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/admin/Admindashboard';
import Settings from './pages/admin/Settings';
import Inventory from './pages/admin/Inventory';
import Billing from './pages/admin/Billing';
import Parties from './pages/admin/Parties';

// Layouts
import DashboardLayout from './components/DashboardLayout';

// Auth
import ProtectedRoute from './components/ProtectedRoute';
import SuperAdminDashboard from './pages/superadmin/Superadmindashboard';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Admin Routes with Sidebar Layout */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="admin/dashboard" element={<Dashboard />} />
          <Route path="admin/parties" element={<Parties />} />
          <Route path="admin/settings" element={<Settings />} />
          <Route path="admin/inventory" element={<Inventory />} />
          <Route path="admin/billing" element={<Billing />} />
        </Route>

        {/* Super Admin Route without Sidebar */}
        <Route
          path="/superadmin/dashboard"
          element={
            <ProtectedRoute>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
