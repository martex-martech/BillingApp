import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Sidebar: React.FC = () => {
    const appContext = useContext(AppContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);

    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
        toggle: <i className="bi bi-list fs-4"></i>,
    };

    return (
        <div className={`bg-dark text-white d-flex flex-column vh-100 shadow-sm ${isOpen ? 'w-64' : 'w-16'}`} style={{ transition: 'width 0.3s' }}>
            {/* Brand and toggle */}
            <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom border-secondary" style={{ minHeight: '48px' }}>
                <h4 className="mb-0 fw-bold d-flex align-items-center">{isOpen ? 'Ezo Billing' : ''}</h4>
                <button onClick={() => setIsOpen(!isOpen)} className="btn btn-outline-light p-1 d-flex align-items-center justify-content-center toggle-button" style={{ fontSize: '1rem', width: '32px', height: '32px' }}>
                    {icons.toggle}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-grow-1 px-3 py-4 d-flex flex-column gap-2">
                <NavLink to="/dashboard" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : 'text-white'}`}>
                    {icons.dashboard} {isOpen && <span>Dashboard</span>}
                </NavLink>
                <NavLink to="/parties" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : 'text-white'}`}>
                    {icons.parties} {isOpen && <span>Parties</span>}
                </NavLink>
                <NavLink to="/inventory" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : 'text-white'}`}>
                    {icons.inventory} {isOpen && <span>Inventory</span>}
                </NavLink>
                <NavLink to="/billing" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : 'text-white'}`}>
                    {icons.billing} {isOpen && <span>Billing</span>}
                </NavLink>
                <NavLink to="/settings" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : 'text-white'}`}>
                    {icons.settings} {isOpen && <span>Settings</span>}
                </NavLink>
                <NavLink to="/super-admin" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : 'text-white'}`}>
                    {icons.admin} {isOpen && <span>Super Admin</span>}
                </NavLink>
            </nav>

            {/* Logout */}
            <div className="px-3 py-3 border-top border-secondary">
                <button onClick={handleLogout} className="btn btn-outline-light w-100 d-flex align-items-center gap-2">
                    {icons.logout} {isOpen && <span>Logout</span>}
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

            /* Toggle button visibility */
            .toggle-button {
                display: none !important;
            }

            @media (max-width: 767.98px) {
                .toggle-button {
                    display: flex !important;
                }
            }
        `}</style>
        </div>
    );
};

export default Sidebar;
