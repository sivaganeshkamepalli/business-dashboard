import React, { useState, useRef } from 'react';
import './HomeSection.css';

const DEFAULT_GIF = 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif';

function HomeSection({ userName, uploadedMedia, onMediaChange }) {
  const [previewError, setPreviewError] = useState(false);
  const fileRef = useRef(null);

  const mediaSrc = uploadedMedia || DEFAULT_GIF;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onMediaChange(ev.target.result);
      setPreviewError(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleReset = () => {
    onMediaChange('');
    setPreviewError(false);
  };

  return (
    <div className="home-section">
      <div className="home-media-wrapper">
        {/* Background media */}
        {!previewError ? (
          <img
            src={mediaSrc}
            alt="Background"
            className="home-media-bg"
            onError={() => setPreviewError(true)}
          />
        ) : (
          <div className="home-media-fallback">🖼️ Media unavailable</div>
        )}

        {/* Overlay text */}
        <div className="home-overlay">
          <p className="home-welcome-line">Welcome to</p>
          <h1 className="home-username">{userName}</h1>
          <p className="home-tagline">Business Dashboard — Management Portal</p>
        </div>
      </div>

      {/* Upload controls */}
      <div className="home-controls">
        <h3 className="home-controls-title">Background Media</h3>
        <p className="home-controls-desc">
          Replace the background image or GIF of your welcome screen.
        </p>
        <div className="home-controls-actions">
          <button
            className="btn-upload"
            onClick={() => fileRef.current && fileRef.current.click()}
          >
            📁 Upload Image / GIF
          </button>
          {uploadedMedia && (
            <button className="btn-reset" onClick={handleReset}>
              ↺ Reset to Default
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,image/gif"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        {uploadedMedia && (
          <p className="upload-status">✅ Custom media is active</p>
        )}
      </div>
    </div>
  );
}

export default HomeSection;
