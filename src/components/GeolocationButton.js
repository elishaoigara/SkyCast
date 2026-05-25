import React, { useState } from 'react';
import { WiLocationArrow } from 'react-icons/wi';
import './GeolocationButton.css';

function GeolocationButton({ onLocationFound, loading }) {
  const [error, setError] = useState(null);

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setError(null);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocode using OpenWeatherMap
          const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
          const reverseGeoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;
          
          const response = await fetch(reverseGeoUrl);
          
          if (!response.ok) {
            throw new Error('Failed to get location name');
          }
          
          const geoData = await response.json();
          
          if (geoData && geoData.length > 0) {
            const location = geoData[0];
            onLocationFound({
              lat: latitude,
              lon: longitude,
              name: `${location.name}, ${location.country}`
            });
          } else {
            onLocationFound({
              lat: latitude,
              lon: longitude,
              name: 'Current Location'
            });
          }
        } catch (err) {
          setError(err.message);
          onLocationFound({
            lat: latitude,
            lon: longitude,
            name: 'Current Location'
          });
        }
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location permission denied. Please enable location access.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information unavailable.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out.');
            break;
          default:
            setError('An unknown error occurred.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="geolocation-wrapper">
      <button
        className={`geolocation-btn ${loading ? 'loading' : ''}`}
        onClick={handleGeolocation}
        disabled={loading}
        aria-label="Detect my location"
        title="Detect my location"
      >
        {loading ? (
          <div className="geolocation-spinner"></div>
        ) : (
          <WiLocationArrow className="geolocation-icon" />
        )}
      </button>
      {error && (
        <div className="geolocation-error">{error}</div>
      )}
    </div>
  );
}

export default GeolocationButton;
