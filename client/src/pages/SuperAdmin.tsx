import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`btn ${active ? 'btn-primary' : 'btn-outline-secondary'}`}
  >
    {children}
  </button>
);

const UserDashboard = () => (
  <div className="table-responsive">
    <table className="table table-bordered align-middle">
      <thead className="table-light">
        <tr>
          <th>User</th>
          <th>Plan</th>
          <th>Status</th>
          <th className="text-end">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>My Awesome Store</td>
          <td>Premium</td>
          <td>
            <span className="badge bg-success">Active</span>
          </td>
          <td className="text-end">
            <button className="btn btn-outline-secondary btn-sm">Manage</button>
          </td>
        </tr>
        <tr>
          <td>Another Retailer</td>
          <td>Basic</td>
          <td>
            <span className="badge bg-danger">Expired</span>
          </td>
          <td className="text-end">
            <button className="btn btn-outline-secondary btn-sm">Manage</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

const reportData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 5500 },
];

const Reports = () => (
  <div>
    <h5 className="mb-3">Monthly Sales Analytics</h5>
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={reportData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" stroke="#6c757d" fontSize={12} />
          <YAxis stroke="#6c757d" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #dee2e6',
              borderRadius: '0.5rem',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
          <Bar dataKey="sales" fill="#0d6efd" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const PlanSetup = () => (
  <div className="row g-4">
    <div className="col-md-6 col-lg-4">
      <div className="card text-center h-100">
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">Basic</h5>
          <p className="display-6">₹499 <span className="fs-6 text-muted">/mo</span></p>
          <ul className="list-unstyled text-start flex-grow-1 mb-3">
            <li>✅ 100 Invoices/month</li>
            <li>✅ 500 Items</li>
            <li>✅ 1 Staff Member</li>
          </ul>
          <button className="btn btn-outline-secondary w-100 mt-auto">Edit Plan</button>
        </div>
      </div>
    </div>

    <div className="col-md-6 col-lg-4">
      <div className="card border-primary text-center h-100 position-relative">
        <div className="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-primary">
          Most Popular
        </div>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">Premium</h5>
          <p className="display-6">₹999 <span className="fs-6 text-muted">/mo</span></p>
          <ul className="list-unstyled text-start flex-grow-1 mb-3">
            <li>✅ Unlimited Invoices</li>
            <li>✅ Unlimited Items</li>
            <li>✅ 5 Staff Members</li>
          </ul>
          <button className="btn btn-primary w-100 mt-auto">Edit Plan</button>
        </div>
      </div>
    </div>

    <div className="col-md-6 col-lg-4">
      <div className="card text-center h-100">
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">Enterprise</h5>
          <p className="display-6">Contact Us</p>
          <ul className="list-unstyled text-start flex-grow-1 mb-3">
            <li>✅ Custom Features</li>
            <li>✅ Dedicated Support</li>
            <li>✅ Unlimited Staff</li>
          </ul>
          <button className="btn btn-outline-secondary w-100 mt-auto">Edit Plan</button>
        </div>
      </div>
    </div>
  </div>
);

const SuperAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="container my-4">
      <h1 className="h3 mb-4">Super Admin</h1>
      <div className="card shadow-sm p-4">
        <div className="d-flex gap-2 border-bottom pb-3 mb-3">
          <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')}>Users</TabButton>
          <TabButton active={activeTab === 'reports'} onClick={() => setActiveTab('reports')}>Reports</TabButton>
          <TabButton active={activeTab === 'plans'} onClick={() => setActiveTab('plans')}>Plan Setup</TabButton>
        </div>
        <div>
          {activeTab === 'users' && <UserDashboard />}
          {activeTab === 'reports' && <Reports />}
          {activeTab === 'plans' && <PlanSetup />}
        </div>
      </div>
    </div>
  );
};

export default SuperAdmin;
