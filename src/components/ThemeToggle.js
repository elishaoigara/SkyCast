import React from 'react';
import { WiDaySunny, WiMoonAlt } from 'react-icons/wi';
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
        <WiMoonAlt className="theme-icon moon-icon" />
      )}
    </button>
  );
}

export default ThemeToggle;
