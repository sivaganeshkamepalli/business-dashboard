import React from 'react';
import './Header.css';

function Header({ userName, onLogout, onMenuToggle, sidebarOpen }) {
  const initials = userName
    ? userName.trim().split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  return (
    <header className="app-header">
      <div className="header-left">
        {/* Hamburger */}
        <button
          className={`hamburger-btn ${sidebarOpen ? 'active' : ''}`}
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
        >
          <span />
          <span />
          <span />
        </button>

        {/* Logo */}
        <div className="header-logo">
          <div className="header-logo-icon">B</div>
          <div className="header-logo-text">
            <span className="header-brand">Business Dashboard</span>
            <span className="header-tagline">Management Portal</span>
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="user-info">
          <span className="user-name-label">
            <span className="user-greeting">Hello, </span>
            <strong>{userName}</strong>
          </span>
          <div className="user-avatar" title={userName}>
            {initials}
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout} title="Sign out">
          ⎋ Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
