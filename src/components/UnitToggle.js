import React from 'react';
import './UnitToggle.css';

function UnitToggle({ units, onToggle }) {
  return (
    <div className="unit-toggle" role="radiogroup" aria-label="Temperature unit">
      <button
        className={`unit-toggle-btn ${units === 'metric' ? 'active' : ''}`}
        onClick={() => units !== 'metric' && onToggle()}
        aria-label="Switch to Celsius"
        title="Switch to Celsius"
        role="radio"
        aria-checked={units === 'metric'}
      >
        °C
      </button>
      <button
        className={`unit-toggle-btn ${units === 'imperial' ? 'active' : ''}`}
        onClick={() => units !== 'imperial' && onToggle()}
        aria-label="Switch to Fahrenheit"
        title="Switch to Fahrenheit"
        role="radio"
        aria-checked={units === 'imperial'}
      >
        °F
      </button>
    </div>
  );
}

export default UnitToggle;
