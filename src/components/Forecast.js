import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import apiConfig from '../config/api';
import './Forecast.css';

const Forecast = ({ lat, lon, units }) => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchForecast = useCallback(async (signal) => {
    if (!lat || !lon) return;

    setLoading(true);
    setError(null);

    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiConfig.weatherApiKey}&units=${units}`;
      
      const response = await fetch(url, { signal });
      const data = await response.json();
      
      if (response.ok) {
        // Group forecast by day and get one entry per day
        const dailyForecasts = {};
        data.list.forEach(item => {
          const date = item.dt_txt.split(' ')[0];
          if (!dailyForecasts[date]) {
            dailyForecasts[date] = item;
          }
        });
        
        // Convert to array and take next 5 days
        const forecastArray = Object.values(dailyForecasts).slice(1, 6);
        setForecast(forecastArray);
      } else {
        setError(data.message || 'Failed to fetch forecast');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
        console.error('Error fetching forecast:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [lat, lon, units]);

  useEffect(() => {
    const controller = new AbortController();
    
    fetchForecast(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchForecast]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTemp = (temp) => {
    return Math.round(temp);
  };

  if (loading) {
    return (
      <div className="forecast-container">
        <div className="forecast-loading"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="forecast-container">
        <div className="forecast-error">
          Unable to load forecast: {error}
        </div>
      </div>
    );
  }

  if (!forecast || forecast.length === 0) {
    return null;
  }

  return (
    <motion.div 
      className="forecast-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="forecast-title">5-Day Forecast</h3>
      <div className="forecast-grid">
        {forecast.map((day, index) => (
          <motion.div 
            key={day.dt}
            className="forecast-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="forecast-date">{formatDate(day.dt_txt)}</div>
            <div className="forecast-icon-wrapper">
              <img 
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt={day.weather[0].description}
                className="forecast-icon"
              />
            </div>
            <div className="forecast-condition">
              {day.weather[0].main}
            </div>
            <div className="forecast-temps">
              <span className="forecast-temp-high">{formatTemp(day.main.temp_max)}°</span>
              <span className="forecast-temps-divider"></span>
              <span className="forecast-temp-low">{formatTemp(day.main.temp_min)}°</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default React.memo(Forecast);
