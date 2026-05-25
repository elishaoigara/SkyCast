import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import Weather from './components/Weather';
import Forecast from './components/Forecast';
import ErrorDisplay from './components/ErrorDisplay';
import Skeleton from './components/Skeleton';
import ThemeToggle from './components/ThemeToggle';
import UnitToggle from './components/UnitToggle';
import Footer from './components/Footer';
import AtmosphericBackground from './components/AtmosphericBackground';
import './App.css';

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState('');
  const [units, setUnits] = useState('metric');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const fetchWeather = async (city) => {
    setLoading(true);
    setError('');
    try {
      const weatherRes = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: city,
          appid: API_KEY,
          units,
        },
      });
      setWeatherData(weatherRes.data);

      const forecastRes = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          q: city,
          appid: API_KEY,
          units,
        },
      });
      setForecastData(forecastRes.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('City not found. Please try again.');
      } else if (err.response?.status === 401) {
        setError('API key error. Check your configuration.');
      } else {
        setError('Failed to fetch weather data. Please try again later.');
      }
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationFound = (location) => {
    setGeoLoading(true);
    fetchWeather(`${location.lat},${location.lon}`)
      .finally(() => setGeoLoading(false));
  };

  // Determine current condition for background
  const currentCondition = weatherData?.weather?.[0]?.main?.toLowerCase() || 'clear';

  return (
    <div className="min-vh-100 d-flex flex-column">
      <AtmosphericBackground condition={currentCondition} />
      
      <header className="py-3 px-3">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="mb-0 text-white fw-bold">🌤️ SkyCast</h1>
          <div className="d-flex gap-2">
            <UnitToggle units={units} onToggle={() => {
              setUnits(prev => prev === 'metric' ? 'imperial' : 'metric');
              if (weatherData) {
                fetchWeather(weatherData.name);
              }
            }} />
            <ThemeToggle theme={theme} onToggle={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')} />
          </div>
        </div>
      </header>

      <main className="flex-grow-1 container py-3">
        <SearchBar 
          onSearch={fetchWeather} 
          loading={loading} 
          geoLoading={geoLoading}
          onLocationFound={handleLocationFound}
        />

        {loading && <Skeleton />}
        
        {error && <ErrorDisplay message={error} />}
        
        {weatherData && !loading && (
          <>
            <Weather data={weatherData} units={units} />
            <Forecast data={forecastData} units={units} />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
