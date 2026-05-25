import React, { useState, useEffect, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import Weather from './components/Weather';
import Forecast from './components/Forecast';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';
import UnitToggle from './components/UnitToggle';
import ErrorDisplay from './components/ErrorDisplay';
import { WeatherCardSkeleton, ForecastCardSkeleton } from './components/Skeleton';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function AppContent() {
  const {
    currentTheme,
    toggleTheme,
    units,
    toggleUnits,
    weatherData,
    setWeatherData,
    loading,
    setLoading,
    error,
    setError
  } = useWeather();

  const [cityNotFound, setCityNotFound] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [location, setLocation] = useState({ lat: null, lon: null, name: '' });

  const fetchWeather = useCallback(async (city, lat = null, lon = null) => {
    setLoading(true);
    setError(null);
    setCityNotFound(false);

    try {
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
      const unitParam = units === 'metric' ? 'metric' : 'imperial';
      
      let url;
      if (lat !== null && lon !== null) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unitParam}`;
      } else {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unitParam}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === 200) {
        setWeatherData(data);
        setCityNotFound(false);
        setLocation({
          lat: data.coord.lat,
          lon: data.coord.lon,
          name: `${data.name}, ${data.sys.country}`
        });
      } else {
        setWeatherData(null);
        setCityNotFound(true);
        setError(data.message || 'City not found');
      }
    } catch (err) {
      setWeatherData(null);
      setCityNotFound(true);
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }, [units, setWeatherData, setError, setLoading]);

  // Refetch weather when units change
  useEffect(() => {
    if (location.lat && location.lon) {
      fetchWeather(null, location.lat, location.lon);
    }
  }, [units, location.lat, location.lon]);

  const handleLocationFound = (loc) => {
    setGeoLoading(true);
    setLocation(loc);
    fetchWeather(null, loc.lat, loc.lon);
    setGeoLoading(false);
  };

  const handleRetry = () => {
    if (location.lat && location.lon) {
      fetchWeather(null, location.lat, location.lon);
    }
  };

  return (
    <div className={`App galaxy-bg min-vh-100 d-flex flex-column`} data-theme={currentTheme}>
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <h1 className="app-title">🌌 SkyCast</h1>
            <div className="header-controls">
              <UnitToggle units={units} onToggle={toggleUnits} />
              <ThemeToggle currentTheme={currentTheme} onToggle={toggleTheme} />
            </div>
          </div>
        </div>
      </header>

      <main className="container py-4 flex-grow-1">
        <SearchBar 
          onSearch={fetchWeather} 
          loading={loading}
          geoLoading={geoLoading}
          onLocationFound={handleLocationFound}
        />

        {error && !loading && (
          <ErrorDisplay message={error} onRetry={handleRetry} />
        )}

        {cityNotFound && !error && (
          <div className="card bg-dark text-light shadow-lg border-danger my-4">
            <div className="card-body text-center">
              <h2 className="text-danger">🚫 City Not Found</h2>
              <p>We couldn't find the city you entered.</p>
              <p>Please check the spelling and try again.</p>
            </div>
          </div>
        )}

        {loading ? (
          <>
            <WeatherCardSkeleton />
            <div className="forecast-container">
              <h3 className="forecast-title">5-Day Forecast</h3>
              <div className="forecast-grid">
                {[...Array(5)].map((_, i) => (
                  <ForecastCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {weatherData && !cityNotFound && (
              <>
                <Weather data={weatherData} units={units} />
                <Forecast lat={location.lat} lon={location.lon} units={units} />
              </>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <WeatherProvider>
      <AppContent />
    </WeatherProvider>
  );
}

export default App;
