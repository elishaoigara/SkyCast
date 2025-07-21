import React from 'react';
import './Weather.css';
import Clouds from './Clouds';

function Weather({ data }) {
  const { name, sys, main, weather, wind, dt } = data;

  // Get local time (convert from UNIX timestamp)
  const now = new Date(dt * 1000);
  const isDay = dt > sys.sunrise && dt < sys.sunset;
  const condition = weather[0].main.toLowerCase();

  // Generate a class name for background based on weather and time
  const bgClass = `${condition}-${isDay ? 'day' : 'night'}`; // e.g. 'clear-day'

  return (
    <div className={`card weather-card text-white shadow p-4 my-4 ${bgClass}`}>
      <h2 className="mb-3">{name}, {sys.country}</h2>
      <h4 className="text-capitalize mb-3">
        <i className="bi bi-cloud-sun me-2"></i>{weather[0].description}
      </h4>
      <div className="row">
        <div className="col-md-4">
          <p className="fs-5">🌡️ <strong>Temperature:</strong> {main.temp}°C</p>
        </div>
        <div className="col-md-4">
          <p className="fs-5">💧 <strong>Humidity:</strong> {main.humidity}%</p>
        </div>
        <div className="col-md-4">
          <p className="fs-5">🌬️ <strong>Wind Speed:</strong> {wind.speed} m/s</p>
        </div>
      </div>
      <p className="mt-3">
        🕒 <strong>Local Time:</strong> {now.toLocaleTimeString()} ({now.toDateString()})
      </p>
    </div>
  );
}

export default Weather;
