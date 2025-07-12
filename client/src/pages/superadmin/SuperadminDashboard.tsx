import React, { useEffect, useState } from 'react';
import {
  createAdmin,
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  deleteAdmin
} from '../../services/superadmin/Superadminservice';

interface User {
  _id: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'trial_expired';
  plan: string;
  expiry: string;
}

const SuperAdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newExpiry, setNewExpiry] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data || []);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId: string, newStatus: 'active' | 'inactive' | 'trial_expired') => {
    try {
      await updateUserStatus(userId, { status: newStatus });
      setUsers(prev =>
        prev.map(user => (user._id === userId ? { ...user, status: newStatus } : user))
      );
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await updateUserRole(userId, { role: role as 'admin' | 'staff' | 'superadmin' });
      setUsers(prev =>
        prev.map(user => (user._id === userId ? { ...user, role } : user))
      );
    } catch (err) {
      alert('Failed to update role');
    }
  };

  const handleAddAdmin = async () => {
    if (!newEmail || !newExpiry) {
      alert('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      await createAdmin({
        email: newEmail,
        role: 'admin',
        plan: 'free',
        expiry: newExpiry,
      });
      await fetchUsers();
      setShowAddModal(false);
      setNewEmail('');
      setNewExpiry('');
    } catch (err) {
      alert('Failed to add admin');
    }
  };

  const handleDeleteClick = (userId: string) => {
    setSelectedUserId(userId);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedUserId) return;

    try {
      await deleteAdmin(selectedUserId);
      setUsers(prev => prev.filter(user => user._id !== selectedUserId));
      setShowConfirmModal(false);
      setSelectedUserId(null);
    } catch (err) {
      alert('Failed to delete admin');
    }
  };

  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filter === 'all' || user.status === filter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => a.email.localeCompare(b.email));

  return (
    <div className="container-fluid py-4 px-3 px-md-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-2">Super Admin Panel</h2>
          <p className="text-muted mb-0">Manage all users, roles, and plans.</p>
        </div>

        <div className="d-flex flex-column flex-sm-row align-items-start gap-2">
          <input
            type="text"
            placeholder="Search by email"
            className="form-control form-control-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="form-select form-select-sm w-auto"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="trial_expired">Trial Expired</option>
          </select>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary btn-sm px-4"
            style={{ whiteSpace: 'nowrap' }}
          >
            + Add Admin
          </button>
        </div>
      </div>

      <div className="table-responsive">
        {loading ? (
          <p className="text-center py-4">Loading...</p>
        ) : error ? (
          <p className="text-danger text-center py-4">{error}</p>
        ) : (
          <>
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Plan</th>
                  <th>Expiry</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.email}</td>
                      <td>
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className="form-select form-select-sm"
                        >
                          <option value="admin">Admin</option>
                          <option value="staff">Staff</option>
                        </select>
                      </td>
                      <td>{user.plan}</td>
                      <td>{new Date(user.expiry).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge rounded-pill bg-${user.status === 'active'
                          ? 'success'
                          : user.status === 'inactive'
                            ? 'secondary'
                            : 'warning text-dark'
                          }`}>
                          {user.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="d-flex gap-2">
                        {user.status === 'active' ? (
                          <button
                            onClick={() => handleToggleStatus(user._id, 'inactive')}
                            className="btn btn-outline-danger btn-sm"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(user._id, 'active')}
                            className="btn btn-outline-success btn-sm"
                          >
                            Activate
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteClick(user._id)}
                          className="btn btn-sm btn-outline-danger ms-auto"
                          title="Delete Admin"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <small className="text-muted">Total Users: {filteredUsers.length}</small>
          </>
        )}
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content shadow">
              <div className="modal-header border-bottom-0">
                <h5 className="modal-title fw-bold">Add New Admin</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <div className="modal-body pt-0">
                <div className="row g-3">
                  <div className="col-12">
                    <label htmlFor="email" className="form-label fw-medium">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="expiry" className="form-label fw-medium">Expiry Date</label>
                    <input
                      type="date"
                      id="expiry"
                      value={newExpiry}
                      onChange={(e) => setNewExpiry(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top-0 d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddAdmin}
                >
                  Add Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={() => setShowConfirmModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this admin?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
