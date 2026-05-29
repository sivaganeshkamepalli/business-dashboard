import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import HomeSection from '../components/HomeSection/HomeSection';
import EmployeeTable from '../components/EmployeeTable/EmployeeTable';
import './DashboardPage.css';

function DashboardPage({ userName, onLogout, uploadedMedia, onMediaChange }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="dashboard-root">
      <Header
        userName={userName}
        onLogout={onLogout}
        onMenuToggle={toggleSidebar}
        sidebarOpen={sidebarOpen}
      />

      <div className="dashboard-body">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={closeSidebar} />
        )}

        <main className="dashboard-main">
          <Routes>
            <Route
              path="home"
              element={
                <HomeSection
                  userName={userName}
                  uploadedMedia={uploadedMedia}
                  onMediaChange={onMediaChange}
                />
              }
            />
            <Route
              path="employees"
              element={
                <EmployeeTable uploadedMedia={uploadedMedia} />
              }
            />
            <Route path="*" element={<Navigate to="home" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default DashboardPage;
