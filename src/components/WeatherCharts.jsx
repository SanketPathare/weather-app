import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const WeatherCharts = ({ weatherData, unit }) => {
  const tempUnit = unit === "metric" ? "°C" : "°F";
  const windUnit = unit === "metric" ? "m/s" : "mph";

  const chartData = [
    { name: "Temperature", value: weatherData.main.temp, unit: tempUnit },
    { name: "Feels Like", value: weatherData.main.feels_like, unit: tempUnit },
    { name: "Min Temp", value: weatherData.main.temp_min, unit: tempUnit },
    { name: "Max Temp", value: weatherData.main.temp_max, unit: tempUnit },
    { name: "Humidity", value: weatherData.main.humidity, unit: "%" },
    { name: "Wind Speed", value: weatherData.wind.speed, unit: windUnit },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-gray-100">
          Weather Details
        </h2>

        <div className="bg-gray-900 p-4 rounded-md">
          <ResponsiveContainer width="100%" height={400} className="mt-4">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="name"
                stroke="#9CA3AF"
                tick={{ fill: "#9CA3AF" }}
              />
              <YAxis stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  paddingTop: "20px",
                  color: "#9CA3AF",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ fill: "#8B5CF6", strokeWidth: 2 }}
                activeDot={{ r: 8, fill: "#A78BFA" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-900 mb-1">{label}</p>
        <p className="text-purple-600">
          {`${payload[0].value.toFixed(2)} ${payload[0].payload.unit}`}
        </p>
      </div>
    );
  }
  return null;
};

export default WeatherCharts;
