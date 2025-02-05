"use client"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { FaMapMarkerAlt } from "react-icons/fa";
import "leaflet/dist/leaflet.css"
import L from "leaflet"

const WeatherMap = ({ location, weatherData }) => {
  const position = [location.lat, location.lon]

  const icon = L.icon({
    iconUrl: "/marker-icon.png",
    iconSize: [25, 25],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  })

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-bold mb-4">Weather Map</h2>
      <div style={{ height: "400px", width: "100%" }}>
        <MapContainer center={position} zoom={10} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position} icon={icon}>
            <Popup>
              <div>
                <h3 className="font-bold">{weatherData.name}</h3>
                <p>{weatherData.weather[0].description}</p>
                <p>Temperature: {Math.round(weatherData.main.temp)}°C</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  )
}

export default WeatherMap

