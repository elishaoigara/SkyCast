import React, { useState } from 'react';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import SearchBar from './components/SearchBar';
import Weather from './components/Weather';
import Forecast from './components/Forecast';
import ThemeToggle from './components/ThemeToggle';
import UnitToggle from './components/UnitToggle';
import Footer from './components/Footer';
import AtmosphericBackground from './components/AtmosphericBackground';
import './App.css';

// Main App component wrapped with WeatherProvider
function App() {
  return (
    <WeatherProvider>
      <AppContent />
    </WeatherProvider>
  );
}

// Content component that uses the WeatherContext
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

  const handleSearch = async (city) => {
    try {
      await fetchWeather(city);
    } catch (err) {
      console.error('Error searching for city:', err);
    }
  };

  const handleLocationFound = async (position) => {
    setGeoLoading(true);
    try {
      const { latitude, longitude } = position.coords;
      await fetchWeather(`${latitude},${longitude}`);
    } catch (err) {
      console.error('Error getting location:', err);
    } finally {
      setGeoLoading(false);
    }
  };

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

export default App;