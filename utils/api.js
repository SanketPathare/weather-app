

export const fetchWeatherData = async (query, unit = 'metric') => {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=${unit}&appid=${apiKey}`
  );
  if (!response.ok) {
    throw new Error('Weather data fetch failed');
  }
  return response.json();
};

export const fetchForecastData = async (query, unit = 'metric') => {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${query}&units=${unit}&appid=${apiKey}`
  );
  if (!response.ok) {
    throw new Error('Forecast data fetch failed');
  }
  return response.json();
};

export const fetchAirQualityData = async (lat, lon) => {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
  );
  if (!response.ok) {
    throw new Error('Air quality data fetch failed');
  }
  return response.json();
};