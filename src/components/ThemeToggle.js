import React from 'react';
import { WiDaySunny } from 'react-icons/wi';
import './ThemeToggle.css';

function ThemeToggle({ currentTheme, onToggle }) {
  return (
    <button
      className="theme-toggle-btn"
      onClick={onToggle}
      aria-label={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {currentTheme === 'dark' ? (
        <WiDaySunny className="theme-icon sun-icon" />
      ) : (
        <i className="bi bi-moon-fill theme-icon moon-icon"></i>
      )}
    </button>
  );
}

export default ThemeToggle;
