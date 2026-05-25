import React from 'react';
import { motion } from 'framer-motion';
import { WiThunderstorm, WiSnow, WiFog, WiDaySunny, WiNightClear, WiCloudy } from 'react-icons/wi';
import './Weather.css';

const AnimatedWeatherIcon = ({ condition, isDay }) => {
  const cond = condition.toLowerCase();

  // Rain animation
  if (cond.includes('drizzle') || cond.includes('rain')) {
    return (
      <div className="animated-icon-container rain-icon">
        {Array.from({ length: 7 }, (_, i) => (
          <motion.div
            key={i}
            className="rain-drop"
            style={{ left: `${15 + i * 12}%` }}
            animate={{ y: [0, 60], opacity: [0, 1, 0] }}
            transition={{
              duration: 0.8 + Math.random() * 0.4,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
    );
  }

  // Clear / Sunny animation
  if ((cond.includes('clear') || cond.includes('sunny')) && isDay) {
    return (
      <div className="animated-icon-container sun-icon">
        <motion.div
          className="sun-glow"
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="sun-core"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <WiDaySunny className="weather-icon sun-icon-inner" />
        </motion.div>
      </div>
    );
  }

  // Clouds animation
  if (cond.includes('cloud')) {
    return (
      <div className="animated-icon-container cloud-icon">
        <motion.div
          className="cloud-shape cloud-1"
          animate={{ x: [-5, 5, -5] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <WiCloudy className="weather-icon cloud-icon-inner" />
        </motion.div>
        <motion.div
          className="cloud-shape cloud-2"
          animate={{ x: [3, -3, 3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <WiCloudy className="weather-icon cloud-icon-inner cloud-secondary" />
        </motion.div>
      </div>
    );
  }

  // Thunderstorm
  if (cond.includes('thunder') || cond.includes('storm')) {
    return (
      <div className="animated-icon-container thunder-icon">
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <WiThunderstorm className="weather-icon" />
        </motion.div>
      </div>
    );
  }

  // Snow
  if (cond.includes('snow') || cond.includes('blizzard')) {
    return (
      <div className="animated-icon-container snow-icon">
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <WiSnow className="weather-icon" />
        </motion.div>
      </div>
    );
  }

  // Fog / Mist
  if (cond.includes('fog') || cond.includes('mist') || cond.includes('haze')) {
    return (
      <div className="animated-icon-container fog-icon">
        <motion.div
          animate={{ x: [-3, 3, -3], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <WiFog className="weather-icon" />
        </motion.div>
      </div>
    );
  }

  // Fallback with subtle pulse
  return (
    <div className="animated-icon-container fallback-icon">
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {isDay ? (
          <WiDaySunny className="weather-icon" />
        ) : (
          <WiNightClear className="weather-icon" />
        )}
      </motion.div>
    </div>
  );
};

function Weather({ data, units }) {
  const { name, sys, main, weather, wind, dt } = data;

  const now = new Date(dt * 1000);
  const isDay = dt > sys.sunrise && dt < sys.sunset;
  const condition = weather[0].Main.toLowerCase();
  const unitSymbol = units === 'metric' ? '°C' : '°F';

  return (
    <motion.div
      className="weather-card-glass weather-card text-white shadow p-4 my-4"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="weather-content">
        <h2 className="mb-3 text-center weather-title">{name}, {sys.country}</h2>

        <div className="weather-main-info d-flex flex-column align-items-center mb-4">
          <AnimatedWeatherIcon condition={condition} isDay={isDay} />
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
    </motion.div>
  );
}

export default Weather;
