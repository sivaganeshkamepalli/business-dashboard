import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('mbe_user') || '';
  });

  const [uploadedMedia, setUploadedMedia] = useState(() => {
    return localStorage.getItem('mbe_media') || '';
  });

  const handleLogin = (name) => {
    localStorage.setItem('mbe_user', name);
    setUserName(name);
  };

  const handleLogout = () => {
    localStorage.removeItem('mbe_user');
    setUserName('');
  };

  const handleMediaChange = (dataUrl) => {
    localStorage.setItem('mbe_media', dataUrl);
    setUploadedMedia(dataUrl);
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          userName
            ? <Navigate to="/dashboard" replace />
            : <LoginPage onLogin={handleLogin} />
        }
      />
      <Route
        path="/dashboard/*"
        element={
          userName
            ? <DashboardPage
                userName={userName}
                onLogout={handleLogout}
                uploadedMedia={uploadedMedia}
                onMediaChange={handleMediaChange}
              />
            : <Navigate to="/login" replace />
        }
      />
      <Route path="*" element={<Navigate to={userName ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}

export default App;
