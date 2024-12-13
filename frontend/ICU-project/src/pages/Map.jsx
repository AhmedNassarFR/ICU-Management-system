import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function Map() {
  // State to store latitude and longitude values
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  useEffect(() => {
    // Check if geolocation is available in the browser
    if (navigator.geolocation) {
      // Get current position using the browser's geolocation API
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Set the state with the retrieved latitude and longitude
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  // If the geolocation hasn't been retrieved yet, display a loading message
  if (lat === null || lng === null) {
    return (
      <div>
        <h2>Loading map...</h2>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Your Location on the Map</h1>
      <MapContainer
        center={[lat, lng]}
        zoom={18}
        style={{ width: "50vh", height: "50vh" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[29.986433, 31.305176]}>
          <Popup>
            Your current location: <br /> Latitude: {lat}, Longitude: {lng}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default Map;
