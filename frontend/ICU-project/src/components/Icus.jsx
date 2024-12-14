import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Icus.module.css";
import socket from "../socket.js";

function Icus({ userId, specialization, onReserveICU }) {
  const [location, setLocation] = useState(null);
  const [icus, setICUs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
                  params: { userLocation: `${longitude},${latitude}` },
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
          (err) => setError("Error fetching location.", err)
        );
      } else {
        setError("Geolocation is not supported by your browser.");
      }
    };

    fetchLocationAndICUs();
    socket.on("icuUpdated", setICUs);
    return () => socket.off("icuUpdated", setICUs);
  }, [userId]);

  const handleReserveICU = async (icuId) => {
    try {
      await axios.post(`http://localhost:3030/patient/reserve-icu`, {
        userId,
        icuId,
      });
      alert("ICU reserved successfully!");

      // Update the ICUs list with the new reserved ICU
      setICUs((prevICUs) =>
        prevICUs.map((icu) =>
          icu._id === icuId
            ? { ...icu, status: "Occupied", isReserved: true }
            : icu
        )
      );
    } catch (err) {
      alert("Failed to reserve ICU. Try again.", err);
    }
  };

  return (
    <div className={styles.homeContainer}>
      {filteredICUs.length === 0 ? (
        <p>
          No ICUs available for the specialization "{specialization}" near your
          location.
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
