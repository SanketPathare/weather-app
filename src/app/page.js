'use client';

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import dynamic from 'next/dynamic';
import { Loader2, AlertTriangle, MapPin } from "lucide-react";
import {
  fetchWeatherData,
  fetchForecastData,
  fetchAirQualityData,
} from "../../utils/api";

// Dynamically import components that might use browser APIs
const SearchBar = dynamic(() => import("@/components/SearchBar"), {
  ssr: false
});

const CurrentWeather = dynamic(() => import("@/components/CurrentWeather"), {
  ssr: false
});

const WeatherCharts = dynamic(() => import("@/components/WeatherCharts"), {
  ssr: false
});

const ForecastDisplay = dynamic(() => import("@/components/ForecastDisplay"), {
  ssr: false
});

const WeatherMap = dynamic(() => import("@/components/WeatherMap"), {
  ssr: false
});

const AirQuality = dynamic(() => import("@/components/AirQuality"), {
  ssr: false
});

function ClientOnlyPortal({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return children;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("metric");

  useEffect(() => {
    // Initialize app settings from localStorage
    const initializeApp = () => {
      const storedUnit = localStorage.getItem("preferredUnit");
      if (storedUnit) {
        setUnit(storedUnit);
      }

      const lastSearched = localStorage.getItem("lastSearchedLocation");
      if (lastSearched) {
        handleSearch(lastSearched);
      } else {
        getUserLocation();
      }
    };

    initializeApp();
  }, []);

  const getUserLocation = async () => {
    setLocationLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser. Please search for a city.");
      setLocationLoading(false);
      handleFallbackLocation();
      return;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      });

      const { latitude, longitude } = position.coords;
      setCurrentLocation({ lat: latitude, lon: longitude });

      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
        );
        const data = await response.json();

        if (data && data[0]) {
          const locationName = data[0].name;
          handleSearch(locationName);
        } else {
          handleSearch(`${latitude},${longitude}`);
        }
      } catch (error) {
        handleSearch(`${latitude},${longitude}`);
      }
    } catch (error) {
      let errorMessage = "Unable to get current location. ";

      switch (error.code) {
        case 1:
          errorMessage += "Location permission was denied. Please enable location services or search for a city.";
          break;
        case 2:
          errorMessage += "Location information is unavailable. Please try searching for a city instead.";
          break;
        case 3:
          errorMessage += "Location request timed out. Please try again or search for a city.";
          break;
        default:
          errorMessage += "Please try searching for a city instead.";
      }

      setError(errorMessage);
      handleFallbackLocation();
    } finally {
      setLocationLoading(false);
    }
  };

  const handleFallbackLocation = () => {
    const defaultCity = "Pune";
    console.log(`Falling back to default location: ${defaultCity}`);
    handleSearch(defaultCity);
  };

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);

    try {
      const weather = await fetchWeatherData(query, unit);
      const forecast = await fetchForecastData(query, unit);
      const airQuality = await fetchAirQualityData(
        weather.coord.lat,
        weather.coord.lon
      );

      setWeatherData(weather);
      setForecastData(forecast);
      setAirQualityData(airQuality);
      setSearchQuery(query);
      setCurrentLocation({ lat: weather.coord.lat, lon: weather.coord.lon });
      localStorage.setItem("lastSearchedLocation", query);
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError(
        err.response?.status === 404
          ? "Location not found. Please check the city name and try again."
          : "Unable to fetch weather data. Please try again later."
      );
      localStorage.removeItem("lastSearchedLocation");
    } finally {
      setLoading(false);
    }
  };

  const toggleUnit = () => {
    const newUnit = unit === "metric" ? "imperial" : "metric";
    setUnit(newUnit);
    localStorage.setItem("preferredUnit", newUnit);
    if (weatherData) {
      handleSearch(searchQuery);
    }
  };

  return (
    <ClientOnlyPortal>
      <div className="bg-gray-900 text-white min-h-screen">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h1 className="text-3xl font-bold mb-4 sm:mb-0">Weather App</h1>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Suspense fallback={<div>Loading...</div>}>
                <SearchBar onSearch={handleSearch} />
              </Suspense>
              <div className="flex gap-5">
                <button
                  onClick={getUserLocation}
                  disabled={locationLoading}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-green-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md focus:outline-none flex items-center"
                >
                  {locationLoading ? (
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  ) : (
                    <MapPin className="h-4 w-4 mr-2" />
                  )}
                  {locationLoading ? "Getting Location..." : "Use My Location"}
                </button>
                <button
                  onClick={toggleUnit}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none"
                >
                  Switch to {unit === "metric" ? "°F" : "°C"}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-md mb-6 flex items-center">
              <AlertTriangle className="mr-2 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {loading && (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin h-8 w-8" />
            </div>
          )}

          {weatherData && !loading && (
            <div className="grid grid-cols-1 gap-6">
              <Suspense fallback={<div>Loading weather data...</div>}>
                <CurrentWeather weatherData={weatherData} unit={unit} />
                <WeatherCharts weatherData={weatherData} unit={unit} />
              </Suspense>
            </div>
          )}

          {forecastData && !loading && (
            <Suspense fallback={<div>Loading forecast...</div>}>
              <ForecastDisplay forecastData={forecastData} unit={unit} />
            </Suspense>
          )}

          {airQualityData && !loading && (
            <Suspense fallback={<div>Loading air quality data...</div>}>
              <AirQuality airQualityData={airQualityData} />
            </Suspense>
          )}

          {currentLocation && !loading && (
            <Suspense fallback={<div>Loading map...</div>}>
              <WeatherMap location={currentLocation} weatherData={weatherData} />
            </Suspense>
          )}
        </div>
        <footer className="py-6">
          <div className="text-center text-sm text-gray-400">
            Developed by{" "}
            <Link
              href="https://github.com/sanketpathare"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-400 transition-colors"
            >
              Sanket Pathare
            </Link>
          </div>
        </footer>
      </div>
    </ClientOnlyPortal>
  );
}