import React, { useState, useEffect, useCallback } from 'react';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import SearchBar from './components/SearchBar';
import Weather from './components/Weather';
import Forecast from './components/Forecast';
import ThemeToggle from './components/ThemeToggle';
import UnitToggle from './components/UnitToggle';
import Footer from './components/Footer';
import AtmosphericBackground from './components/AtmosphericBackground';
import apiConfig from './config/api';
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
    fetchWeather,
    alerts
  } = useWeather();
  
  const [geoLoading, setGeoLoading] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

  useEffect(() => {
    try {
      apiConfig.validateConfig();
    } catch (err) {
      console.warn(err.message);
    }
  }, []);

  const handleSearch = useCallback(async (city) => {
    try {
      await fetchWeather(city);
    } catch (err) {
      console.error('Error searching for city:', err);
    }
  }, [fetchWeather]);

  const handleLocationFound = useCallback(async ({ lat, lon }) => {
    setGeoLoading(true);
    try {
      await fetchWeather(`${lat},${lon}`);
    } catch (err) {
      console.error('Error getting location:', err);
    } finally {
      setGeoLoading(false);
    }
  }, [fetchWeather]);

  const dismissAlert = useCallback((index) => {
    setDismissedAlerts(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  const visibleAlerts = alerts?.filter((_, i) => !dismissedAlerts.has(i)) || [];

  return (
    <div className="min-vh-100 d-flex flex-column">
      <AtmosphericBackground condition={weatherData?.weather?.[0]?.main?.toLowerCase()} />
      
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

            {visibleAlerts.length > 0 && (
              <div className="mt-3">
                {visibleAlerts.map((alert, idx) => {
                  const originalIndex = alerts.indexOf(alert);
                  return (
                    <div
                      key={`${alert.event}-${originalIndex}`}
                      className="alert alert-warning alert-dismissible fade show"
                      role="alert"
                    >
                      <strong>⚠️ {alert.event}</strong>
                      {alert.sender_name && (
                        <span className="d-block small text-muted">Source: {alert.sender_name}</span>
                      )}
                      <p className="mb-0 mt-1">{alert.description}</p>
                      <button
                        type="button"
                        className="btn-close"
                        aria-label="Dismiss alert"
                        onClick={() => dismissAlert(originalIndex)}
                      />
                    </div>
                  );
                })}
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