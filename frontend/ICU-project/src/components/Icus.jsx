import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Icus.module.css";
import socket from "../socket.js";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

// // Connect to the backend via Socket.IO
// const socket = io("http://localhost:3030");

function Icus({ userId, specialization }) {
  const [location, setLocation] = useState(null);
  const [icus, setICUs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch location and ICUs on mount
  useEffect(() => {
    const fetchLocationAndICUs = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });

            try {
              setLoading(true);
              const response = await axios.get(
                "http://localhost:3030/patient/get-available-icus",
                {
                  params: {
                    userLocation: `${longitude},${latitude}`,
                  },
                }
              );
              setICUs(response.data.icus || []);
            } catch (err) {
              console.error("Error fetching ICUs:", err);
              setError("Unable to fetch ICUs. Please try again later.");
            } finally {
              setLoading(false);
            }
          },
          (err) => {
            console.error("Error fetching location:", err.message);
            switch (err.code) {
              case err.PERMISSION_DENIED:
                setError(
                  "Location access was denied. Please enable location permissions."
                );
                break;
              case err.POSITION_UNAVAILABLE:
                setError("Location information is unavailable.");
                break;
              case err.TIMEOUT:
                setError("The request to get your location timed out.");
                break;
              default:
                setError("An unknown error occurred while fetching location.");
            }
          }
        );
      } else {
        setError("Geolocation is not supported by your browser.");
      }
    };

    fetchLocationAndICUs();

    // Listen for real-time ICU updates
    const handleICUUpdate = (updatedICUs) => {
      setICUs(updatedICUs);
    };
    socket.on("icuUpdated", handleICUUpdate);

    // Cleanup the socket listener on unmount
    return () => {
      socket.off("icuUpdated", handleICUUpdate);
    };
  }, [userId]);

  const handleReserveICU = async (icuId) => {
    try {
      await axios.post(`http://localhost:3030/patient/reserve-icu`, {
        userId,
        icuId,
      });
      alert("ICU reserved successfully!");

      // Use the navigate function to redirect
      navigate(`/UpdateDetails/${userId}/${icuId}`);

      // Trigger the parent popup handler
      // if (onReserveICU) {
      //   onReserveICU();
      // }

      // Update the ICUs list with the new reserved ICU
      setICUs((prevICUs) =>
        prevICUs.map((icu) =>
          icu._id === icuId
            ? { ...icu, status: "Occupied", isReserved: true }
            : icu
        )
      );
    } catch (err) {
      console.error("Error reserving ICU:", err);
      alert("Failed to reserve ICU. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading ICUs...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  // Filter the ICUs based on the selected specialization
  const filteredICUs = icus.filter(
    (icu) => icu.specialization === specialization
  );

  return (
    <div className={styles.homeContainer}>
      {filteredICUs.length === 0 ? (
        <p>
          No ICUs available for the specialization &quot;{specialization}&quot;
          near your location.
        </p>
      ) : (
        <ul className={styles.icuList}>
          {filteredICUs.map((icu) => (
            <li key={icu._id} className={styles.icuItem}>
              <h3>{icu.hospital ? icu.hospital.name : "Not assigned"}</h3>
              <p>Address: {icu.hospital.address}</p>
              <p>Specialization: {icu.specialization}</p>
              <p>Fees: ${icu.fees}</p>
              <button
                onClick={() => handleReserveICU(icu._id)}
                className={styles.reserveButton}
                disabled={icu.status === "Occupied"}
              >
                {icu.status === "Occupied" ? "Reserved" : "Reserve"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Icus;
