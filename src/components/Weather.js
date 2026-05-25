import React from 'react';
import './Weather.css';

const Weather = ({ data, units }) => {
  if (!data) return null;

  const { 
    name, 
    sys, 
    main, 
    weather, 
    wind, 
    dt,
    visibility 
  } = data;

  const getWeatherIcon = (iconCode) => {
    switch (iconCode) {
      case '01d': return '☀️';
      case '01n': return '🌙';
      case '02d': case '02n': return '⛅';
      case '03d': case '03n': case '04d': case '04n': return '☁️';
      case '09d': case '09n': return '🌧️';
      case '10d': case '10n': return '🌦️';
      case '11d': case '11n': return '⛈️';
      case '13d': case '13n': return '❄️';
      case '50d': case '50n': return '🌫️';
      default: return '🌤️';
    }
  };

  const getWeatherDescription = (mainWeather) => {
    switch (mainWeather.toLowerCase()) {
      case 'clear': return 'Clear Sky';
      case 'clouds': return 'Cloudy';
      case 'rain': return 'Rainy';
      case 'drizzle': return 'Drizzle';
      case 'thunderstorm': return 'Thunderstorm';
      case 'snow': return 'Snowy';
      case 'mist': return 'Misty';
      case 'fog': return 'Foggy';
      default: return mainWeather;
    }
  };

  const tempUnit = units === 'metric' ? '°C' : '°F';
  const speedUnit = units === 'metric' ? 'm/s' : 'mph';
  const visibilityUnit = units === 'metric' ? 'm' : 'ft';

  const timestamp = new Date(dt * 1000);
  const timeString = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = timestamp.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="weather-card weather-card-glass">
      <div className="weather-content">
        <h2 className="weather-title">{name}, {sys.country}</h2>
        <p className="weather-time">{dateString} at {timeString}</p>
        
        <div className="weather-icon-wrapper">
          <div className="animated-icon-container">
            <span className="weather-icon">{getWeatherIcon(weather[0].icon)}</span>
          </div>
        </div>
        
        <p className="weather-condition">{getWeatherDescription(weather[0].main)}</p>
        <h3 className="weather-temp">{Math.round(main.temp)}{tempUnit}</h3>
        
        <div className="weather-details">
          <div className="weather-detail-item">
            <span className="detail-icon">🌡️</span>
            <span className="detail-label">Feels Like</span>
            <span className="detail-value">{Math.round(main.feels_like)}{tempUnit}</span>
          </div>
          
          <div className="weather-detail-item">
            <span className="detail-icon">💧</span>
            <span className="detail-label">Humidity</span>
            <span className="detail-value">{main.humidity}%</span>
          </div>
          
          <div className="weather-detail-item">
            <span className="detail-icon">💨</span>
            <span className="detail-label">Wind Speed</span>
            <span className="detail-value">{wind.speed}{speedUnit}</span>
          </div>
          
          <div className="weather-detail-item">
            <span className="detail-icon">👁️</span>
            <span className="detail-label">Visibility</span>
            <span className="detail-value">{visibility ? Math.round(visibility / (units === 'metric' ? 1 : 0.3048)) : 'N/A'}{visibilityUnit}</span>
          </div>
          
          <div className="weather-detail-item">
            <span className="detail-icon">🔽</span>
            <span className="detail-label">Pressure</span>
            <span className="detail-value">{main.pressure} hPa</span>
          </div>
          
          <div className="weather-detail-item">
            <span className="detail-icon">🌅</span>
            <span className="detail-label">Sunrise</span>
            <span className="detail-value">{new Date(sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;