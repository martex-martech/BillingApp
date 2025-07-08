import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import Sidebar from '../components/SideBar';

const MetricCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body d-flex align-items-center">
        <div className={`d-flex align-items-center justify-content-center rounded-circle me-3 ${color}`} style={{ width: '48px', height: '48px' }}>
          {icon}
        </div>
        <div>
          <p className="text-muted mb-1">{title}</p>
          <h4 className="mb-0 fw-bold">{value}</h4>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const appContext = useContext(AppContext);
  const [showSidebar, setShowSidebar] = useState(false);

  const lowStockItems = appContext?.items.filter(item => item.stock < 10).length || 0;

  const data = [
    {
      title: "Today's Sale",
      value: "₹12,500",
      color: "bg-success-subtle text-success",
      icon: <i className="bi bi-bar-chart-fill fs-5"></i>
    },
    {
      title: "Receivable",
      value: "₹3,000",
      color: "bg-warning-subtle text-warning",
      icon: <i className="bi bi-wallet-fill fs-5"></i>
    },
    {
      title: "Low Stock",
      value: `${lowStockItems} Items`,
      color: "bg-danger-subtle text-danger",
      icon: <i className="bi bi-exclamation-circle-fill fs-5"></i>
    },
  ];

  return (
    <div className="container-fluid">
      {/* Navbar for small screens */}
      <nav className="navbar navbar-dark bg-dark d-md-none">
        <div className="container-fluid">
          <button className="btn btn-outline-light" type="button" onClick={() => setShowSidebar(true)}>
            <i className="bi bi-list fs-4"></i>
          </button>
          <span className="navbar-brand ms-2">Ezo Billing</span>
        </div>
      </nav>

      {/* Main layout */}
      <div className="row">
        {/* Sidebar (hidden on mobile, shown as offcanvas) */}
        <div className="col-md-3 col-lg-2 d-none d-md-block p-0">
          <Sidebar />
        </div>

        {/* Offcanvas Sidebar for mobile */}
        <div
          className={`offcanvas offcanvas-start d-md-none ${showSidebar ? 'show' : ''}`}
          tabIndex={-1}
          style={{ width: '250px', visibility: showSidebar ? 'visible' : 'hidden' }}
        >

          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Ezo Billing</h5>
            <button type="button" className="btn-close" onClick={() => setShowSidebar(false)}></button>
          </div>
          <div className="offcanvas-body p-0">
            <Sidebar />
          </div>
        </div>

        {/* Content */}
        <div className="col-md-9 col-lg-10 p-4">
          <h1 className="mb-4">Dashboard</h1>

          <div className="row g-3 mb-4">
            {data.map((item) => (
              <div className="col-12 col-md-4" key={item.title}>
                <MetricCard {...item} />
              </div>
            ))}
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Quick Actions</h5>
              <div className="row g-3">
                <div className="col-6 col-md-3">
                  <button className="btn btn-outline-primary w-100 py-3 d-flex flex-column align-items-center">
                    <i className="bi bi-receipt fs-3 mb-2"></i>
                    <span>New Invoice</span>
                  </button>
                </div>
                <div className="col-6 col-md-3">
                  <button className="btn btn-outline-success w-100 py-3 d-flex flex-column align-items-center">
                    <i className="bi bi-person-plus fs-3 mb-2"></i>
                    <span>Add Party</span>
                  </button>
                </div>
                <div className="col-6 col-md-3">
                  <button className="btn btn-outline-warning w-100 py-3 d-flex flex-column align-items-center">
                    <i className="bi bi-box-seam fs-3 mb-2"></i>
                    <span>Add Item</span>
                  </button>
                </div>
                <div className="col-6 col-md-3">
                  <button className="btn btn-outline-info w-100 py-3 d-flex flex-column align-items-center">
                    <i className="bi bi-graph-up fs-3 mb-2"></i>
                    <span>View Reports</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
