import React from 'react';
import { WiAlert } from 'react-icons/wi';
import './ErrorDisplay.css';

function ErrorDisplay({ message, onRetry }) {
  return (
    <div className="error-display" role="alert">
      <div className="error-content">
        <WiAlert className="error-icon" />
        <div className="error-message">
          <h4 className="error-title">Oops! Something went wrong</h4>
          <p className="error-text">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button className="error-retry-btn" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorDisplay;
