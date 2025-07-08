import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Sidebar: React.FC = () => {
    const appContext = useContext(AppContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        appContext?.logout();
        navigate('/login');
    };

    const navLinkClasses = 'nav-link d-flex align-items-center gap-2 px-3 py-2 rounded transition';
    const activeLinkClasses = 'bg-light text-dark fw-semibold shadow-sm';

    const icons = {
        dashboard: <i className="bi bi-speedometer2 fs-5"></i>,
        parties: <i className="bi bi-people fs-5"></i>,
        inventory: <i className="bi bi-box-seam fs-5"></i>,
        billing: <i className="bi bi-receipt fs-5"></i>,
        settings: <i className="bi bi-gear fs-5"></i>,
        admin: <i className="bi bi-person-badge fs-5"></i>,
        logout: <i className="bi bi-box-arrow-left fs-5"></i>,
    };

    return (
        <div className="bg-dark text-white d-flex flex-column vh-100 shadow-sm" style={{ width: '250px' }}>
            {/* Brand */}
            <div className="px-4 py-3 border-bottom border-secondary">
                <h4 className="mb-0 fw-bold">Ezo Billing</h4>
            </div>

            {/* Navigation */}
            <nav className="flex-grow-1 px-3 py-4 d-flex flex-column gap-2">
                <NavLink to="/dashboard" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : 'text-white'}`}>
                    {icons.dashboard} <span>Dashboard</span>
                </NavLink>
                <NavLink to="/parties" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : 'text-white'}`}>
                    {icons.parties} <span>Parties</span>
                </NavLink>
                <NavLink to="/inventory" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : 'text-white'}`}>
                    {icons.inventory} <span>Inventory</span>
                </NavLink>
                <NavLink to="/billing" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : 'text-white'}`}>
                    {icons.billing} <span>Billing</span>
                </NavLink>
                <NavLink to="/settings" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : 'text-white'}`}>
                    {icons.settings} <span>Settings</span>
                </NavLink>
                <NavLink to="/super-admin" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : 'text-white'}`}>
                    {icons.admin} <span>Super Admin</span>
                </NavLink>
            </nav>

            {/* Logout */}
            <div className="px-3 py-3 border-top border-secondary">
                <button onClick={handleLogout} className="btn btn-outline-light w-100 d-flex align-items-center gap-2">
                    {icons.logout} <span>Logout</span>
                </button>
            </div>

            {/* Custom styles */}
            <style>{`
            .nav-link.transition {
            transition: background-color 0.2s ease, color 0.2s ease;
            }

            .nav-link:hover {
            background-color: rgba(255, 255, 255, 0.1);
            }

            .nav-link span {
            font-size: 0.95rem;
            }
        `}</style>
        </div>
    );
};

export default Sidebar;
