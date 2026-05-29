import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const navItems = [
  { label: 'Home', path: '/dashboard/home', icon: '⌂' },
  { label: 'Employees', path: '/dashboard/employees', icon: '👥' },
];

function Sidebar({ isOpen, onClose }) {
  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <nav className="sidebar-nav">
        <p className="sidebar-section-label">Menu</p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              'sidebar-link' + (isActive ? ' sidebar-link-active' : '')
            }
            onClick={onClose}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="sidebar-footer-text">MBE v1.0</span>
      </div>
    </aside>
  );
}

export default Sidebar;
