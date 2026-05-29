import React, { useState, useEffect } from 'react';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import { formatSalary, formatDistance, formatDateTime, generateId } from '../../utils/formatters';
import { validateEmployee } from '../../utils/validators';
import './EmployeeTable.css';

const STORAGE_KEY = 'mbe_employees';
const DISTANCE_INCREMENT = 80; // meters
const DISTANCE_INTERVAL = 2 * 60 * 1000; // 2 minutes in ms

const EMPTY_EMPLOYEE = { name: '', salary: '', gender: '', distance: '500' };

function loadEmployees() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveEmployees(employees) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
}

function EmployeeTable({ uploadedMedia }) {
  const [employees, setEmployees] = useState(loadEmployees);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editErrors, setEditErrors] = useState({});

  // New employee form (shown as a row at top)
  const [adding, setAdding] = useState(false);
  const [newForm, setNewForm] = useState(EMPTY_EMPLOYEE);
  const [newErrors, setNewErrors] = useState({});

  // Confirm modal state
  const [modal, setModal] = useState({ open: false, message: '', onConfirm: null });

  // Persist on changes
  useEffect(() => {
    saveEmployees(employees);
  }, [employees]);

  // Auto-update distance every 2 minutes
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().toISOString();
      setEmployees((prev) =>
        prev.map((emp) => ({
          ...emp,
          distance: Number(emp.distance) + DISTANCE_INCREMENT,
          updatedAt: now,
        }))
      );
    }, DISTANCE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  // -------- Add Employee --------
  const handleAddClick = () => {
    setAdding(true);
    setNewForm(EMPTY_EMPLOYEE);
    setNewErrors({});
    setEditingId(null);
  };

  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewForm((prev) => ({ ...prev, [name]: value }));
    setNewErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleNewSave = () => {
    const errs = validateEmployee(newForm);
    if (Object.keys(errs).length > 0) {
      setNewErrors(errs);
      return;
    }
    const now = new Date().toISOString();
    const emp = {
      id: generateId(),
      name: newForm.name.trim(),
      salary: Number(newForm.salary),
      gender: newForm.gender,
      distance: Number(newForm.distance),
      updatedAt: now,
    };
    setEmployees((prev) => [emp, ...prev]);
    setAdding(false);
    setNewForm(EMPTY_EMPLOYEE);
  };

  const handleNewCancel = () => {
    setAdding(false);
    setNewForm(EMPTY_EMPLOYEE);
    setNewErrors({});
  };

  // -------- Edit Employee --------
  const handleEditClick = (emp) => {
    setEditingId(emp.id);
    setEditForm({
      name: emp.name,
      salary: emp.salary,
      gender: emp.gender,
      distance: emp.distance,
    });
    setEditErrors({});
    setAdding(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    setEditErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleEditSave = (id) => {
    const errs = validateEmployee(editForm);
    if (Object.keys(errs).length > 0) {
      setEditErrors(errs);
      return;
    }
    const now = new Date().toISOString();
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id
          ? {
              ...emp,
              name: editForm.name.trim(),
              salary: Number(editForm.salary),
              gender: editForm.gender,
              distance: Number(editForm.distance),
              updatedAt: now,
            }
          : emp
      )
    );
    setEditingId(null);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditErrors({});
  };

  // -------- Delete Employee --------
  const handleDeleteClick = (id) => {
    setModal({
      open: true,
      message: 'Are you sure you want to delete this employee record?',
      onConfirm: () => {
        setEmployees((prev) => prev.filter((e) => e.id !== id));
        closeModal();
      },
    });
  };

  // -------- Copy Employee --------
  const handleCopyClick = (emp) => {
    setModal({
      open: true,
      message: 'Are you sure you want to copy this employee record?',
      onConfirm: () => {
        const now = new Date().toISOString();
        const copied = { ...emp, id: generateId(), updatedAt: now };
        setEmployees((prev) => {
          const idx = prev.findIndex((e) => e.id === emp.id);
          const next = [...prev];
          next.splice(idx + 1, 0, copied);
          return next;
        });
        closeModal();
      },
    });
  };

  const closeModal = () => setModal({ open: false, message: '', onConfirm: null });

  // -------- Render helpers --------
  const renderReadRow = (emp) => {
    const isHighDist = Number(emp.distance) > 2000;
    const isHighSalary = Number(emp.salary) > 50000;

    return (
      <tr key={emp.id} className="emp-row">
        <td className="td-name">{emp.name}</td>
        <td className={`td-salary ${isHighSalary ? 'salary-high' : ''}`}>
          {formatSalary(emp.salary)}
        </td>
        <td className="td-gender">
          <span className={`gender-badge gender-${emp.gender.toLowerCase()}`}>
            {emp.gender}
          </span>
        </td>
        <td className={`td-distance ${isHighDist ? 'distance-alert' : ''}`}>
          {formatDistance(emp.distance)}
          {isHighDist && <span className="distance-icon" title="Over 2 km">⚠️</span>}
        </td>
        <td className="td-time">{formatDateTime(emp.updatedAt)}</td>
        <td className="td-actions">
          <button
            className="action-btn btn-edit"
            onClick={() => handleEditClick(emp)}
            title="Edit"
          >
            ✏️ Edit
          </button>
          <button
            className="action-btn btn-copy"
            onClick={() => handleCopyClick(emp)}
            title="Copy"
          >
            ⧉ Copy
          </button>
          <button
            className="action-btn btn-delete"
            onClick={() => handleDeleteClick(emp.id)}
            title="Delete"
          >
            🗑 Delete
          </button>
        </td>
      </tr>
    );
  };

  const renderEditRow = (emp) => (
    <tr key={emp.id} className="emp-row emp-row-editing">
      <td>
        <input
          name="name"
          value={editForm.name}
          onChange={handleEditChange}
          className={`inline-input ${editErrors.name ? 'input-error' : ''}`}
          placeholder="Full name"
        />
        {editErrors.name && <div className="inline-error">{editErrors.name}</div>}
      </td>
      <td>
        <input
          name="salary"
          type="number"
          value={editForm.salary}
          onChange={handleEditChange}
          className={`inline-input ${editErrors.salary ? 'input-error' : ''}`}
          placeholder="Salary"
          min="1"
        />
        {editErrors.salary && <div className="inline-error">{editErrors.salary}</div>}
      </td>
      <td>
        <select
          name="gender"
          value={editForm.gender}
          onChange={handleEditChange}
          className={`inline-select ${editErrors.gender ? 'input-error' : ''}`}
        >
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {editErrors.gender && <div className="inline-error">{editErrors.gender}</div>}
      </td>
      <td>
        <input
          name="distance"
          type="number"
          value={editForm.distance}
          onChange={handleEditChange}
          className={`inline-input ${editErrors.distance ? 'input-error' : ''}`}
          placeholder="Meters"
          min="0"
        />
        {editErrors.distance && <div className="inline-error">{editErrors.distance}</div>}
      </td>
      <td className="td-time">{formatDateTime(emp.updatedAt)}</td>
      <td className="td-actions">
        <button
          className="action-btn btn-save"
          onClick={() => handleEditSave(emp.id)}
        >
          💾 Save
        </button>
        <button className="action-btn btn-cancel" onClick={handleEditCancel}>
          ✕ Cancel
        </button>
      </td>
    </tr>
  );

  const renderAddRow = () => (
    <tr className="emp-row emp-row-adding">
      <td>
        <input
          name="name"
          value={newForm.name}
          onChange={handleNewChange}
          className={`inline-input ${newErrors.name ? 'input-error' : ''}`}
          placeholder="Full name"
          autoFocus
        />
        {newErrors.name && <div className="inline-error">{newErrors.name}</div>}
      </td>
      <td>
        <input
          name="salary"
          type="number"
          value={newForm.salary}
          onChange={handleNewChange}
          className={`inline-input ${newErrors.salary ? 'input-error' : ''}`}
          placeholder="Salary"
          min="1"
        />
        {newErrors.salary && <div className="inline-error">{newErrors.salary}</div>}
      </td>
      <td>
        <select
          name="gender"
          value={newForm.gender}
          onChange={handleNewChange}
          className={`inline-select ${newErrors.gender ? 'input-error' : ''}`}
        >
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {newErrors.gender && <div className="inline-error">{newErrors.gender}</div>}
      </td>
      <td>
        <input
          name="distance"
          type="number"
          value={newForm.distance}
          onChange={handleNewChange}
          className={`inline-input ${newErrors.distance ? 'input-error' : ''}`}
          placeholder="Meters"
          min="0"
        />
        {newErrors.distance && <div className="inline-error">{newErrors.distance}</div>}
      </td>
      <td className="td-time">—</td>
      <td className="td-actions">
        <button className="action-btn btn-save" onClick={handleNewSave}>
          ✓ Add
        </button>
        <button className="action-btn btn-cancel" onClick={handleNewCancel}>
          ✕ Cancel
        </button>
      </td>
    </tr>
  );

  const tableStyle = uploadedMedia
    ? {
        background: `linear-gradient(rgba(255,255,255,0.88), rgba(255,255,255,0.88)), url(${uploadedMedia}) center/cover no-repeat`,
      }
    : {};

  return (
    <div className="emp-section">
      {/* Section header */}
      <div className="emp-section-header">
        <div>
          <h2 className="emp-title">Employees</h2>
          <p className="emp-subtitle">
            {employees.length} record{employees.length !== 1 ? 's' : ''}
            {' '}· Distance updates every 2 min (+80 m)
          </p>
        </div>
        <button className="btn-add-emp" onClick={handleAddClick} disabled={adding}>
          + Add Employee
        </button>
      </div>

      {/* Table wrapper */}
      <div className="emp-table-wrapper" style={tableStyle}>
        {employees.length === 0 && !adding ? (
          <div className="emp-empty">
            <div className="emp-empty-icon">👥</div>
            <p>No employees yet. Click "Add Employee" to get started.</p>
          </div>
        ) : (
          <div className="emp-table-scroll">
            <table className="emp-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Salary</th>
                  <th>Gender</th>
                  <th>Distance</th>
                  <th>Updated Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {adding && renderAddRow()}
                {employees.map((emp) =>
                  editingId === emp.id ? renderEditRow(emp) : renderReadRow(emp)
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm modal */}
      <ConfirmModal
        isOpen={modal.open}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onCancel={closeModal}
      />
    </div>
  );
}

export default EmployeeTable;
