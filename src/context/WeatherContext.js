import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const WeatherContext = createContext();

// Custom hook to use the weather context
export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

// Provider component
export const WeatherProvider = ({ children }) => {
  // State for theme (dark/light)
  const [currentTheme, setCurrentTheme] = useState(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  });

  // State for units (metric/imperial)
  const [units, setUnits] = useState(() => {
    return localStorage.getItem('units') || 'metric';
  });

  // State for weather data
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  // Save units preference
  useEffect(() => {
    localStorage.setItem('units', units);
  }, [units]);

  // Toggle theme function
  const toggleTheme = () => {
    setCurrentTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Toggle units function
  const toggleUnits = () => {
    setUnits(prev => prev === 'metric' ? 'imperial' : 'metric');
  };

  // Fetch weather data
  const fetchWeather = async (city) => {
    setLoading(true);
    setError(null);
    
    try {
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
      
      if (!apiKey) {
        throw new Error('API key missing: set REACT_APP_WEATHER_API_KEY in .env');
      }
      
      // Determine if input is coordinates or city name
      let url;
      if (city.includes(',')) {
        // Coordinates format: "lat,lon"
        const [lat, lon] = city.split(',');
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
      } else {
        // City name
        url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${units}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.cod === '404' || data.cod === 404) {
        throw new Error('City not found. Please check the name and try again.');
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch weather data');
      }
      
      setWeatherData(data);
      
      // Also fetch forecast data
      let forecastUrl;
      if (city.includes(',')) {
        const [lat, lon] = city.split(',');
        forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
      } else {
        forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${units}`;
      }
      
      const forecastResponse = await fetch(forecastUrl);
      const forecastJson = await forecastResponse.json();
      
      if (forecastResponse.ok) {
        setForecastData(forecastJson);
      }
      
    } catch (err) {
      setError(err.message);
      console.error('Error fetching weather:', err);
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    currentTheme,
    toggleTheme,
    units,
    toggleUnits,
    weatherData,
    forecastData,
    loading,
    error,
    fetchWeather
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};

export default WeatherContext;
