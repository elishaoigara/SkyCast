import React, { useState } from 'react';
import apiConfig from '../config/api';
import './GeolocationButton.css';

const GeolocationButton = ({ onLocationFound, loading }) => {
  const [error, setError] = useState(null);

  const handleClick = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setError(null);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Try to get city name via reverse geocoding
      let cityName = '';
      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiConfig.weatherApiKey}`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          cityName = data[0].name;
        }
      } catch (err) {
        console.warn('Could not get city name:', err);
      }

      onLocationFound({ 
        lat: latitude, 
        lon: longitude,
        name: cityName || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`
      });
    } catch (err) {
      if (err.code === 1) {
        setError('Location permission denied. Please enable location access.');
      } else if (err.code === 2) {
        setError('Location unavailable. Please try again.');
      } else if (err.code === 3) {
        setError('Location request timed out. Please try again.');
      } else {
        setError('Unable to get your location');
      }
      console.error('Geolocation error:', err);
    }
  };

  return (
    <div className="geolocation-wrapper">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="geolocation-btn"
        aria-label="Use my current location"
        title="Use my current location"
      >
        {loading ? (
          <span className="geolocation-spinner" role="status" aria-hidden="true"></span>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="geolocation-icon">
            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
          </svg>
        )}
      </button>
      {error && (
        <div className="geolocation-error">
          {error}
        </div>
      )}
    </div>
  );
};

export default React.memo(GeolocationButton);
