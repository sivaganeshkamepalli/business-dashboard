import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateLogin } from '../utils/validators';
import { formatDateTime } from '../utils/formatters';
import './LoginPage.css';

function LoginPage({ onLogin }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', mobile: '' });
  const [errors, setErrors] = useState({});
  const [timestamp, setTimestamp] = useState(new Date().toISOString());

  // Update timestamp every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(new Date().toISOString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validateLogin(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onLogin(form.name.trim());
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <div className="login-bg-shapes">
        <div className="shape shape-1" />
        <div className="shape shape-2" />
        <div className="shape shape-3" />
      </div>

      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon">B</div>
          <div>
            <span className="logo-brand">Business Dashboard</span>
            <span className="logo-sub">Management Portal</span>
          </div>
        </div>

        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to your dashboard</p>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              className={errors.name ? 'input-error' : ''}
              autoComplete="off"
            />
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Mobile Number</label>
            <input
              id="mobile"
              name="mobile"
              type="tel"
              placeholder="10-digit mobile number"
              value={form.mobile}
              onChange={handleChange}
              maxLength={10}
              className={errors.mobile ? 'input-error' : ''}
            />
            {errors.mobile && <span className="error-msg">{errors.mobile}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="timestamp">Session Timestamp</label>
            <input
              id="timestamp"
              type="text"
              value={formatDateTime(timestamp)}
              readOnly
              className="input-readonly"
            />
          </div>

          <button type="submit" className="login-btn">
            Sign In →
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
