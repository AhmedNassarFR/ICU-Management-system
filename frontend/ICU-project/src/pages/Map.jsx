import React, { useState, useEffect } from "react";
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
  }, []); // Only run once when the component mounts

  // If the geolocation hasn't been retrieved yet, display a loading message
  if (lat === null || lng === null) {
    return <div>Loading map...</div>;
  }

  return (
    <div className="App">
      <h1>Your Location on the Map</h1>
      <MapContainer
        center={[lat, lng]} // Dynamically set center from GPS
        zoom={20} // Zoom level
        style={{ width: "100vh", height: "100vh" }} // Map container size
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // Tile server
        />
        <Marker position={[lat, lng]}> {/* Dynamically set marker position */}
          <Popup>
            Your current location: <br /> Latitude: {lat}, Longitude: {lng}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default Map;
