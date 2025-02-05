import { Wind, AlertCircle, Info, Activity } from "lucide-react";

const AirQuality = ({ airQualityData }) => {
  const getAirQualityLabel = (aqi) => {
    const labels = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
    return labels[aqi - 1] || "Unknown";
  };

  const getAirQualityColor = (aqi) => {
    const colors = [
      "bg-green-500/80",
      "bg-yellow-500/80",
      "bg-orange-500/80",
      "bg-red-500/80",
      "bg-purple-500/80",
    ];
    return colors[aqi - 1] || "bg-gray-500/80";
  };

  const getAirQualityTextColor = (aqi) => {
    const colors = [
      "text-green-500",
      "text-yellow-500",
      "text-orange-500",
      "text-red-500",
      "text-purple-500",
    ];
    return colors[aqi - 1] || "text-gray-500";
  };

  const getHealthImplications = (aqi) => {
    const implications = {
      1: "Air quality is considered satisfactory, and air pollution poses little or no risk.",
      2: "Air quality is acceptable; however, some pollutants may be of concern for a small number of people.",
      3: "Members of sensitive groups may experience health effects. General public is less likely to be affected.",
      4: "Everyone may begin to experience health effects. Members of sensitive groups may experience more serious effects.",
      5: "Health warnings of emergency conditions. The entire population is more likely to be affected.",
    };
    return implications[aqi] || "No health implications data available";
  };

  const getPollutantInfo = (key) => {
    const pollutants = {
      co: {
        name: "Carbon Monoxide",
        description: "Colorless, odorless gas that can be harmful when inhaled",
      },
      no2: {
        name: "Nitrogen Dioxide",
        description: "Reddish-brown gas with a pungent, acrid odor",
      },
      o3: {
        name: "Ozone",
        description: "A reactive form of oxygen that can affect breathing",
      },
      so2: {
        name: "Sulfur Dioxide",
        description: "Colorless gas with a sharp, pungent odor",
      },
      pm2_5: {
        name: "PM2.5",
        description: "Fine particulate matter smaller than 2.5 micrometers",
      },
      pm10: {
        name: "PM10",
        description: "Particulate matter smaller than 10 micrometers",
      },
      nh3: {
        name: "Ammonia",
        description: "Colorless gas with a characteristic pungent smell",
      },
    };
    return (
      pollutants[key] || {
        name: key.toUpperCase(),
        description: "No description available",
      }
    );
  };

  const aqi = airQualityData.list[0].main.aqi;

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg mt-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-100 flex items-center">
          <Activity className="w-6 h-6 mr-2" />
          Air Quality Index
        </h2>
        <div className="flex items-center gap-2">
          <Wind className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-400">Updated regularly</span>
        </div>
      </div>

      {/* Main AQI Display */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
        <div
          className={`w-32 h-32 rounded-full flex flex-col items-center justify-center ${getAirQualityColor(
            aqi
          )} transition-colors duration-300`}
        >
          <span className="text-3xl font-bold text-white">{aqi}</span>
          <span className="text-sm font-medium text-white">AQI</span>
        </div>

        <div className="text-center sm:text-left">
          <p
            className={`text-2xl sm:text-3xl font-bold ${getAirQualityTextColor(
              aqi
            )} mb-2`}
          >
            {getAirQualityLabel(aqi)}
          </p>
          <p className="text-gray-300 text-sm sm:text-base max-w-xl">
            {getHealthImplications(aqi)}
          </p>
        </div>
      </div>

      {/* Pollutants Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.entries(airQualityData.list[0].components).map(
          ([key, value]) => {
            const pollutant = getPollutantInfo(key);
            return (
              <div
                key={key}
                className="bg-gray-700/30 p-4 rounded-lg hover:bg-gray-700/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-100">
                    {pollutant.name}
                  </h3>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-100 mb-1">
                  {value.toFixed(1)}
                  <span className="text-sm font-normal text-gray-400 ml-1">
                    µg/m³
                  </span>
                </p>
                <p className="text-xs text-gray-400 line-clamp-2">
                  {pollutant.description}
                </p>
              </div>
            );
          }
        )}
      </div>

      {/* Health Advisory */}
      {aqi > 2 && (
        <div className="mt-6 flex items-start gap-3 bg-gray-700/30 p-4 rounded-lg">
          <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-100 mb-1">
              Health Advisory
            </h3>
            <p className="text-sm text-gray-300">
              {aqi > 3
                ? "Consider reducing outdoor activities and wearing a mask when outside."
                : "Sensitive individuals should consider reducing prolonged outdoor activities."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AirQuality;
