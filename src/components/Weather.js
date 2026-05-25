import React from 'react';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog, WiNightClear, WiNightCloudy } from 'react-icons/wi';
import './Weather.css';
import Clouds from './Clouds';

const getWeatherIcon = (condition, isDay) => {
  const conditionLower = condition.toLowerCase();
  
  if (!isDay) {
    if (conditionLower.includes('clear')) return <WiNightClear className="weather-icon" />;
    if (conditionLower.includes('cloud')) return <WiNightCloudy className="weather-icon" />;
  }
  
  if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
    return <WiThunderstorm className="weather-icon" />;
  } else if (conditionLower.includes('drizzle') || conditionLower.includes('rain')) {
    return <WiRain className="weather-icon" />;
  } else if (conditionLower.includes('snow') || conditionLower.includes('blizzard')) {
    return <WiSnow className="weather-icon" />;
  } else if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
    return <WiDaySunny className="weather-icon" />;
  } else if (conditionLower.includes('cloud')) {
    return <WiCloudy className="weather-icon" />;
  } else if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
    return <WiFog className="weather-icon" />;
  }
  
  return isDay ? <WiDaySunny className="weather-icon" /> : <WiNightClear className="weather-icon" />;
};

function Weather({ data, units }) {
  const { name, sys, main, weather, wind, dt } = data;

  const now = new Date(dt * 1000);
  const isDay = dt > sys.sunrise && dt < sys.sunset;
  const condition = weather[0].main.toLowerCase();
  const unitSymbol = units === 'metric' ? '°C' : '°F';

  const bgClass = `${condition}-${isDay ? 'day' : 'night'}`;

  return (
    <div className={`card weather-card text-white shadow p-4 my-4 ${bgClass}`}>
      <Clouds />
      
      <div className="weather-content">
        <h2 className="mb-3 text-center weather-title">{name}, {sys.country}</h2>

        <div className="weather-main-info d-flex flex-column align-items-center mb-4">
          <div className="weather-icon-wrapper">
            {getWeatherIcon(condition, isDay)}
          </div>
          <h4 className="text-capitalize text-center weather-condition">
            {weather[0].description}
          </h4>
          <p className="weather-temp mb-0">
            {Math.round(main.temp)}{unitSymbol}
          </p>
        </div>

        <div className="row text-center gy-3 weather-details">
          <div className="col-12 col-md-4">
            <div className="weather-detail-item">
              <span className="detail-icon">🌡️</span>
              <span className="detail-label">Feels Like</span>
              <span className="detail-value">{Math.round(main.feels_like)}{unitSymbol}</span>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="weather-detail-item">
              <span className="detail-icon">💧</span>
              <span className="detail-label">Humidity</span>
              <span className="detail-value">{main.humidity}%</span>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="weather-detail-item">
              <span className="detail-icon">🌬️</span>
              <span className="detail-label">Wind Speed</span>
              <span className="detail-value">{wind.speed} {units === 'metric' ? 'm/s' : 'mph'}</span>
            </div>
          </div>
        </div>

        <div className="row text-center gy-3 mt-3 weather-details">
          <div className="col-6 col-md-3">
            <div className="weather-detail-item">
              <span className="detail-icon">🌡️</span>
              <span className="detail-label">High</span>
              <span className="detail-value">{Math.round(main.temp_max)}{unitSymbol}</span>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="weather-detail-item">
              <span className="detail-icon">🌡️</span>
              <span className="detail-label">Low</span>
              <span className="detail-value">{Math.round(main.temp_min)}{unitSymbol}</span>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="weather-detail-item">
              <span className="detail-icon">🔽</span>
              <span className="detail-label">Pressure</span>
              <span className="detail-value">{main.pressure} hPa</span>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="weather-detail-item">
              <span className="detail-icon">👁️</span>
              <span className="detail-label">Visibility</span>
              <span className="detail-value">{(data.visibility / 1000).toFixed(1)} km</span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center small weather-time">
          🕒 <strong>Local Time:</strong> {now.toLocaleTimeString()} ({now.toDateString()})
        </p>
      </div>
    </div>
  );
}

export default Weather;
