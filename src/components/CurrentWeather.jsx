import {
  Cloud,
  Droplets,
  Wind,
  Sun,
  Sunset,
  Clock,
  Thermometer,
  Compass,
  Eye,
  Gauge,
  CloudRain,
} from "lucide-react";
import { useState, useEffect } from "react";

const CurrentWeather = ({ weatherData, unit }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const tempUnit = unit === "metric" ? "°C" : "°F";
  const windUnit = unit === "metric" ? "m/s" : "mph";
  const visibilityUnit = unit === "metric" ? "km" : "mi";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getSunTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                       'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  const formatVisibility = (visibility) => {
    if (unit === "metric") {
      return (visibility / 1000).toFixed(1);
    }
    return (visibility / 1609.34).toFixed(1);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-xl border border-gray-700">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            Current Weather in {weatherData.name}, {weatherData.sys.country}
          </h2>
          <div className="flex items-center text-gray-200 bg-gray-700/30 p-2 rounded-md">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-base sm:text-lg font-semibold">
              {formatTime(currentTime)}
            </span>
          </div>
        </div>

        {/* Main Weather Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-700/20 rounded-lg">
            <img
              src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
              alt={weatherData.weather[0].description}
              className="w-24 h-24 sm:w-32 sm:h-32"
            />
            <div className="text-center sm:text-left">
              <p className="text-4xl sm:text-5xl font-bold text-gray-100">
                {Math.round(weatherData.main.temp)}
                {tempUnit}
              </p>
              <p className="text-lg sm:text-xl capitalize text-gray-300 mt-2">
                {weatherData.weather[0].description}
              </p>
            </div>
          </div>

          {/* Primary Weather Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center text-gray-300 bg-gray-700/30 p-3 rounded-md">
              <Thermometer className="w-5 h-5 mr-2 text-blue-400" />
              <div>
                <span className="text-sm">Feels like</span>
                <p className="font-semibold">
                  {Math.round(weatherData.main.feels_like)}
                  {tempUnit}
                </p>
              </div>
            </div>

            <div className="flex items-center text-gray-300 bg-gray-700/30 p-3 rounded-md">
              <Droplets className="w-5 h-5 mr-2 text-blue-400" />
              <div>
                <span className="text-sm">Humidity</span>
                <p className="font-semibold">{weatherData.main.humidity}%</p>
              </div>
            </div>

            <div className="flex items-center text-gray-300 bg-gray-700/30 p-3 rounded-md">
              <Wind className="w-5 h-5 mr-2 text-blue-400" />
              <div>
                <span className="text-sm">Wind</span>
                <p className="font-semibold">
                  {weatherData.wind.speed} {windUnit}
                </p>
              </div>
            </div>

            <div className="flex items-center text-gray-300 bg-gray-700/30 p-3 rounded-md">
              <Compass className="w-5 h-5 mr-2 text-blue-400" />
              <div>
                <span className="text-sm">Direction</span>
                <p className="font-semibold">
                  {getWindDirection(weatherData.wind.deg)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Extended Weather Details */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="flex items-center text-gray-300 bg-gray-700/30 p-3 rounded-md">
            <Eye className="w-5 h-5 mr-2 text-blue-400" />
            <div>
              <span className="text-sm">Visibility</span>
              <p className="font-semibold">
                {formatVisibility(weatherData.visibility)} {visibilityUnit}
              </p>
            </div>
          </div>

          <div className="flex items-center text-gray-300 bg-gray-700/30 p-3 rounded-md">
            <Gauge className="w-5 h-5 mr-2 text-blue-400" />
            <div>
              <span className="text-sm">Pressure</span>
              <p className="font-semibold">{weatherData.main.pressure} hPa</p>
            </div>
          </div>

          <div className="flex items-center text-gray-300 bg-gray-700/30 p-3 rounded-md">
            <Cloud className="w-5 h-5 mr-2 text-blue-400" />
            <div>
              <span className="text-sm">Clouds</span>
              <p className="font-semibold">{weatherData.clouds.all}%</p>
            </div>
          </div>

          {weatherData.rain && (
            <div className="flex items-center text-gray-300 bg-gray-700/30 p-3 rounded-md">
              <CloudRain className="w-5 h-5 mr-2 text-blue-400" />
              <div>
                <span className="text-sm">Rain (1h)</span>
                <p className="font-semibold">
                  {weatherData.rain["1h"]} mm
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sun Times and Temperature Range */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-700">
          <div className="flex items-center justify-center sm:justify-start text-gray-300">
            <Sun className="w-5 h-5 mr-2 text-yellow-400" />
            <div>
              <span className="text-sm">Sunrise</span>
              <p className="font-semibold">
                {getSunTime(weatherData.sys.sunrise)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start text-gray-300">
            <Sunset className="w-5 h-5 mr-2 text-orange-400" />
            <div>
              <span className="text-sm">Sunset</span>
              <p className="font-semibold">
                {getSunTime(weatherData.sys.sunset)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start text-gray-300">
            <Thermometer className="w-5 h-5 mr-2 text-red-400" />
            <div>
              <span className="text-sm">Min/Max</span>
              <p className="font-semibold">
                {Math.round(weatherData.main.temp_min)}/
                {Math.round(weatherData.main.temp_max)}
                {tempUnit}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;