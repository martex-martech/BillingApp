import React from 'react';

const SettingsCard: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="card p-4 shadow-sm mb-4">
    <h5 className="card-title border-bottom pb-2 mb-3">{title}</h5>
    {children}
  </div>
);

const Settings: React.FC = () => {
  return (
    <div className="container my-4">
      <h1 className="h3 mb-4">Settings</h1>

      <SettingsCard title="Profile Settings">
        <form className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Business Name</label>
            <input type="text" defaultValue="My Awesome Store" className="form-control" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Contact Email</label>
            <input type="email" defaultValue="contact@awesomestore.com" className="form-control" />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary mt-2">
              Save Profile
            </button>
          </div>
        </form>
      </SettingsCard>

      <SettingsCard title="Billing Settings">
        <form className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Default Currency</label>
            <input
              type="text"
              defaultValue="INR (₹)"
              className="form-control bg-light"
              disabled
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Tax ID (GSTIN)</label>
            <input
              type="text"
              placeholder="e.g., 22AAAAA0000A1Z5"
              className="form-control"
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary mt-2">
              Save Billing Info
            </button>
          </div>
        </form>
      </SettingsCard>

      <SettingsCard title="Staff Permissions">
        <div className="d-flex flex-column gap-3">
          <div className="border rounded p-3 d-flex justify-content-between align-items-center">
            <div>
              <strong>Ravi Kumar (Sales)</strong>
              <div className="text-muted small">
                Can create invoices, view inventory.
              </div>
            </div>
            <button className="btn btn-outline-secondary btn-sm">Edit</button>
          </div>

          <div className="border rounded p-3 d-flex justify-content-between align-items-center">
            <div>
              <strong>Sunita Sharma (Manager)</strong>
              <div className="text-muted small">Full access except settings.</div>
            </div>
            <button className="btn btn-outline-secondary btn-sm">Edit</button>
          </div>

          <div>
            <button className="btn btn-primary mt-2">Add Staff Member</button>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
};

export default Settings;
