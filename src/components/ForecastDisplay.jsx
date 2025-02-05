import { Droplets, Wind } from "lucide-react"

const ForecastDisplay = ({ forecastData, unit }) => {
  const tempUnit = unit === "metric" ? "°C" : "°F"
  const windUnit = unit === "metric" ? "m/s" : "mph"

  const fiveDayForecast = forecastData.list.filter((item, index) => index % 8 === 0)

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-bold mb-4">5-Day Forecast</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {fiveDayForecast.map((day, index) => (
          <div key={index} className="bg-gray-700/30 p-4 rounded-md">
            <p className="text-lg font-bold mb-2">
              {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>
            <div className="flex items-center justify-center mb-2">
              <img
                src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt={day.weather[0].description}
                className="w-16 h-16"
              />
            </div>
            <p className="text-3xl font-bold text-center mb-2">
              {Math.round(day.main.temp)}
              {tempUnit}
            </p>
            <p className="text-center mb-2 capitalize">{day.weather[0].description}</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Droplets className="w-4 h-4 mr-1" />
                <span>{day.main.humidity}%</span>
              </div>
              <div className="flex items-center">
                <Wind className="w-4 h-4 mr-1" />
                <span>
                  {day.wind.speed} {windUnit}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ForecastDisplay

