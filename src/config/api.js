const config = {
  weatherApiKey: process.env.REACT_APP_WEATHER_API_KEY,
  weatherApiBaseUrl: 'https://api.openweathermap.org/data/2.5',
  
  validateConfig() {
    if (!this.weatherApiKey) {
      throw new Error(
        'Weather API key is missing. Please set REACT_APP_WEATHER_API_KEY environment variable.'
      );
    }
    return true;
  }
};

export default config;