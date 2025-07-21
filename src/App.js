import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import Weather from './components/Weather';
import Footer from './components/Footer'; // ✅ Footer import
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);

  const fetchWeather = async (city) => {
    try {
      const apiKey = 'e64012cc766bb8fab1edd4cbc3fb5eaf';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();
      if (data.cod === 200) {
        setWeatherData(data);
      } else {
        alert('City not found');
      }
    } catch (error) {
      alert('Failed to fetch weather data');
    }
  };

  return (
    <div className="App bg-dark text-light min-vh-100 d-flex flex-column">
      <div className="container flex-grow-1">
        <h1 className="text-center mb-4">🌤️ SkyCast</h1>
        <SearchBar onSearch={fetchWeather} />
        {weatherData && <Weather data={weatherData} />}
      </div>
      <Footer /> {/* ✅ Footer here */}
    </div>
  );
}

export default App;
