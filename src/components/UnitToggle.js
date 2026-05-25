import React from 'react';
import './UnitToggle.css';

function UnitToggle({ units, onToggle }) {
  return (
    <button
      className="unit-toggle-btn"
      onClick={onToggle}
      aria-label={`Switch to ${units === 'metric' ? 'Fahrenheit' : 'Celsius'}`}
      title={`Switch to ${units === 'metric' ? 'Fahrenheit' : 'Celsius'}`}
    >
      <span className="unit-label">
        {units === 'metric' ? '°C' : '°F'}
      </span>
    </button>
  );
}

export default UnitToggle;
