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
    setError
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};

export default WeatherContext;
