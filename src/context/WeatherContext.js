import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiConfig from '../config/api';

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
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  });

  const [units, setUnits] = useState(() => {
    return localStorage.getItem('units') || 'metric';
  });

  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('searchHistory');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
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

  const addToHistory = useCallback((city) => {
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== city.toLowerCase());
      const updated = [city, ...filtered].slice(0, 10);
      localStorage.setItem('searchHistory', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  }, []);

  const fetchWeather = useCallback(async (city) => {
    setLoading(true);
    setError(null);
    setAlerts([]);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      apiConfig.validateConfig();
      
      let url;
      if (city.includes(',')) {
        const [lat, lon] = city.split(',');
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiConfig.weatherApiKey}&units=${units}`;
      } else {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiConfig.weatherApiKey}&units=${units}`;
      }
      
      const response = await fetch(url, { signal: controller.signal });
      
      const data = await response.json();
      
      if (data.cod === '404' || data.cod === 404) {
        throw new Error('City not found. Please check the name and try again.');
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch weather data');
      }
      
      setWeatherData(data);

      // Store alerts if present
      if (data.alerts && Array.isArray(data.alerts)) {
        setAlerts(data.alerts);
      }

      // Add to search history only for city name searches (not coordinates)
      if (!city.includes(',')) {
        addToHistory(city);
      }
      
      let forecastUrl;
      if (city.includes(',')) {
        const [lat, lon] = city.split(',');
        forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiConfig.weatherApiKey}&units=${units}`;
      } else {
        forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiConfig.weatherApiKey}&units=${units}`;
      }
      
      const forecastResponse = await fetch(forecastUrl, { signal: controller.signal });
      const forecastJson = await forecastResponse.json();
      
      if (forecastResponse.ok) {
        setForecastData(forecastJson);
      }
      
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timed out');
      } else {
        setError(err.message);
      }
      console.error('Error fetching weather:', err);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }, [units, addToHistory]);

  const value = {
    currentTheme,
    toggleTheme,
    units,
    toggleUnits,
    weatherData,
    forecastData,
    loading,
    error,
    fetchWeather,
    alerts,
    searchHistory,
    addToHistory,
    clearHistory
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};

export default WeatherContext;