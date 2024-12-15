import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import styles from "./Map.module.css";
import "leaflet/dist/leaflet.css";


// eslint-disable-next-line react/prop-types
function Map({ icus, latitude, longitude}) {
  if (!icus) return <p>Loading...</p>;
  return (
    <div className={styles.container}>
      <MapContainer
        center={[latitude,longitude]} 
        
        zoom={15}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {icus.map((icu) => (
          <Marker
            key={icu._id}
            position={[
              icu.hospital.location.coordinates[0],
              icu.hospital.location.coordinates[1],
            ]}
          >
            <Popup>
              <h3>{icu.hospital.name}</h3>
              <p>Address: {icu.hospital.address}</p>
              <p>Specialization: {icu.specialization}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;
