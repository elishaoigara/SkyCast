import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import Weather from './components/Weather';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [cityNotFound, setCityNotFound] = useState(false);

  const fetchWeather = async (city) => {
    try {
      const apiKey = 'e64012cc766bb8fab1edd4cbc3fb5eaf';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();
      if (data.cod === 200) {
        setWeatherData(data);
        setCityNotFound(false);
      } else {
        setWeatherData(null);
        setCityNotFound(true);
      }
    } catch (error) {
      setWeatherData(null);
      setCityNotFound(true);
    }
  };

  return (
    <div className="App galaxy-bg text-light min-vh-100 d-flex flex-column">
      <div className="container py-5 flex-grow-1">
        <h1 className="text-center mb-4">🌌 SkyCast</h1>
        <SearchBar onSearch={fetchWeather} />

        {cityNotFound && (
          <div className="card bg-dark text-light shadow-lg border-danger my-4">
            <div className="card-body text-center">
              <h2 className="text-danger">🚫 City Not Found</h2>
              <p>We couldn’t find the city you entered.</p>
              <p>Please check the spelling and try again.</p>
            </div>
          </div>
        )}

        {weatherData && !cityNotFound && <Weather data={weatherData} />}
      </div>
      <Footer />
    </div>
  );
}

export default App;
