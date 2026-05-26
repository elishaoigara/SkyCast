import React, { useState, useEffect, useCallback } from 'react';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import SearchBar from './components/SearchBar';
import Weather from './components/Weather';
import Forecast from './components/Forecast';
import ThemeToggle from './components/ThemeToggle';
import UnitToggle from './components/UnitToggle';
import Footer from './components/Footer';
import AtmosphericBackground from './components/AtmosphericBackground';
import './App.css';

function AppContent() {
  const {
    currentTheme,
    toggleTheme,
    units,
    toggleUnits,
    weatherData,
    forecastData,
    loading,
    error,
    fetchWeather
  } = useWeather();
  
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    if (!process.env.REACT_APP_WEATHER_API_KEY) {
      console.warn(
        'WARNING: REACT_APP_WEATHER_API_KEY is not set. ' +
        'Please create a .env file with REACT_APP_WEATHER_API_KEY=your_api_key'
      );
    }
  }, []);

  const handleSearch = useCallback(async (city) => {
    try {
      await fetchWeather(city);
    } catch (err) {
      console.error('Error searching for city:', err);
    }
  }, [fetchWeather]);

  const handleLocationFound = useCallback(async (position) => {
    setGeoLoading(true);
    try {
      const { latitude, longitude } = position.coords;
      await fetchWeather(`${latitude},${longitude}`);
    } catch (err) {
      console.error('Error getting location:', err);
    } finally {
      setGeoLoading(false);
    }
  }, [fetchWeather]);

  return (
    <div className="min-vh-100 d-flex flex-column">
      <AtmosphericBackground />
      
      <header className="bg-dark text-white py-3 shadow-sm">
        <div className="container d-flex justify-content-between align-items-center">
          <h1 className="mb-0">SkyCast</h1>
          <div className="d-flex gap-3">
            <ThemeToggle currentTheme={currentTheme} onToggle={toggleTheme} />
            <UnitToggle units={units} onToggle={toggleUnits} />
          </div>
        </div>
      </header>

      <main className="flex-grow-1 container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <SearchBar 
              onSearch={handleSearch} 
              loading={loading} 
              geoLoading={geoLoading} 
              onLocationFound={handleLocationFound} 
            />
            
            {loading && (
              <div className="d-flex justify-content-center my-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            
            {error && (
              <div className="alert alert-danger mt-3">
                {error}
              </div>
            )}
            
            {weatherData && (
              <Weather data={weatherData} units={units} />
            )}
            
            {forecastData && (
              <Forecast 
                lat={weatherData?.coord?.lat} 
                lon={weatherData?.coord?.lon} 
                units={units} 
              />
            )}
          </div>
        </div>
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