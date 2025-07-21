// src/components/Clouds.js
import React from 'react';

function Clouds() {
  return (
    <svg
      width="100%"
      height="100px"
      viewBox="0 0 600 100"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
    >
      <g>
        <circle cx="50" cy="50" r="30" fill="#ffffff22">
          <animate
            attributeName="cx"
            values="0;600"
            dur="60s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="150" cy="60" r="25" fill="#ffffff22">
          <animate
            attributeName="cx"
            values="0;600"
            dur="80s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="250" cy="40" r="20" fill="#ffffff22">
          <animate
            attributeName="cx"
            values="0;600"
            dur="90s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </svg>
  );
}

export default Clouds;
