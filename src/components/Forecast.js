import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import apiConfig from '../config/api';

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
      <div className="text-center my-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading forecast...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-warning mt-3">
        Unable to load forecast: {error}
      </div>
    );
  }

  if (!forecast || forecast.length === 0) {
    return null;
  }

  return (
    <motion.div 
      className="glass-card p-4 mt-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="mb-3">5-Day Forecast</h3>
      <div className="row g-3">
        {forecast.map((day, index) => (
          <motion.div 
            key={day.dt}
            className="col-6 col-md-4 col-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="forecast-day text-center p-3 rounded">
              <div className="fw-bold mb-2">{formatDate(day.dt_txt)}</div>
              <img 
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt={day.weather[0].description}
                className="mb-2"
              />
              <div className="fs-4 fw-bold">
                {formatTemp(day.main.temp)}°
              </div>
              <div className="small text-muted">
                {day.weather[0].main}
              </div>
              <div className="small mt-1">
                H: {formatTemp(day.main.temp_max)}° L: {formatTemp(day.main.temp_min)}°
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default React.memo(Forecast);