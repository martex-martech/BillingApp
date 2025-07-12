import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './SideBar';

const DashboardLayout: React.FC = () => {
  return (
    <div className="d-flex vh-100">
      {/* Sidebar handles its own open/close state internally */}
      <Sidebar />
      
      {/* Main content area */}
      <main className="flex-grow-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
