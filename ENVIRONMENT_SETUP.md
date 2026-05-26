# Environment Setup

## API Key Configuration

1. Get your free API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Create a `.env.local` file in the root directory (this file is git-ignored)
3. Add your API key:

```env
REACT_APP_WEATHER_API_KEY=your_actual_api_key_here
```

⚠️ **Important**: Never commit your actual API key to version control. The `.env.local` file is already included in `.gitignore`.

## Running the Application

```bash
npm install
npm start
```

The application will run on http://localhost:3000