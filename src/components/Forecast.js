import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog, WiNightClear, WiNightCloudy } from 'react-icons/wi';
import './Forecast.css';

const getWeatherIcon = (condition) => {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
    return <WiThunderstorm className="forecast-icon" />;
  } else if (conditionLower.includes('drizzle') || conditionLower.includes('rain')) {
    return <WiRain className="forecast-icon" />;
  } else if (conditionLower.includes('snow') || conditionLower.includes('blizzard')) {
    return <WiSnow className="forecast-icon" />;
  } else if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
    return <WiDaySunny className="forecast-icon" />;
  } else if (conditionLower.includes('cloud')) {
    return <WiCloudy className="forecast-icon" />;
  } else if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
    return <WiFog className="forecast-icon" />;
  } else if (conditionLower.includes('night')) {
    return <WiNightClear className="forecast-icon" />;
  }
  
  return <WiDaySunny className="forecast-icon" />;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

const groupForecastsByDay = (list) => {
  const grouped = {};
  
  list.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    
    if (!grouped[date]) {
      grouped[date] = {
        date: item.dt * 1000,
        temps: [],
        conditions: [],
        icon: item.weather[0].main
      };
    }
    
    grouped[date].temps.push(item.main.temp);
    grouped[date].conditions.push(item.weather[0].description);
  });
  
  return Object.values(grouped).map(day => ({
    date: day.date,
    tempMax: Math.max(...day.temps),
    tempMin: Math.min(...day.temps),
    condition: day.icon,
    description: day.conditions[0]
  })).slice(0, 5);
};

function Forecast({ lat, lon, units }) {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lat || !lon) return;

    const fetchForecast = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
        const unitParam = units === 'metric' ? 'metric' : 'imperial';
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unitParam}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch forecast data');
        }
        
        const data = await response.json();
        const groupedData = groupForecastsByDay(data.list);
        setForecastData(groupedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [lat, lon, units]);

  if (loading) {
    return (
      <div className="forecast-container">
        <h3 className="forecast-title">5-Day Forecast</h3>
        <div className="forecast-grid">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="forecast-card loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="forecast-loading"></div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="forecast-container">
        <h3 className="forecast-title">5-Day Forecast</h3>
        <div className="forecast-error">{error}</div>
      </div>
    );
  }

  if (!forecastData || forecastData.length === 0) {
    return null;
  }

  return (
    <div className="forecast-container">
      <h3 className="forecast-title">5-Day Forecast</h3>
      <div className="forecast-grid">
        {forecastData.map((day, index) => (
          <motion.div
            key={day.date}
            className="forecast-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="forecast-date">{formatDate(day.date)}</div>
            <div className="forecast-icon-wrapper">
              {getWeatherIcon(day.condition)}
            </div>
            <div className="forecast-condition">{day.condition}</div>
            <div className="forecast-temps">
              <span className="forecast-temp-high">{Math.round(day.tempMax)}°</span>
              <span className="forecast-temp-low">{Math.round(day.tempMin)}°</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Forecast;
