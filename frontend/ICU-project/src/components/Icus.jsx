import { useState } from "react";
import styles from "./Icus.module.css";
import socket from "../socket.js";
import { useNavigate } from "react-router-dom";

function Icus({ userId, specialization, icus }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleReserveICU = async (icuId) => {
    try {
      await axios.post("http://localhost:3030/patient/reserve-icu", {
        userId,
        icuId,
      });
      alert("ICU reserved successfully!");
      navigate(`/UpdateDetails/${userId}/${icuId}`);
    } catch (err) {
      console.error("Error reserving ICU:", err);
      alert("Failed to reserve ICU. Please try again.");
    }
  };

  const filteredICUs = icus.filter(
    (icu) => icu.specialization === specialization
  );

  if (filteredICUs.length === 0) {
    return (
      <p>
        No ICUs available for the specialization &quot;{specialization}&quot;
        near your location.
      </p>
    );
  }

  return (
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
  );
}

export default Icus;
