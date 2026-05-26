import React, { useState } from 'react';
import apiConfig from '../config/api';

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
    <div className="d-inline-block">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="btn btn-outline-light d-flex align-items-center gap-2"
        aria-label="Use my current location"
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span>Locating...</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
            </svg>
            <span>My Location</span>
          </>
        )}
      </button>
      {error && (
        <div className="alert alert-danger mt-2 py-1 px-2 small">
          {error}
        </div>
      )}
    </div>
  );
};

export default React.memo(GeolocationButton);