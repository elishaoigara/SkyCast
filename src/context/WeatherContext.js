import React, { createContext, useState, useContext, useEffect } from 'react';

const WeatherContext = createContext();

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

export const WeatherProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'dark';
  });

  const [units, setUnits] = useState(() => {
    const saved = localStorage.getItem('units');
    return saved || 'metric';
  });

  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.setItem('theme', currentTheme);
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem('units', units);
  }, [units]);

  const toggleTheme = () => {
    setCurrentTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleUnits = () => {
    setUnits(prev => prev === 'metric' ? 'imperial' : 'metric');
  };

  const fetchWeather = async (query) => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if query is coordinates
      const isCoordinates = query.includes(',');
      let url;
      
      if (isCoordinates) {
        const [lat, lon] = query.split(',');
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`;
      } else {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=${units}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch weather data');
      }
      
      const data = await response.json();
      setWeatherData(data);
      
      // Fetch forecast data as well
      await fetchForecast(data.coord.lat, data.coord.lon);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching weather data');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchForecast = async (lat, lon) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch forecast data');
      }
      
      const data = await response.json();
      setForecastData(data);
    } catch (err) {
      console.error('Error fetching forecast:', err);
    }
  };

  const value = {
    currentTheme,
    setCurrentTheme,
    toggleTheme,
    units,
    setUnits,
    toggleUnits,
    weatherData,
    setWeatherData,
    forecastData,
    setForecastData,
    loading,
    setLoading,
    error,
    setError,
    fetchWeather,
    fetchForecast
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};

export default WeatherContext;